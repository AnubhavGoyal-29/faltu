import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import { triggerConfettiBurst } from '../utils/confettiBlast'

const bakchodMessages = [
  "Kuch nahi hua...",
  "Abhi kuch nahi...",
  "Wait kar rahe hain...",
  "Koi winner nahi...",
  "Next time pakka!",
  "Try again!",
  "Better luck next time!",
  "Kuch random ho sakta hai..."
]

const LuckyDrawTimer = () => {
  const { token } = useAuth()
  const [timeLeft, setTimeLeft] = useState(60)
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false)
  const [winner, setWinner] = useState(null)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!token) return

    const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      auth: { token }
    })

    newSocket.on('minute_lucky_draw', (data) => {
      setWinner(data.winner)
      setMessage(data.message)
      setShowMessage(true)
      triggerConfettiBurst()
      setTimeout(() => {
        setShowMessage(false)
        setWinner(null)
      }, 5000)
    })

    newSocket.on('minute_lucky_draw_message', (data) => {
      setMessage(data.message)
      setShowMessage(true)
      setTimeout(() => {
        setShowMessage(false)
      }, 3000)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [token])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 60 // Reset to 60
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border-2 border-yellow-400 animate-pulse-crazy">
        <div className="text-center">
          <div className="text-2xl mb-2">🎰</div>
          <div className="text-sm text-gray-600 mb-1">Next Lucky Draw</div>
          <div className="text-3xl font-black text-purple-600 mb-2">
            {timeLeft}s
          </div>
          
          {showMessage && (
            <div className="mt-2 p-2 bg-yellow-100 rounded-lg animate-bounce-silly">
              <p className="text-xs font-bold text-gray-800">
                {message}
              </p>
              {winner && (
                <div className="mt-1 flex items-center justify-center gap-2">
                  {winner.profile_photo && (
                    <img 
                      src={winner.profile_photo} 
                      alt={winner.name}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-xs font-bold text-purple-600">
                    {winner.name}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LuckyDrawTimer

