import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const RandomRoast = () => {
  const navigate = useNavigate()
  const [roast, setRoast] = useState(null)
  const [loading, setLoading] = useState(false)

  const getRoast = async () => {
    setLoading(true)
    try {
      const response = await api.get('/games/randomRoast')
      if (response.data.success) {
        setRoast(response.data.roast)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Get roast error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🔥 Random Roast
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!roast ? (
            <FloatingButton onClick={getRoast} disabled={loading} className="bg-red-600 text-white py-4 px-8 text-xl">
              {loading ? 'Roasting...' : 'Get Random Roast! 🚀'}
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              <div className="bg-red-100 rounded-2xl p-6">
                <p className="text-xl font-bold">{roast.roast_text}</p>
                <p className="text-green-800 font-bold mt-4">Points: {roast.points_awarded}</p>
              </div>
              <FloatingButton onClick={getRoast} className="bg-red-600 text-white py-4 px-8 text-xl">
                Get Another Roast! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default RandomRoast

