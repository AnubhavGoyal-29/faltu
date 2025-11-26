import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const DesiSpeedRush = () => {
  const navigate = useNavigate()
  const [taps, setTaps] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    let interval = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 0.1)
      }, 100)
    } else if (timeLeft <= 0 && isRunning) {
      setIsRunning(false)
      submitScore()
    }
    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const startGame = () => {
    setTaps(0)
    setTimeLeft(10)
    setIsRunning(true)
    setResult(null)
  }

  const handleTap = () => {
    if (isRunning) {
      setTaps((prev) => prev + 1)
    }
  }

  const submitScore = async () => {
    try {
      const response = await api.post('/games/desiSpeedRush/submit', { taps })
      if (response.data.success) {
        setResult(response.data.result)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Submit score error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          ⚡ Desi Speed Rush
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!isRunning && !result && (
            <FloatingButton onClick={startGame} className="bg-green-600 text-white py-4 px-8 text-xl">
              Start Tapping! 🚀
            </FloatingButton>
          )}

          {isRunning && (
            <div className="space-y-6">
              <div className="text-6xl font-black text-green-600">{taps}</div>
              <div className="text-2xl font-bold">Time: {timeLeft.toFixed(1)}s</div>
              <FloatingButton
                onClick={handleTap}
                className="bg-green-600 text-white py-8 px-16 text-3xl w-full"
              >
                TAP! 👆
              </FloatingButton>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="bg-green-100 rounded-2xl p-6">
                <p className="text-2xl font-bold">Taps: {result.taps}</p>
                <p className="text-lg font-bold text-green-800">Points: {result.points_awarded}</p>
                {result.bonus > 0 && <p className="text-lg">Bonus: {result.bonus}</p>}
              </div>
              <FloatingButton onClick={startGame} className="bg-green-600 text-white py-4 px-8 text-xl">
                Play Again! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DesiSpeedRush

