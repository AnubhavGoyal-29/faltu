import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const TypingChaos = () => {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [userInput, setUserInput] = useState('')
  const [timeLeft, setTimeLeft] = useState(35)
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

  const startSession = async () => {
    try {
      const response = await api.post('/games/typingChaos/start')
      if (response.data.success) {
        setSession(response.data.session)
        setUserInput('')
        setTimeLeft(35)
        setIsRunning(true)
        setResult(null)
      }
    } catch (error) {
      console.error('Start session error:', error)
    }
  }

  const submitScore = async () => {
    const words = userInput.trim().split(/\s+/).length
    const wpm = Math.round((words / 35) * 60)
    const accuracy = 95 // Placeholder

    try {
      const response = await api.post('/games/typingChaos/submit', {
        session_id: session.session_id,
        wpm,
        accuracy
      })
      if (response.data.success) {
        setResult(response.data.result)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Submit score error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          ⌨️ Typing Chaos
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
          {!session ? (
            <div className="text-center">
              <FloatingButton onClick={startSession} className="bg-blue-600 text-white py-4 px-8 text-xl">
                Start Typing! 🚀
              </FloatingButton>
            </div>
          ) : (
            <div className="space-y-4">
              {isRunning && (
                <>
                  <div className="bg-blue-100 rounded-lg p-4">
                    <p className="text-xl font-bold">{session.text}</p>
                  </div>
                  <div className="text-center text-2xl font-bold">Time: {timeLeft.toFixed(1)}s</div>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type the text above..."
                    className="w-full px-4 py-3 rounded-lg border-4 border-blue-500 text-lg"
                    rows="4"
                    disabled={!isRunning}
                  />
                </>
              )}
              {result && (
                <div className="bg-green-100 rounded-lg p-4">
                  <p className="font-bold text-xl">WPM: {result.wpm}</p>
                  <p className="font-bold text-xl">Accuracy: {result.accuracy}%</p>
                  <p className="text-green-800 font-bold mt-2">Points: {result.points_awarded}</p>
                  <FloatingButton onClick={startSession} className="bg-blue-600 text-white py-4 px-8 text-xl mt-4">
                    Play Again! 🔄
                  </FloatingButton>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default TypingChaos

