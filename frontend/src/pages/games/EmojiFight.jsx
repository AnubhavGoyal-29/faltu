import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const EmojiFight = () => {
  const navigate = useNavigate()
  const [fight, setFight] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const startFight = async () => {
    setLoading(true)
    try {
      const response = await api.post('/games/emojiFight/start')
      if (response.data.success) {
        setFight(response.data.fight)
        setResult(null)
      }
    } catch (error) {
      console.error('Start fight error:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitChoice = async (choice) => {
    setLoading(true)
    try {
      const response = await api.post('/games/emojiFight/submit', {
        fight_id: fight.fight_id,
        user_choice: choice
      })
      if (response.data.success) {
        setResult(response.data)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          😀 Emoji Fight
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!fight && !result && (
            <FloatingButton onClick={startFight} disabled={loading} className="bg-blue-600 text-white py-4 px-8 text-xl">
              {loading ? 'Starting...' : 'Start Emoji Fight! 🚀'}
            </FloatingButton>
          )}

          {fight && !result && (
            <div className="space-y-6">
              <div className="text-6xl mb-4">
                <span className="text-8xl">{fight.user_emoji}</span>
                <span className="mx-4 text-4xl">VS</span>
                <span className="text-8xl">{fight.ai_emoji}</span>
              </div>
              <p className="text-xl font-bold">Round {fight.round} of {fight.total_rounds}</p>
              <FloatingButton onClick={() => submitChoice('attack')} disabled={loading} className="bg-blue-600 text-white py-4 px-8 text-xl">
                {loading ? 'Fighting...' : 'Attack! ⚔️'}
              </FloatingButton>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className={`bg-${result.user_won ? 'green' : 'red'}-100 rounded-lg p-4`}>
                <p className="font-bold text-2xl">{result.message}</p>
                <p className="text-green-800 font-bold mt-4">Points: {result.points_awarded}</p>
              </div>
              <FloatingButton onClick={startFight} className="bg-blue-600 text-white py-4 px-8 text-xl">
                Fight Again! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default EmojiFight

