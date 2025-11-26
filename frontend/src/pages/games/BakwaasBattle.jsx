import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const BakwaasBattle = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [battle, setBattle] = useState(null)
  const [bakwaas, setBakwaas] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const startBattle = async () => {
    try {
      const response = await api.post('/games/bakwaasBattle/start')
      if (response.data.success) {
        setBattle(response.data.battle)
      }
    } catch (error) {
      console.error('Start battle error:', error)
    }
  }

  const submitBakwaas = async () => {
    if (!bakwaas.trim()) {
      alert('Kuch bakwaas to likho!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/bakwaasBattle/submit', {
        battle_id: battle.battle_id,
        bakwaas
      })
      if (response.data.success) {
        setResult(response.data.result)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Submit bakwaas error:', error)
      alert('Bakwaas submit nahi hui!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          💬 Bakwaas Battle
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        {!battle ? (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
            <FloatingButton onClick={startBattle} className="bg-yellow-600 text-white py-4 px-8 text-xl">
              Start Bakwaas Battle! 🚀
            </FloatingButton>
          </div>
        ) : (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            <div className="space-y-4">
              <textarea
                value={bakwaas}
                onChange={(e) => setBakwaas(e.target.value)}
                placeholder="Apna bakwaas yahan likho..."
                className="w-full px-4 py-3 rounded-lg border-4 border-yellow-500 text-lg"
                rows="6"
              />
              <FloatingButton onClick={submitBakwaas} disabled={loading} className="w-full bg-yellow-600 text-white py-4 text-lg">
                {loading ? 'Submitting...' : 'Submit Bakwaas! 🚀'}
              </FloatingButton>
            </div>

            {result && (
              <div className="mt-6 bg-green-100 rounded-lg p-4">
                <p className="font-bold">Score: {result.score}/100</p>
                <p>{result.ai_response}</p>
                <p className="text-green-800 font-bold">Points: {result.points_awarded}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default BakwaasBattle

