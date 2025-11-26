import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import { useIdleDetection } from '../hooks/useIdleDetection'
import FaltuPopup, { getRandomMessage } from '../components/FaltuPopup'
import FloatingButton from '../components/FloatingButton'
import { triggerConfetti } from '../utils/confettiBlast'

const ChatRoom = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [socket, setSocket] = useState(null)
  const [room, setRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [connected, setConnected] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)

  const isIdle = useIdleDetection(20000, () => {
    setShowPopup(true)
  })

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
      setConnected(true)
      newSocket.emit('join_random_room')
    })

    newSocket.on('disconnect', () => {
      setConnected(false)
    })

    newSocket.on('room_joined', (data) => {
      setRoom(data.room)
      setMessages(data.messages || [])
    })

    newSocket.on('new_message', (message) => {
      setMessages((prev) => [...prev, message])
      setMessageCount(prev => {
        const newCount = prev + 1
        // Confetti on milestones
        if (newCount % 10 === 0) {
          triggerConfetti()
        }
        return newCount
      })
      
      // Random popup encouragement
      if (Math.random() > 0.8) {
        setTimeout(() => {
          setShowPopup(true)
        }, 2000)
      }
    })

    newSocket.on('user_joined', (data) => {
      console.log(`${data.user.name} joined`)
    })

    newSocket.on('error', (error) => {
      console.error('Socket error:', error)
    })

    setSocket(newSocket)

    return () => {
      // Remove all event listeners before closing
      newSocket.removeAllListeners()
      newSocket.close()
      socketRef.current = null
    }
  }, [token, navigate])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket || !connected) return

    socket.emit('send_message', { message: newMessage.trim() })
    setNewMessage('')
  }

  const handleJoinNewRoom = () => {
    if (socket && connected) {
      socket.emit('join_random_room')
      setMessages([])
      triggerConfetti()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex flex-col">
      {showPopup && (
        <FaltuPopup
          message={getRandomMessage()}
          onClose={() => setShowPopup(false)}
          type="info"
        />
      )}

      <header className="bg-white bg-opacity-20 backdrop-blur-md p-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
          <FloatingButton
            onClick={() => navigate('/dashboard')}
            className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
          >
            ← Back
          </FloatingButton>
          
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-black text-white drop-shadow-lg animate-pulse-crazy">
              {room?.name || 'Loading...'}
            </h2>
            <span className={`text-sm ${connected ? 'text-green-200' : 'text-red-200'}`}>
              {connected ? '🟢 Connected' : '🔴 Disconnected'}
            </span>
          </div>

          <FloatingButton
            onClick={handleJoinNewRoom}
            disabled={!connected}
            className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
          >
            🎲 New Room
          </FloatingButton>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-6xl w-full mx-auto">
        {messages.length === 0 ? (
          <div className="text-center text-white text-xl mt-20 animate-float">
            <p>No messages yet. Start the conversation! 💬</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.message_id}
              className={`flex gap-3 ${msg.user.user_id === user?.user_id ? 'flex-row-reverse' : ''} animate-bounce-silly`}
            >
              <div className="w-10 h-10 flex-shrink-0">
                {msg.user.profile_photo ? (
                  <img 
                    src={msg.user.profile_photo} 
                    alt={msg.user.name} 
                    className="w-full h-full rounded-full border-2 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-white bg-opacity-30 flex items-center justify-center text-white font-bold">
                    {msg.user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className={`max-w-md rounded-3xl p-4 shadow-lg ${
                msg.user.user_id === user?.user_id
                  ? 'bg-white bg-opacity-90 text-gray-800'
                  : 'bg-white bg-opacity-30 text-white backdrop-blur-sm'
              }`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm">{msg.user.name}</span>
                  <span className="text-xs opacity-70">
                    {new Date(msg.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <p className="break-words">{msg.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSendMessage}
        className="bg-white bg-opacity-20 backdrop-blur-md p-4"
      >
        <div className="max-w-6xl mx-auto flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-6 py-4 rounded-full border-2 border-white border-opacity-30 bg-white bg-opacity-50 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white focus:ring-opacity-50 transition-all"
            disabled={!connected}
          />
          <FloatingButton
            type="submit"
            disabled={!connected || !newMessage.trim()}
            className="bg-white bg-opacity-90 text-purple-600 px-8 py-4"
          >
            Send 🚀
          </FloatingButton>
        </div>
      </form>
    </div>
  )
}

export default ChatRoom

