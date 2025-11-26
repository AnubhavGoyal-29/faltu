import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const LuckDraw = () => {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const spin = async () => {
    setLoading(true)
    try {
      const response = await api.post('/games/luckDraw/spin')
      if (response.data.success) {
        setResult(response.data)
        if (response.data.points_awarded > 0) {
          triggerConfettiBurst()
        }
      }
    } catch (error) {
      console.error('Spin error:', error)
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
          🎰 Luck Draw
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!result ? (
            <FloatingButton onClick={spin} disabled={loading} className="bg-yellow-600 text-white py-4 px-8 text-xl">
              {loading ? 'Spinning...' : 'Spin Luck Draw! 🚀'}
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              <div className={`bg-${result.outcome === 'jackpot' ? 'yellow' : result.outcome === 'win' ? 'green' : result.outcome === 'smallWin' ? 'blue' : 'gray'}-100 rounded-2xl p-6`}>
                <p className="text-3xl font-bold mb-4">
                  {result.outcome === 'jackpot' ? '🎉 JACKPOT!' : 
                   result.outcome === 'win' ? '🎊 WIN!' : 
                   result.outcome === 'smallWin' ? '🎁 Small Win!' : 
                   '😅 Nothing'}
                </p>
                {result.points_awarded > 0 && (
                  <p className="text-green-800 font-bold text-2xl">Points: {result.points_awarded}</p>
                )}
              </div>
              <FloatingButton onClick={spin} className="bg-yellow-600 text-white py-4 px-8 text-xl">
                Spin Again! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default LuckDraw

