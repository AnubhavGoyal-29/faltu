import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const LuckyChaos = () => {
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [spinning, setSpinning] = useState(false)

  const spin = async () => {
    setSpinning(true)
    try {
      const response = await api.post('/games/luckyChaos/spin')
      if (response.data.success) {
        setResult(response.data.result)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Spin error:', error)
    } finally {
      setSpinning(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🎰 Lucky Chaos
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!result ? (
            <FloatingButton onClick={spin} disabled={spinning} className="bg-green-600 text-white py-4 px-8 text-xl">
              {spinning ? 'Spinning...' : 'Spin the Wheel! 🚀'}
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-100 rounded-2xl p-6">
                <p className="text-2xl font-bold">Result: {result.result_type}</p>
                {result.points_awarded > 0 && (
                  <p className="text-green-800 font-bold text-xl mt-4">Points: {result.points_awarded}</p>
                )}
              </div>
              <FloatingButton onClick={spin} className="bg-green-600 text-white py-4 px-8 text-xl">
                Spin Again! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default LuckyChaos

