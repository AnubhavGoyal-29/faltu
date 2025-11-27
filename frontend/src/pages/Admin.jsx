import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FloatingButton from '../components/FloatingButton'

const Admin = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to backend AdminJS panel
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    window.location.href = `${apiUrl}/admin`
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-7xl font-black text-white drop-shadow-2xl">
            🔐 Admin Panel
          </h1>
          <p className="text-2xl text-white font-bold">
            Redirecting to Admin Dashboard...
          </p>
          <p className="text-lg text-white opacity-80">
            If you are not redirected automatically, click below:
          </p>
        </div>

        <div className="bg-white bg-opacity-90 rounded-2xl p-8 space-y-6 max-w-md mx-auto shadow-2xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Admin Panel Access</h3>
          <p className="text-gray-600 mb-4">
            Login Credentials:
          </p>
          <div className="bg-gray-100 rounded-lg p-4 text-left space-y-2">
            <p className="font-bold">Username: <span className="font-normal text-gray-700">admin</span></p>
            <p className="font-bold">Password: <span className="font-normal text-gray-700">admin123</span></p>
          </div>
          <button
            onClick={() => {
              const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
              window.location.href = `${apiUrl}/admin`
            }}
            className="w-full bg-purple-600 text-white px-6 py-4 rounded-lg font-bold hover:bg-purple-700 transition-colors text-lg"
          >
            Open Admin Panel 🔐
          </button>
        </div>

        <FloatingButton
          onClick={() => navigate('/dashboard')}
          className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
        >
          ← Back to Dashboard
        </FloatingButton>
      </div>
    </div>
  )
}

export default Admin

