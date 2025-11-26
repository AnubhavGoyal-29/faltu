import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const ChaosButton = () => {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const pressButton = async () => {
    setLoading(true)
    try {
      const response = await api.post('/games/chaosButton')
      if (response.data.success) {
        setResult(response.data)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Press button error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🎲 Chaos Button
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!result ? (
            <FloatingButton onClick={pressButton} disabled={loading} className="bg-purple-600 text-white py-4 px-8 text-xl">
              {loading ? 'Chaos Loading...' : 'Press Chaos Button! 🚀'}
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              <div className="bg-purple-100 rounded-2xl p-6">
                <p className="text-2xl font-bold mb-4">Event: {result.event_type}</p>
                {result.content && <p className="text-xl">{result.content}</p>}
                {result.points_awarded > 0 && (
                  <p className="text-green-800 font-bold mt-4">Points: {result.points_awarded}</p>
                )}
              </div>
              <FloatingButton onClick={pressButton} className="bg-purple-600 text-white py-4 px-8 text-xl">
                Press Again! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ChaosButton

