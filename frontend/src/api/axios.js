import axios from 'axios'

// Ensure API URL includes /api
const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
  console.log('🔍 [AXIOS] VITE_API_URL from env:', import.meta.env.VITE_API_URL)
  console.log('🔍 [AXIOS] Final API URL:', envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`)
  // If URL doesn't end with /api, add it
  return envUrl.endsWith('/api') ? envUrl : `${envUrl}/api`
}

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if available
const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default api
