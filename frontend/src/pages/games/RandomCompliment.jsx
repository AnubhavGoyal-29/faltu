import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const RandomCompliment = () => {
  const navigate = useNavigate()
  const [compliment, setCompliment] = useState(null)
  const [loading, setLoading] = useState(false)

  const getCompliment = async () => {
    setLoading(true)
    try {
      const response = await api.get('/games/randomCompliment')
      if (response.data.success) {
        setCompliment(response.data.compliment)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Get compliment error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          💝 Random Compliment
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!compliment ? (
            <FloatingButton onClick={getCompliment} disabled={loading} className="bg-pink-600 text-white py-4 px-8 text-xl">
              {loading ? 'Loading...' : 'Get Random Compliment! 🚀'}
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              <div className="bg-pink-100 rounded-2xl p-6">
                <p className="text-xl font-bold">{compliment.compliment}</p>
                <p className="text-sm text-gray-600 mt-2">Type: {compliment.type}</p>
                <p className="text-green-800 font-bold mt-4">Points: {compliment.points_awarded}</p>
              </div>
              <FloatingButton onClick={getCompliment} className="bg-pink-600 text-white py-4 px-8 text-xl">
                Get Another Compliment! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default RandomCompliment

