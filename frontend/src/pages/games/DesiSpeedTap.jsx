import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const DesiSpeedTap = () => {
  const navigate = useNavigate()
  const [taps, setTaps] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [gameActive, setGameActive] = useState(false)
  const [result, setResult] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [gameActive, timeLeft])

  const startGame = () => {
    setGameActive(true)
    setTaps(0)
    setTimeLeft(10)
    setResult(null)
  }

  const endGame = async () => {
    setGameActive(false)
    try {
      const response = await api.post('/games/desiSpeedTap/submit', { taps })
      if (response.data.success) {
        setResult(response.data)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Submit score error:', error)
    }
  }

  const handleTap = () => {
    if (gameActive) {
      setTaps((prev) => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          ⚡ Desi Speed Tap
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!gameActive && !result && (
            <>
              <p className="text-2xl mb-6">10 seconds mein jitne bhi taps kar sakte ho! Desi style!</p>
              <FloatingButton onClick={startGame} className="bg-green-600 text-white px-12 py-6 text-2xl">
                Start Game! 🚀
              </FloatingButton>
            </>
          )}

          {gameActive && (
            <>
              <div className="text-6xl font-black text-green-600 mb-4">{timeLeft}s</div>
              <div className="text-4xl font-black text-gray-800 mb-6">Taps: {taps}</div>
              <FloatingButton
                onClick={handleTap}
                className="bg-green-600 text-white px-16 py-12 text-4xl animate-bounce"
              >
                TAP! ⚡
              </FloatingButton>
            </>
          )}

          {result && (
            <>
              <div className="text-6xl font-black text-green-600 mb-4">{result.taps}</div>
              <p className="text-2xl font-bold text-gray-800 mb-6">Taps in 10 seconds!</p>
              <p className="text-green-800 font-bold mb-4">Points: {result.points_awarded}</p>
              {result.bonus > 0 && <p className="text-yellow-600 font-bold">Bonus: {result.bonus}</p>}
              <FloatingButton onClick={startGame} className="bg-green-600 text-white px-12 py-6 text-2xl mt-4">
                Play Again! 🔄
              </FloatingButton>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default DesiSpeedTap

