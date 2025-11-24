import api from './axios'

// Get AI-generated idle engagement
export const getAIIdleEngagement = async () => {
  try {
    const response = await api.get('/ai/idle-engagement')
    return response.data
  } catch (error) {
    console.error('AI idle engagement error:', error)
    return null
  }
}

// This endpoint would need to be added to backend
// For now, we'll use the existing idle detection with fallback messages

