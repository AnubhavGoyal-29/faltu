import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const ChaosGenerator = () => {
  const navigate = useNavigate()
  const [chaos, setChaos] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateChaos = async () => {
    setLoading(true)
    try {
      const response = await api.post('/games/chaosGenerator')
      if (response.data.success) {
        setChaos(response.data.chaos)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Generate chaos error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🌪️ Chaos Generator
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!chaos ? (
            <FloatingButton onClick={generateChaos} disabled={loading} className="bg-purple-600 text-white py-4 px-8 text-xl">
              {loading ? 'Generating...' : 'Generate Chaos! 🚀'}
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              <div className="bg-purple-100 rounded-2xl p-6">
                <p className="text-xl font-bold">Event: {chaos.event_type}</p>
                <p className="text-lg mt-2">{chaos.content}</p>
                {chaos.points_awarded > 0 && (
                  <p className="text-green-800 font-bold mt-4">Points: {chaos.points_awarded}</p>
                )}
              </div>
              <FloatingButton onClick={generateChaos} className="bg-purple-600 text-white py-4 px-8 text-xl">
                Generate More Chaos! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ChaosGenerator

