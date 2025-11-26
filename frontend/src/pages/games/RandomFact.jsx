import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const RandomFact = () => {
  const navigate = useNavigate()
  const [fact, setFact] = useState(null)
  const [loading, setLoading] = useState(false)

  const getFact = async () => {
    setLoading(true)
    try {
      const response = await api.get('/games/randomFact')
      if (response.data.success) {
        setFact(response.data.fact)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Get fact error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🤯 Random Fact
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!fact ? (
            <FloatingButton onClick={getFact} disabled={loading} className="bg-yellow-600 text-white py-4 px-8 text-xl">
              {loading ? 'Loading...' : 'Get Random Fact! 🚀'}
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-100 rounded-2xl p-6">
                <p className="text-xl font-bold">{fact.fact}</p>
                <p className="text-sm text-gray-600 mt-2">Category: {fact.category}</p>
                <p className="text-green-800 font-bold mt-4">Points: {fact.points_awarded}</p>
              </div>
              <FloatingButton onClick={getFact} className="bg-yellow-600 text-white py-4 px-8 text-xl">
                Get Another Fact! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default RandomFact

