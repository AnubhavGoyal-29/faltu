import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import FloatingButton from '../components/FloatingButton'

const Admin = () => {
  const navigate = useNavigate()
  const [adminCreds, setAdminCreds] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
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
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-7xl font-black text-white drop-shadow-2xl">
            🔐 Admin Login
          </h1>
          <p className="text-2xl text-white font-bold">
            FaltuVerse Admin Panel
          </p>
        </div>

        <form 
          onSubmit={handleAdminLogin}
          className="bg-white bg-opacity-90 rounded-2xl p-8 space-y-6 max-w-md mx-auto shadow-2xl"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Admin Access</h3>
          <input
            type="text"
            placeholder="Username: admin"
            value={adminCreds.username}
            onChange={(e) => setAdminCreds({...adminCreds, username: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password: admin123"
            value={adminCreds.password}
            onChange={(e) => setAdminCreds({...adminCreds, password: e.target.value})}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none text-lg"
            required
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-purple-700 transition-colors text-lg disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Admin Login'}
          </button>
        </form>

        <FloatingButton
          onClick={() => navigate('/login')}
          className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
        >
          ← Back to Login
        </FloatingButton>
      </div>
    </div>
  )
}

export default Admin

