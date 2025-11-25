import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import FloatingButton from '../components/FloatingButton'
import { triggerConfettiBurst } from '../utils/confettiBlast'

const Tambola = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [socket, setSocket] = useState(null)
  const [room, setRoom] = useState(null)
  const [ticket, setTicket] = useState(null)
  const [registeredUsers, setRegisteredUsers] = useState([])
  const [calledNumbers, setCalledNumbers] = useState([])
  const [currentNumber, setCurrentNumber] = useState(null)
  const [gameStatus, setGameStatus] = useState('waiting') // waiting, active, completed
  const [winners, setWinners] = useState([])
  const [isRegistered, setIsRegistered] = useState(false)
  const [loading, setLoading] = useState(false)
  const socketRef = useRef(null)

  // Initialize socket
  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token }
    })

    socketRef.current = newSocket

    newSocket.on('connect', () => {
      console.log('🎲 Tambola socket connected')
      fetchRoom()
    })

    newSocket.on('tambola_room_created', (data) => {
      console.log('🎲 New room created:', data)
      fetchRoom()
    })

    newSocket.on('tambola_game_started', (data) => {
      console.log('🎲 Game started:', data)
      setGameStatus('active')
      fetchRoom()
    })

    newSocket.on('tambola_number_called', (data) => {
      console.log('🎲 Number called:', data)
      setCurrentNumber(data.number)
      setCalledNumbers(data.called_numbers || [])
    })

    newSocket.on('tambola_winner', (data) => {
      console.log('🎲 Winner:', data)
      setWinners(prev => [...prev, data.winner])
      triggerConfettiBurst()
      alert(`${data.winner.name} ne ${data.winner.win_type} complete kar liya! 🎉`)
    })

    newSocket.on('tambola_game_completed', (data) => {
      console.log('🎲 Game completed:', data)
      setGameStatus('completed')
      if (data.winner_user_id) {
        triggerConfettiBurst()
      }
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [token, navigate])

  // Fetch room and ticket
  const fetchRoom = async () => {
    try {
      const response = await api.get('/tambola/room')
      if (response.data.success) {
        setRoom(response.data.room)
        setGameStatus(response.data.room.status)
        setCalledNumbers(response.data.room.called_numbers || [])
        setCurrentNumber(response.data.room.current_number)
        setRegisteredUsers(response.data.room.registered_users || [])
        
        // Check if user is registered
        const userRegistered = response.data.room.registered_users.some(
          u => u.user_id === user?.user_id
        )
        setIsRegistered(userRegistered)
        
        // Fetch ticket if registered
        if (userRegistered) {
          fetchTicket(response.data.room.room_id)
        }
      }
    } catch (error) {
      console.error('Fetch room error:', error)
    }
  }

  // Fetch user's ticket
  const fetchTicket = async (roomId) => {
    try {
      const response = await api.get(`/tambola/ticket/${roomId}`)
      if (response.data.success) {
        setTicket(response.data.ticket)
      }
    } catch (error) {
      console.error('Fetch ticket error:', error)
    }
  }

  // Register for tambola
  const handleRegister = async () => {
    if (!room) return
    
    setLoading(true)
    try {
      const response = await api.post('/tambola/register', {
        room_id: room.room_id
      })
      
      if (response.data.success) {
        setIsRegistered(true)
        setTicket(response.data.ticket)
        setRegisteredUsers(response.data.registered_users || [])
        alert('Tambola mein register ho gaye! 🎉')
      }
    } catch (error) {
      console.error('Register error:', error)
      alert(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  // Check if number is marked
  const isNumberMarked = (num) => {
    if (!ticket || !num) return false
    return ticket.marked_numbers?.includes(num) || false
  }

  // Check if number is in ticket
  const isNumberInTicket = (num) => {
    if (!ticket || !num) return false
    const ticketNumbers = ticket.ticket_numbers || []
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 9; col++) {
        if (ticketNumbers[row]?.[col] === num) {
          return true
        }
      }
    }
    return false
  }

  // Render ticket cell
  const renderTicketCell = (row, col) => {
    const num = ticket?.ticket_numbers?.[row]?.[col]
    const marked = num && isNumberMarked(num)
    const called = num && calledNumbers.includes(num)
    
    return (
      <div
        key={`${row}-${col}`}
        className={`
          w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center
          text-lg md:text-xl font-black transition-all duration-300
          ${num 
            ? marked 
              ? 'bg-green-500 text-white scale-110 shadow-lg' 
              : called 
                ? 'bg-yellow-400 text-gray-800 scale-105' 
                : 'bg-white text-gray-800'
            : 'bg-gray-200'
          }
          ${called && !marked ? 'animate-pulse' : ''}
        `}
      >
        {num || ''}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-600 p-4 md:p-6">
      <header className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-center">
          <FloatingButton
            onClick={() => navigate('/dashboard')}
            className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
          >
            ← Back
          </FloatingButton>
          <h1 className="text-3xl md:text-4xl font-black text-white drop-shadow-2xl animate-pulse-crazy">
            🎲 Tambola Game
          </h1>
          <div></div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Ticket */}
        <div className="lg:col-span-2 space-y-6">
          {/* Game Status */}
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
            <h2 className="text-2xl font-black mb-4">
              {gameStatus === 'waiting' && '⏳ Registration Open'}
              {gameStatus === 'active' && '🎮 Game Active'}
              {gameStatus === 'completed' && '🏆 Game Completed'}
            </h2>
            
            {!isRegistered && gameStatus === 'waiting' && (
              <FloatingButton
                onClick={handleRegister}
                disabled={loading}
                className="bg-green-600 text-white px-8 py-4 text-lg"
              >
                {loading ? 'Registering...' : 'Register Karo! 🎫'}
              </FloatingButton>
            )}
            
            {isRegistered && gameStatus === 'waiting' && (
              <p className="text-xl text-green-600 font-bold">
                ✅ Registered! Game start hone ka wait karo...
              </p>
            )}
          </div>

          {/* Ticket Display */}
          {ticket && (
            <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-2xl font-black mb-4 text-center">Your Ticket 🎫</h3>
              
              {/* Column headers */}
              <div className="grid grid-cols-9 gap-2 mb-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(col => (
                  <div key={col} className="text-center text-xs font-bold text-gray-600">
                    {col === 1 && '1-9'}
                    {col === 2 && '10-19'}
                    {col === 3 && '20-29'}
                    {col === 4 && '30-39'}
                    {col === 5 && '40-49'}
                    {col === 6 && '50-59'}
                    {col === 7 && '60-69'}
                    {col === 8 && '70-79'}
                    {col === 9 && '80-90'}
                  </div>
                ))}
              </div>
              
              {/* Ticket rows */}
              <div className="space-y-2">
                {[0, 1, 2].map(row => (
                  <div key={row} className="grid grid-cols-9 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(col => renderTicketCell(row, col))}
                  </div>
                ))}
              </div>
              
              {/* Completed rows */}
              {ticket.completed_rows && ticket.completed_rows.length > 0 && (
                <div className="mt-4 p-4 bg-green-100 rounded-lg">
                  <p className="font-bold text-green-800">
                    Completed: {ticket.completed_rows.join(', ')} 🎉
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Current Number Display */}
          {gameStatus === 'active' && currentNumber && (
            <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
              <p className="text-sm text-gray-600 mb-2">Current Number</p>
              <div className="text-8xl font-black text-red-600 animate-bounce">
                {currentNumber}
              </div>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          {/* Called Numbers Board */}
          {calledNumbers.length > 0 && (
            <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-black mb-4">Called Numbers</h3>
              <div className="grid grid-cols-10 gap-2 max-h-96 overflow-y-auto">
                {calledNumbers.map((num, idx) => (
                  <div
                    key={idx}
                    className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      text-sm font-bold
                      ${num === currentNumber 
                        ? 'bg-red-500 text-white scale-125 animate-pulse' 
                        : 'bg-gray-200 text-gray-800'
                      }
                    `}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Registered Players */}
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-xl font-black mb-4">
              Players ({registeredUsers.length})
            </h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {registeredUsers.map((player) => (
                <div
                  key={player.user_id}
                  className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                >
                  {player.profile_photo ? (
                    <img
                      src={player.profile_photo}
                      alt={player.name}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xs">
                      {player.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-bold text-sm">{player.name}</span>
                  {winners.some(w => w.user_id === player.user_id) && (
                    <span className="ml-auto text-green-600">🏆</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Winners List */}
          {winners.length > 0 && (
            <div className="bg-green-100 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-black mb-4 text-green-800">Winners 🏆</h3>
              <div className="space-y-2">
                {winners.map((winner, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-lg border-2 border-green-500"
                  >
                    <p className="font-bold text-green-800">
                      {winner.name} - {winner.win_type}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Tambola

