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
      setUser(response.data.user)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      logout()
    }
  }

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google
        const googleUserResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          }
        )
        const googleUser = await googleUserResponse.json()

        // Send to backend for verification and JWT generation
        const response = await api.post('/auth/google', {
          token: tokenResponse.access_token
        })

        const { token: jwtToken, user: userData } = response.data
        setToken(jwtToken)
        setUser(userData)
        localStorage.setItem('token', jwtToken)
        api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`
      } catch (error) {
        console.error('Login failed:', error)
        alert('Login failed. Please try again.')
      }
    },
    onError: (error) => {
      console.error('Google login failed:', error)
      if (error.error === 'redirect_uri_mismatch') {
        alert('Redirect URI mismatch! Google Console mein http://localhost:5173 add karo.')
      } else {
        alert('Google login failed. Please try again.')
      }
    },
    flow: 'auth-code', // Use authorization code flow
    redirectUri: window.location.origin // Use current origin as redirect URI
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

