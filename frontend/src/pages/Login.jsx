import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FloatingButton from '../components/FloatingButton'

const Login = () => {
  const { login, token } = useAuth()
  const navigate = useNavigate()
  const [buttonPosition, setButtonPosition] = useState({ x: 50, y: 50 })
  const [isMoving, setIsMoving] = useState(true)
  const [showBackground, setShowBackground] = useState(false)
  const buttonRef = useRef(null)
  const moveIntervalRef = useRef(null)

  useEffect(() => {
    if (token) {
      navigate('/dashboard')
    }
  }, [token, navigate])

  useEffect(() => {
    // Show background image for first 5 seconds
    setShowBackground(true)
    const bgTimer = setTimeout(() => {
      setShowBackground(false)
    }, 5000)

    // Move button randomly for first 5 seconds
    if (isMoving) {
      moveIntervalRef.current = setInterval(() => {
        const maxX = window.innerWidth - 200 // Button width approx
        const maxY = window.innerHeight - 100 // Button height approx
        const newX = Math.random() * maxX
        const newY = Math.random() * maxY
        
        setButtonPosition({ x: newX, y: newY })
      }, 200) // Move every 200ms

      // Stop moving after 5 seconds
      const stopTimer = setTimeout(() => {
        setIsMoving(false)
        if (moveIntervalRef.current) {
          clearInterval(moveIntervalRef.current)
        }
        // Set button to center position
        setButtonPosition({ x: 50, y: 50 })
      }, 5000)

      return () => {
        clearTimeout(bgTimer)
        clearTimeout(stopTimer)
        if (moveIntervalRef.current) {
          clearInterval(moveIntervalRef.current)
        }
      }
    }
  }, [isMoving])

  const buttonStyle = isMoving
    ? {
        position: 'fixed',
        left: `${buttonPosition.x}px`,
        top: `${buttonPosition.y}px`,
        transform: 'translate(-50%, -50%)',
        transition: 'none',
        zIndex: 1000
      }
    : {
        position: 'relative',
        left: 'auto',
        top: 'auto',
        transform: 'none',
        transition: 'all 0.3s ease'
      }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: showBackground 
          ? 'url(https://media.licdn.com/dms/image/v2/D4D12AQEtKoU7EZ4Z0g/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1737213403488?e=2147483647&v=beta&t=BCp0_eK6_6f9P45eHzEOlsHjpASybsaPebrH5WXNzCo)'
          : 'linear-gradient(to bottom right, #667eea, #764ba2)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="text-center space-y-8 relative z-10">
        <div className="space-y-4">
          <h1 className="text-7xl font-black text-white drop-shadow-2xl">
            🎉 FaltuVerse 🎉
          </h1>
          <p className="text-2xl text-white font-bold">
            Pure Entertainment for No Reason
          </p>
        </div>

        <div className="mt-12 space-y-4">
          <FloatingButton
            ref={buttonRef}
            onClick={login}
            className="bg-white text-purple-600 hover:bg-purple-100 shadow-2xl"
            style={buttonStyle}
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              <span>{isMoving ? 'Click me if you can' : 'LOGIN KARLE YA SOJA'}</span>
              {!isMoving && <span className="text-2xl">🌀</span>}
            </span>
          </FloatingButton>
        </div>

        <div className="mt-8 space-y-2">
          <p className="text-white text-lg font-semibold">
            Join the chaos! Random chat rooms, lucky draws, and pointless fun await.
          </p>
          <div className="flex justify-center gap-4 text-4xl">
            <span>💬</span>
            <span>🎰</span>
            <span>💥</span>
            <span>😂</span>
            <span>🎊</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
