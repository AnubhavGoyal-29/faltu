import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const TapGame = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [taps, setTaps] = useState(0)
  const [timeLeft, setTimeLeft] = useState(5)
  const [gameActive, setGameActive] = useState(false)
  const [score, setScore] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const intervalRef = useRef(null)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

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
    setTimeLeft(5)
    setScore(null)
  }

  const endGame = async () => {
    setGameActive(false)
    try {
      const response = await api.post('/games/tap/submit', { taps })
      if (response.data.success) {
        setScore(taps)
        triggerConfettiBurst()
        fetchLeaderboard()
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

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/games/tap/leaderboard')
      if (response.data.success) {
        setLeaderboard(response.data.leaderboard || [])
      }
    } catch (error) {
      console.error('Fetch leaderboard error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-pink-500 to-rose-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <FloatingButton
            onClick={() => navigate('/games')}
            className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
          >
            ← Back
          </FloatingButton>
          <h1 className="text-4xl font-black text-white drop-shadow-2xl">
            👆 5-Second Tap Game
          </h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!gameActive && !score && (
            <>
              <p className="text-2xl mb-6">5 seconds mein jitne bhi taps kar sakte ho!</p>
              <FloatingButton
                onClick={startGame}
                className="bg-red-600 text-white px-12 py-6 text-2xl"
              >
                Start Game! 🚀
              </FloatingButton>
            </>
          )}

          {gameActive && (
            <>
              <div className="text-6xl font-black text-red-600 mb-4">{timeLeft}</div>
              <div className="text-4xl font-black text-gray-800 mb-6">Taps: {taps}</div>
              <FloatingButton
                onClick={handleTap}
                className="bg-red-600 text-white px-16 py-12 text-4xl animate-bounce"
              >
                TAP! 👆
              </FloatingButton>
            </>
          )}

          {score !== null && !gameActive && (
            <>
              <div className="text-6xl font-black text-green-600 mb-4">{score}</div>
              <p className="text-2xl font-bold text-gray-800 mb-6">Taps in 5 seconds!</p>
              <FloatingButton
                onClick={startGame}
                className="bg-red-600 text-white px-12 py-6 text-2xl"
              >
                Play Again! 🔄
              </FloatingButton>
            </>
          )}
        </div>

        {leaderboard.length > 0 && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-black mb-4 text-gray-800">Leaderboard 🏆</h2>
            <div className="space-y-2">
              {leaderboard.map((entry, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-bold">{idx + 1}. {entry.user?.name || 'Unknown'}</span>
                  <span className="text-red-600 font-black">{entry.taps} taps</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default TapGame

