import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FloatingButton from '../components/FloatingButton'
import api from '../api/axios'

const Login = () => {
  const { login, token } = useAuth()
  const navigate = useNavigate()
  const [buttonPosition, setButtonPosition] = useState({ x: 50, y: 50 })
  const [isMoving, setIsMoving] = useState(true)
  const [showBackground, setShowBackground] = useState(false)
  const [showEmailLogin, setShowEmailLogin] = useState(false)
  const [emailCreds, setEmailCreds] = useState({ email: '', password: '', name: '' })
  const [emailLoading, setEmailLoading] = useState(false)
  const [faltuConfirmed, setFaltuConfirmed] = useState(false)
  const buttonRef = useRef(null)
  const moveIntervalRef = useRef(null)

  useEffect(() => {
    if (token) {
      navigate('/dashboard')
    }
  }, [token, navigate])

  useEffect(() => {
    console.log('🎯 Starting button movement...')
    
    // Move button randomly for first 5 seconds
    moveIntervalRef.current = setInterval(() => {
      const buttonWidth = 250
      const buttonHeight = 80
      const maxX = window.innerWidth - buttonWidth
      const maxY = window.innerHeight - buttonHeight
      const minX = buttonWidth / 2
      const minY = buttonHeight / 2
      
      const newX = Math.random() * (maxX - minX) + minX
      const newY = Math.random() * (maxY - minY) + minY
      
      console.log('📍 Moving button to:', { x: newX, y: newY })
      setButtonPosition({ x: newX, y: newY })
    }, 400) // Move every 400ms - slower movement

    // Stop moving after 5 seconds
    const stopTimer = setTimeout(() => {
      console.log('⏹️ Stopping button movement')
      setIsMoving(false)
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current)
      }
    }, 5000)

    // Show background image AFTER button stops moving (after 5 seconds)
    const bgTimer = setTimeout(() => {
      console.log('🖼️ Showing background image')
      setShowBackground(true)
      // Hide background image after next 5 seconds
      setTimeout(() => {
        console.log('🖼️ Hiding background image')
        setShowBackground(false)
      }, 5000)
    }, 5000)

    return () => {
      clearTimeout(stopTimer)
      clearTimeout(bgTimer)
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current)
      }
    }
  }, [])

  const handleGoogleLogin = () => {
    if (!faltuConfirmed) {
      alert('Pehle confirm karo ki tum faltu ho! 😄')
      return
    }
    login()
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    
    if (!faltuConfirmed) {
      alert('Pehle confirm karo ki tum faltu ho! 😄')
      return
    }
    
    setEmailLoading(true)
    try {
      const response = await api.post('/auth/email', {
        email: emailCreds.email,
        password: emailCreds.password,
        name: emailCreds.name || undefined // Only send name if provided
      })
      
      const { token: jwtToken, user: userData } = response.data
      
      // Set token and user in localStorage and update context
      localStorage.setItem('token', jwtToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`
      
      // Force page reload to update auth context
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Email login failed:', error)
      const errorMsg = error.response?.data?.error || error.message || 'Email login failed'
      alert(`Login failed: ${errorMsg}`)
    } finally {
      setEmailLoading(false)
    }
  }

  const buttonStyle = isMoving
    ? {
        position: 'fixed',
        left: `${buttonPosition.x}px`,
        top: `${buttonPosition.y}px`,
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.3s ease, top 0.3s ease', // Smooth transition
        zIndex: 1000,
        pointerEvents: 'auto'
      }
    : {
        position: 'relative',
        left: 'auto',
        top: 'auto',
        transform: 'none',
        transition: 'all 0.5s ease',
        zIndex: 10
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

        {/* Faltu Confirmation Checkbox - Always visible */}
        <div className={`bg-white bg-opacity-90 rounded-2xl p-4 max-w-md mx-auto shadow-xl ${isMoving ? 'mt-8' : 'mt-4'}`}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={faltuConfirmed}
              onChange={(e) => setFaltuConfirmed(e.target.checked)}
              className="w-5 h-5 text-purple-600 border-2 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
            />
            <span className="text-gray-800 font-semibold text-sm">
              ✅ Confirm that you are <span className="text-purple-600 font-bold">FALTU</span> now and do not have anything productive to do
            </span>
          </label>
        </div>

        {isMoving ? (
          <button
            onClick={handleGoogleLogin}
            className={`bg-white text-purple-600 hover:bg-purple-100 shadow-2xl px-6 py-4 rounded-2xl font-bold text-lg cursor-pointer ${!faltuConfirmed ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={buttonStyle}
            disabled={!faltuConfirmed}
          >
            <span className="flex items-center gap-3 whitespace-nowrap">
              <span className="text-2xl">🚀</span>
              <span>Click me if you can</span>
            </span>
          </button>
        ) : (
          <div className="mt-4 space-y-4">
            <FloatingButton
              onClick={handleGoogleLogin}
              className={`bg-white text-purple-600 hover:bg-purple-100 shadow-2xl ${!faltuConfirmed ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!faltuConfirmed}
            >
              <span className="flex items-center gap-3 whitespace-nowrap">
                <span className="text-2xl">🚀</span>
                <span>LOGIN WITH GOOGLE</span>
                <span className="text-2xl">🌀</span>
              </span>
            </FloatingButton>
            
            <button
              onClick={() => setShowEmailLogin(!showEmailLogin)}
              className="text-white text-sm underline hover:no-underline mt-2"
            >
              {showEmailLogin ? 'Hide' : 'Show'} Email/Password Login
            </button>

            {showEmailLogin && (
              <form 
                onSubmit={handleEmailLogin}
                className="bg-white bg-opacity-90 rounded-2xl p-6 space-y-4 max-w-md mx-auto shadow-2xl mt-4"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Email/Password Login</h3>
                
                <input
                  type="email"
                  placeholder="Email"
                  value={emailCreds.email}
                  onChange={(e) => setEmailCreds({...emailCreds, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                  disabled={emailLoading}
                />
                
                <input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={emailCreds.password}
                  onChange={(e) => setEmailCreds({...emailCreds, password: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  required
                  minLength={6}
                  disabled={emailLoading}
                />
                
                <input
                  type="text"
                  placeholder="Name (optional - for new users)"
                  value={emailCreds.name}
                  onChange={(e) => setEmailCreds({...emailCreds, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  disabled={emailLoading}
                />
                
                <button
                  type="submit"
                  disabled={emailLoading || !faltuConfirmed}
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {emailLoading ? 'Logging in...' : 'Login / Sign Up'}
                </button>
                
                {!faltuConfirmed && (
                  <p className="text-xs text-red-600 text-center font-semibold">
                    ⚠️ Pehle faltu confirm karo! 😄
                  </p>
                )}
                
                <p className="text-xs text-gray-600 text-center">
                  Agar user nahi hai, naya account ban jayega automatically!
                </p>
              </form>
            )}
          </div>
        )}

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
