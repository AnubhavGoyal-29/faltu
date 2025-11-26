import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const PressureCooker = () => {
  const navigate = useNavigate()
  const [cooker, setCooker] = useState(null)
  const [round, setRound] = useState(1)
  const [completed, setCompleted] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const startCooker = async () => {
    try {
      const response = await api.post('/games/pressureCooker/start')
      if (response.data.success) {
        setCooker(response.data.cooker)
        setRound(1)
        setCompleted(false)
        setResult(null)
      }
    } catch (error) {
      console.error('Start cooker error:', error)
    }
  }

  const completeRound = async () => {
    setLoading(true)
    try {
      const response = await api.post('/games/pressureCooker/round', {
        cooker_id: cooker.cooker_id,
        round,
        completed: true
      })
      if (response.data.success) {
        if (round < cooker.rounds) {
          setRound(round + 1)
        } else {
          const completeResponse = await api.post('/games/pressureCooker/complete', {
            cooker_id: cooker.cooker_id,
            total_rounds: cooker.rounds
          })
          if (completeResponse.data.success) {
            setCompleted(true)
            setResult(completeResponse.data)
            triggerConfettiBurst()
          }
        }
      }
    } catch (error) {
      console.error('Complete round error:', error)
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
          🍳 Pressure Cooker
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!cooker && !result && (
            <FloatingButton onClick={startCooker} className="bg-red-600 text-white py-4 px-8 text-xl">
              Start Pressure Cooker! 🚀
            </FloatingButton>
          )}

          {cooker && !completed && (
            <div className="space-y-6">
              <p className="text-2xl font-bold">Round {round} of {cooker.rounds}</p>
              <p className="text-lg">Time Limit: {(cooker.time_limit / 1000).toFixed(0)}s</p>
              <FloatingButton
                onClick={completeRound}
                disabled={loading}
                className="bg-red-600 text-white px-16 py-12 text-4xl animate-pulse"
              >
                {loading ? 'Completing...' : 'Complete Round! ⚡'}
              </FloatingButton>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4">
                <p className="font-bold text-green-800 text-2xl">All Rounds Complete! 🎉</p>
                <p className="text-green-800 font-bold mt-4">Bonus Points: {result.bonus_points}</p>
              </div>
              <FloatingButton onClick={startCooker} className="bg-red-600 text-white py-4 px-8 text-xl">
                Try Again! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default PressureCooker

