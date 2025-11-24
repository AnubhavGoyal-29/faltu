import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FloatingButton from '../components/FloatingButton'
import { useRandomStyle } from '../hooks/useRandomStyle'
import api from '../api/axios'

const Login = () => {
  const { login, token } = useAuth()
  const navigate = useNavigate()
  const [bgColor, setBgColor] = useState('#667eea')
  const [animationSpeed, setAnimationSpeed] = useState(1)
  const [showSlowMessage, setShowSlowMessage] = useState(false)
  const [showAdminLogin, setShowAdminLogin] = useState(false)
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' })
  const randomStyle = useRandomStyle(3000)

  useEffect(() => {
    if (token) {
      navigate('/dashboard')
    }
  }, [token, navigate])

  useEffect(() => {
    // Slowly shifting background colors
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
      '#fa709a', '#fee140', '#30cfd0', '#330867'
    ]
    
    let colorIndex = 0
    const interval = setInterval(() => {
      colorIndex = (colorIndex + 1) % colors.length
      setBgColor(colors[colorIndex])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Progressive slowdown effect
  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationSpeed(0.5) // Slow down after 3 seconds
      setShowSlowMessage(true)
    }, 3000)

    const timer2 = setTimeout(() => {
      setAnimationSpeed(0.1) // Very slow after 5 seconds
    }, 5000)

    const timer3 = setTimeout(() => {
      setAnimationSpeed(0) // Stop completely after 7 seconds
      setShowSlowMessage(false)
    }, 7000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post('/auth/admin', adminCreds, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const { token: jwtToken, user: userData } = response.data
      
      // Set token and user in localStorage and update context
      localStorage.setItem('token', jwtToken)
      api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`
      
      // Force page reload to update auth context
      window.location.href = '/dashboard'
    } catch (error) {
      console.error('Admin login failed:', error)
      const errorMsg = error.response?.data?.error || error.message || 'Admin login failed'
      alert(`Admin login failed: ${errorMsg}\n\nUsername: admin\nPassword: admin123`)
    }
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 transition-colors duration-500"
      style={{ 
        backgroundColor: bgColor,
        animationPlayState: animationSpeed === 0 ? 'paused' : 'running'
      }}
    >
      <div 
        className="text-center space-y-8"
        style={{
          animation: animationSpeed > 0 ? `bounce-silly ${1/animationSpeed}s ease-in-out infinite` : 'none',
          transform: animationSpeed === 0 ? 'none' : undefined
        }}
      >
        <div className="space-y-4">
          <h1 
            className="text-7xl font-black text-white drop-shadow-2xl"
            style={{
              animation: animationSpeed > 0 ? `pulse-crazy ${1/animationSpeed}s ease-in-out infinite` : 'none'
            }}
          >
            🎉 FaltuVerse 🎉
          </h1>
          <p 
            className="text-2xl text-white font-bold"
            style={{
              animation: animationSpeed > 0 ? `float ${3/animationSpeed}s ease-in-out infinite` : 'none'
            }}
          >
            Pure Entertainment for No Reason
          </p>
        </div>

        {showSlowMessage && (
          <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-8 py-4 rounded-full text-2xl font-bold animate-pulse z-50">
            Too Slowwwww... Boringggg... 😴
          </div>
        )}

        <div className="mt-12 space-y-4">
          <FloatingButton
            onClick={login}
            chaos={animationSpeed > 0}
            className="bg-white text-purple-600 hover:bg-purple-100 animate-glow shadow-2xl"
            style={{
              animationDuration: animationSpeed > 0 ? `${1/animationSpeed}s` : 'none',
              animationPlayState: animationSpeed === 0 ? 'paused' : 'running'
            }}
          >
            <span className="flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              <span>LOGIN KARLE YA SOJA</span>
              <span 
                className="text-2xl"
                style={{
                  animation: animationSpeed > 0 ? `spin-slow ${3/animationSpeed}s linear infinite` : 'none'
                }}
              >
                🌀
              </span>
            </span>
          </FloatingButton>

          <button
            onClick={() => setShowAdminLogin(!showAdminLogin)}
            className="text-white text-sm underline hover:no-underline"
          >
            {showAdminLogin ? 'Hide' : 'Show'} Admin Login
          </button>

          {showAdminLogin && (
            <form 
              onSubmit={handleAdminLogin}
              className="bg-white bg-opacity-90 rounded-2xl p-6 space-y-4 max-w-md mx-auto"
            >
              <h3 className="text-xl font-bold text-gray-800">Admin Login</h3>
              <input
                type="text"
                placeholder="Username: admin"
                value={adminCreds.username}
                onChange={(e) => setAdminCreds({...adminCreds, username: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <input
                type="password"
                placeholder="Password: admin123"
                value={adminCreds.password}
                onChange={(e) => setAdminCreds({...adminCreds, password: e.target.value})}
                className="w-full px-4 py-2 border rounded-lg"
                required
              />
              <button
                type="submit"
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-700"
              >
                Admin Login
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 space-y-2">
          <p 
            className="text-white text-lg font-semibold"
            style={{
              animation: animationSpeed > 0 ? `wiggle ${0.5/animationSpeed}s ease-in-out infinite` : 'none'
            }}
          >
            Join the chaos! Random chat rooms, lucky draws, and pointless fun await.
          </p>
          <div 
            className="flex justify-center gap-4 text-4xl"
            style={{
              animation: animationSpeed > 0 ? `float ${3/animationSpeed}s ease-in-out infinite` : 'none'
            }}
          >
            <span>💬</span>
            <span>🎰</span>
            <span>💥</span>
            <span>😂</span>
            <span>🎊</span>
          </div>
        </div>

        {/* Floating random elements */}
        {animationSpeed > 0 && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute text-6xl opacity-20"
                style={{
                  left: `${20 + i * 20}%`,
                  top: `${10 + i * 15}%`,
                  animation: `float ${(3 + i)/animationSpeed}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`
                }}
              >
                {['🎈', '🎉', '🎊', '✨', '🌟'][i]}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
