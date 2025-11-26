import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const MoodSwitch = () => {
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState(null)
  const [switches, setSwitches] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gameActive, setGameActive] = useState(false)
  const [result, setResult] = useState(null)
  const intervalRef = useState(null)

  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            endGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [gameActive, timeLeft])

  const startChallenge = async () => {
    try {
      const response = await api.post('/games/moodSwitch/start')
      if (response.data.success) {
        setChallenge(response.data.challenge)
        setSwitches(0)
        setTimeLeft(30)
        setGameActive(true)
        setResult(null)
      }
    } catch (error) {
      console.error('Start challenge error:', error)
    }
  }

  const handleSwitch = () => {
    if (gameActive) {
      setSwitches((prev) => prev + 1)
    }
  }

  const endGame = async () => {
    setGameActive(false)
    try {
      const response = await api.post('/games/moodSwitch/submit', {
        challenge_id: challenge.challenge_id,
        switches
      })
      if (response.data.success) {
        setResult(response.data)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🎭 Mood Switcher
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!challenge && !result && (
            <FloatingButton onClick={startChallenge} className="bg-blue-600 text-white py-4 px-8 text-xl">
              Start Mood Switch Challenge! 🚀
            </FloatingButton>
          )}

          {challenge && gameActive && (
            <div className="space-y-6">
              <div className="text-6xl font-black text-blue-600 mb-4">{timeLeft}s</div>
              <div className="text-4xl font-black text-gray-800 mb-6">Switches: {switches}</div>
              <p className="text-xl mb-4">Target Mood: <span className="font-bold">{challenge.target_mood}</span></p>
              <FloatingButton
                onClick={handleSwitch}
                className="bg-blue-600 text-white px-16 py-12 text-4xl animate-bounce"
              >
                Switch Mood! 🎭
              </FloatingButton>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className={`bg-${result.won ? 'green' : 'yellow'}-100 rounded-lg p-4`}>
                <p className="font-bold text-2xl">Switches: {result.switches}</p>
                <p className="text-lg mt-2">{result.won ? 'Challenge Complete! 🎉' : 'Keep Trying!'}</p>
                <p className="text-green-800 font-bold mt-4">Points: {result.points_awarded}</p>
              </div>
              <FloatingButton onClick={startChallenge} className="bg-blue-600 text-white py-4 px-8 text-xl">
                Try Again! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MoodSwitch

