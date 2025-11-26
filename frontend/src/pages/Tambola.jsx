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
  const [leaderboard, setLeaderboard] = useState({ rows: [], columns: [], fullHouse: [] })
  const [lastRoundWinners, setLastRoundWinners] = useState(null)
  const [registrationTimeLeft, setRegistrationTimeLeft] = useState(300) // 5 minutes
  const [nextNumberCountdown, setNextNumberCountdown] = useState(0) // seconds until next number
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
      if (data.registration_time_remaining !== undefined) {
        setRegistrationTimeLeft(data.registration_time_remaining)
      }
      // Update last round winners when new registration begins
      if (data.last_winners) {
        setLastRoundWinners(data.last_winners)
      }
      fetchRoom()
    })
    
    newSocket.on('tambola_registration_timer', (data) => {
      if (data.room_id === room?.room_id) {
        setRegistrationTimeLeft(data.time_remaining)
      }
    })

    newSocket.on('tambola_game_started', (data) => {
      console.log('🎲 Game started:', data)
      setGameStatus('active')
      setLastRoundWinners(null) // Clear last round winners when game starts
      // Refresh room data
      fetchRoom()
      // Start fetching leaderboard
      if (data.room_id) {
        fetchLeaderboard(data.room_id)
      }
    })

    newSocket.on('tambola_number_called', (data) => {
      console.log('🎲 Number called:', data)
      setCurrentNumber(data.number)
      setCalledNumbers(data.called_numbers || [])
      // Update next number countdown
      if (data.seconds_until_next !== undefined) {
        setNextNumberCountdown(data.seconds_until_next)
      }
      // Refresh leaderboard after each number
      if (room) {
        fetchLeaderboard(room.room_id)
      }
    })

    newSocket.on('tambola_next_number_countdown', (data) => {
      if (data.room_id === room?.room_id) {
        setNextNumberCountdown(data.seconds_remaining)
      }
    })

    newSocket.on('tambola_next_number_countdown', (data) => {
      if (data.room_id === room?.room_id) {
        setNextNumberCountdown(data.seconds_remaining)
      }
    })

    newSocket.on('tambola_ticket_update', (data) => {
      console.log('🎲 Ticket updated:', data)
      if (data.ticket && data.ticket.user_id === user?.user_id) {
        setTicket(data.ticket)
      }
    })

    newSocket.on('tambola_winner', (data) => {
      console.log('🎲 Winner:', data)
      setWinners(prev => [...prev, data.winner])
      
      // Show popper/confetti for all users when winner is announced
      if (data.show_popper) {
        triggerConfettiBurst()
      }
      
      fetchLeaderboard() // Refresh leaderboard
      
      // Show notification to all active users
      alert(`${data.winner.name} ne ${data.winner.win_type} complete kar liya! 🎉`)
    })

    newSocket.on('tambola_game_completed', (data) => {
      console.log('🎲 Game completed:', data)
      setGameStatus('completed')
      if (data.winner_user_id) {
        triggerConfettiBurst()
      }
      fetchLastRoundWinners() // Fetch winners for next round
    })

    setSocket(newSocket)

    return () => {
      // Remove all event listeners before closing
      newSocket.removeAllListeners()
      newSocket.close()
      socketRef.current = null
    }
  }, [token, navigate])

  // Fetch room and ticket
  const fetchRoom = async () => {
    try {
      const response = await api.get('/tambola/room')
      if (response.data.success) {
        const roomData = response.data.room
        setRoom(roomData)
        setGameStatus(roomData.status)
        setCalledNumbers(roomData.called_numbers || [])
        setCurrentNumber(roomData.current_number)
        setRegisteredUsers(roomData.registered_users || [])
        
        // Set registration time from backend
        if (roomData.registration_time_remaining !== undefined) {
          setRegistrationTimeLeft(roomData.registration_time_remaining)
        }
        
        // Set next number countdown if game is active
        if (roomData.status === 'active' && roomData.seconds_until_next_number !== undefined) {
          setNextNumberCountdown(roomData.seconds_until_next_number)
        }
        
        // Check if user is registered
        const userRegistered = roomData.registered_users.some(
          u => u.user_id === user?.user_id
        )
        setIsRegistered(userRegistered)
        
        // Fetch ticket if registered
        if (userRegistered) {
          fetchTicket(roomData.room_id)
        }
        
        // Fetch leaderboard if game is active
        if (roomData.status === 'active') {
          fetchLeaderboard(roomData.room_id)
        }
        
        // Fetch last round winners if in waiting status
        if (roomData.status === 'waiting') {
          fetchLastRoundWinners()
        }
      }
    } catch (error) {
      console.error('Fetch room error:', error)
    }
  }
  
  // Fetch leaderboard
  const fetchLeaderboard = async (roomId) => {
    if (!roomId && !room) return
    try {
      const response = await api.get(`/tambola/leaderboard/${roomId || room.room_id}`)
      if (response.data.success) {
        setLeaderboard(response.data.leaderboard)
      }
    } catch (error) {
      console.error('Fetch leaderboard error:', error)
    }
  }
  
  // Fetch last round winners
  const fetchLastRoundWinners = async () => {
    try {
      const response = await api.get('/tambola/last-winners')
      if (response.data.success && response.data.winners) {
        setLastRoundWinners(response.data.winners)
      }
    } catch (error) {
      console.error('Fetch last winners error:', error)
    }
  }
  
  // Registration countdown timer - sync with backend
  useEffect(() => {
    if (gameStatus === 'waiting') {
      // First, use backend-provided time if available
      if (room?.registration_time_remaining !== undefined && room.registration_time_remaining > 0) {
        setRegistrationTimeLeft(room.registration_time_remaining)
      }
      
      // Then set up interval to countdown
      if (room?.registration_end_at) {
        const interval = setInterval(() => {
          const now = new Date().getTime()
          const endTime = new Date(room.registration_end_at).getTime()
          const remaining = Math.max(0, Math.floor((endTime - now) / 1000))
          setRegistrationTimeLeft(remaining)
          
          if (remaining === 0) {
            clearInterval(interval)
          }
        }, 1000)
        
        return () => clearInterval(interval)
      }
    }
  }, [gameStatus, room])

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

  // Check if number is in ticket (3x3 grid)
  const isNumberInTicket = (num) => {
    if (!ticket || !num) return false
    const ticketNumbers = ticket.ticket_numbers || []
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
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
            
            {/* Registration Phase */}
            {gameStatus === 'waiting' && (
              <>
                {!isRegistered ? (
                  <>
                    <p className="text-lg text-gray-700 mb-4">
                      Game start hoga: <span className="font-bold text-purple-600">
                        {Math.floor(registrationTimeLeft / 60)}:{(registrationTimeLeft % 60).toString().padStart(2, '0')}
                      </span> mein
                    </p>
                    <FloatingButton
                      onClick={handleRegister}
                      disabled={loading}
                      className="bg-green-600 text-white px-8 py-4 text-lg"
                    >
                      {loading ? 'Registering...' : 'Register Karo! 🎫'}
                    </FloatingButton>
                  </>
                ) : (
                  <p className="text-xl text-green-600 font-bold">
                    ✅ Registered! Game start hoga: <span className="text-purple-600">
                      {Math.floor(registrationTimeLeft / 60)}:{(registrationTimeLeft % 60).toString().padStart(2, '0')}
                    </span> mein
                  </p>
                )}
              </>
            )}
            
            {/* Active Game - Not Registered */}
            {gameStatus === 'active' && !isRegistered && (
              <div className="bg-yellow-100 rounded-2xl p-6">
                <p className="text-xl text-yellow-800 font-bold mb-2">
                  ⚠️ Game Already Started!
                </p>
                <p className="text-lg text-yellow-700">
                  Aap register nahi kar paye. Please wait for the game to finish.
                </p>
                <p className="text-sm text-yellow-600 mt-2">
                  Next game mein register kar sakte ho!
                </p>
              </div>
            )}
            
            {/* Active Game - Registered */}
            {gameStatus === 'active' && isRegistered && (
              <p className="text-xl text-blue-600 font-bold">
                🎮 Game chal rahi hai! Apna ticket check karo!
              </p>
            )}
          </div>

          {/* Ticket Display */}
          {ticket && (
            <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-2xl font-black mb-4 text-center">Your Ticket 🎫</h3>
              
              {/* 3x3 Ticket Grid */}
              <div className="space-y-2">
                {[0, 1, 2].map(row => (
                  <div key={row} className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map(col => renderTicketCell(row, col))}
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
              <div className="text-8xl font-black text-red-600 animate-bounce mb-4">
                {currentNumber}
              </div>
              {/* Next Number Countdown */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Next Number In</p>
                <div className="text-4xl font-black text-purple-600">
                  {nextNumberCountdown}s
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-6">
          {/* Registration Timer */}
          {gameStatus === 'waiting' && (
            <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
              <h3 className="text-xl font-black mb-2">Registration Time</h3>
              <div className="text-4xl font-black text-purple-600">
                {Math.floor(registrationTimeLeft / 60)}:{(registrationTimeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>
          )}

          {/* Last Round Winners (during registration) */}
          {gameStatus === 'waiting' && lastRoundWinners && (
            <div className="bg-yellow-100 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-black mb-4 text-yellow-800">Last Round Winners 🏆</h3>
              
              {lastRoundWinners.fullHouse.length > 0 && (
                <div className="mb-4">
                  <p className="font-bold text-yellow-900 mb-2">Full House:</p>
                  {lastRoundWinners.fullHouse.map((w, idx) => (
                    <div key={idx} className="p-2 bg-white rounded mb-1">
                      <span className="font-bold">{w.name}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {lastRoundWinners.rows.length > 0 && (
                <div className="mb-4">
                  <p className="font-bold text-yellow-900 mb-2">Rows:</p>
                  {lastRoundWinners.rows.map((w, idx) => (
                    <div key={idx} className="p-2 bg-white rounded mb-1">
                      <span className="font-bold">{w.name}</span> - {w.completion}
                    </div>
                  ))}
                </div>
              )}
              
              {lastRoundWinners.columns.length > 0 && (
                <div>
                  <p className="font-bold text-yellow-900 mb-2">Columns:</p>
                  {lastRoundWinners.columns.map((w, idx) => (
                    <div key={idx} className="p-2 bg-white rounded mb-1">
                      <span className="font-bold">{w.name}</span> - {w.completion}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Leaderboard (during active game) */}
          {gameStatus === 'active' && (
            <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-black mb-4">Leaderboard 🏆</h3>
              
              {leaderboard.fullHouse.length > 0 && (
                <div className="mb-4">
                  <p className="font-bold text-green-800 mb-2">Full House:</p>
                  {leaderboard.fullHouse.map((w, idx) => (
                    <div key={idx} className="p-2 bg-green-100 rounded mb-1">
                      <span className="font-bold">{w.name}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {leaderboard.rows.length > 0 && (
                <div className="mb-4">
                  <p className="font-bold text-blue-800 mb-2">Rows Completed:</p>
                  {leaderboard.rows.map((w, idx) => (
                    <div key={idx} className="p-2 bg-blue-100 rounded mb-1">
                      <span className="font-bold">{w.name}</span> - {w.completion.replace('row_', 'Row ')}
                    </div>
                  ))}
                </div>
              )}
              
              {leaderboard.columns.length > 0 && (
                <div>
                  <p className="font-bold text-purple-800 mb-2">Columns Completed:</p>
                  {leaderboard.columns.map((w, idx) => (
                    <div key={idx} className="p-2 bg-purple-100 rounded mb-1">
                      <span className="font-bold">{w.name}</span> - {w.completion.replace('col_', 'Column ')}
                    </div>
                  ))}
                </div>
              )}
              
              {leaderboard.rows.length === 0 && leaderboard.columns.length === 0 && leaderboard.fullHouse.length === 0 && (
                <p className="text-gray-600 text-center">No completions yet...</p>
              )}
            </div>
          )}

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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tambola

