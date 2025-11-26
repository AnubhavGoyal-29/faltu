import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const RandomDare = () => {
  const navigate = useNavigate()
  const [dare, setDare] = useState(null)
  const [loading, setLoading] = useState(false)

  const getDare = async () => {
    setLoading(true)
    try {
      const response = await api.get('/games/randomDare')
      if (response.data.success) {
        setDare(response.data.dare)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Get dare error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🎯 Random Dare
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!dare ? (
            <FloatingButton onClick={getDare} disabled={loading} className="bg-purple-600 text-white py-4 px-8 text-xl">
              {loading ? 'Loading...' : 'Get Random Dare! 🚀'}
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              <div className="bg-purple-100 rounded-2xl p-6">
                <p className="text-xl font-bold">{dare.dare_text}</p>
                <p className="text-green-800 font-bold mt-4">Points: {dare.points_awarded}</p>
              </div>
              <FloatingButton onClick={getDare} className="bg-purple-600 text-white py-4 px-8 text-xl">
                Get Another Dare! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default RandomDare

