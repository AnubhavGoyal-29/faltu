import { createContext, useContext, useState, useEffect } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import api from '../api/axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      // Verify token and get user profile
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchProfile()
    } else {
      // Check if token exists in localStorage but not in state
      const storedToken = localStorage.getItem('token')
      if (storedToken) {
        setToken(storedToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
        fetchProfile()
      } else {
        setLoading(false)
      }
    }
  }, [token])

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/profile')
      if (response.data && response.data.user) {
        setUser(response.data.user)
      }
      setLoading(false)
    } catch (error) {
      console.error('🔐 [AUTH] Failed to fetch profile:', error)
      // Only logout if it's an auth error, not a network error
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout()
      } else {
        // Network error - keep user logged in, just set loading to false
        setLoading(false)
      }
    }
  }

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('🔐 [LOGIN] Google token received:', tokenResponse)
        
        // Get user info from Google
        const googleUserResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          }
        )
        
        if (!googleUserResponse.ok) {
          throw new Error(`Google API error: ${googleUserResponse.status}`)
        }
        
        const googleUser = await googleUserResponse.json()
        console.log('🔐 [LOGIN] Google user info:', googleUser)

        // Send to backend for verification and JWT generation
        const response = await api.post('/auth/google', {
          token: tokenResponse.access_token
        })

        console.log('🔐 [LOGIN] Backend response:', response.data)
        const { token: jwtToken, user: userData } = response.data
        
        setToken(jwtToken)
        setUser(userData)
        localStorage.setItem('token', jwtToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`
        
        // Redirect to dashboard
        window.location.href = '/dashboard'
      } catch (error) {
        console.error('🔐 [LOGIN] Error details:', error)
        console.error('🔐 [LOGIN] Error response:', error.response?.data)
        const errorMsg = error.response?.data?.error || error.message || 'Login failed'
        alert(`Login failed: ${errorMsg}`)
      }
    },
    onError: (error) => {
      console.error('🔐 [LOGIN] Google OAuth error:', error)
      if (error.error === 'redirect_uri_mismatch') {
        alert('Redirect URI mismatch! Google Console mein http://localhost:3000 add karo.')
      } else {
        alert(`Google login failed: ${error.error || error.message || 'Unknown error'}`)
      }
    }
  })

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    fetchProfile
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

