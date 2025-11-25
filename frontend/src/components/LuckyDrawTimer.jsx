import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import { triggerConfettiBurst } from '../utils/confettiBlast'
import LuckyDrawCountdown from './LuckyDrawCountdown'

const LuckyDrawTimer = () => {
  const { token } = useAuth()
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes default
  const [showCountdown, setShowCountdown] = useState(false)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!token) return

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const socketUrl = baseUrl.replace('/api', '').replace(/\/$/, '')

    const newSocket = io(socketUrl, {
      auth: { token }
    })

    // Listen for backend-driven timer updates
    newSocket.on('lucky_draw_timer', (data) => {
      setTimeLeft(data.timeLeft)
    })

    // Listen for draw results
    newSocket.on('lucky_draw_result', (data) => {
      if (data.type === 'winner') {
        setShowCountdown(true)
        triggerConfettiBurst()
        setTimeout(() => {
          setShowCountdown(false)
        }, 8000)
      } else {
        setShowCountdown(true)
        setTimeout(() => {
          setShowCountdown(false)
        }, 5000)
      }
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [token])

  // Show countdown when 10 seconds left
  useEffect(() => {
    if (timeLeft <= 10 && timeLeft > 0 && !showCountdown) {
      setShowCountdown(true)
    }
    if (timeLeft > 10) {
      setShowCountdown(false)
    }
  }, [timeLeft, showCountdown])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (showCountdown && timeLeft <= 10) {
    return (
      <>
        <LuckyDrawCountdown onClose={() => setShowCountdown(false)} />
        {/* Keep timer visible but behind */}
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border-2 border-yellow-400">
            <div className="text-center">
              <div className="text-2xl mb-2">🎰</div>
              <div className="text-sm text-gray-600 mb-1">Next Lucky Draw</div>
              <div className="text-3xl font-black text-purple-600 mb-2">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-4 shadow-2xl border-2 border-yellow-400 animate-pulse-crazy">
        <div className="text-center">
          <div className="text-2xl mb-2">🎰</div>
          <div className="text-sm text-gray-600 mb-1">Next Lucky Draw</div>
          <div className="text-3xl font-black text-purple-600 mb-2">
            {formatTime(timeLeft)}
          </div>
          {timeLeft <= 60 && (
            <div className="text-xs text-red-500 font-bold animate-pulse">
              Abhi Abhi!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LuckyDrawTimer
