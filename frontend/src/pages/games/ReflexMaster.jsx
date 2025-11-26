import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const ReflexMaster = () => {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [waiting, setWaiting] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [results, setResults] = useState([])

  const startSession = async () => {
    try {
      const response = await api.post('/games/reflexMaster/start')
      if (response.data.success) {
        setSession(response.data.session)
        setResults([])
        startRound()
      }
    } catch (error) {
      console.error('Start session error:', error)
    }
  }

  const startRound = () => {
    setWaiting(true)
    const delay = Math.random() * 4000 + 1000
    setTimeout(() => {
      setWaiting(false)
      setStartTime(Date.now())
    }, delay)
  }

  const handleClick = async () => {
    if (!startTime) return
    const reactionTime = Date.now() - startTime
    try {
      const response = await api.post('/games/reflexMaster/submit', {
        session_id: session.session_id,
        reaction_time: reactionTime
      })
      if (response.data.success) {
        setResults([...results, response.data.result])
        if (results.length < 6) {
          setTimeout(startRound, 1000)
        } else {
          triggerConfettiBurst()
        }
      }
      setStartTime(null)
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          ⚡ Reflex Master
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!session ? (
            <FloatingButton onClick={startSession} className="bg-blue-600 text-white py-4 px-8 text-xl">
              Start Reflex Test! 🚀
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              {waiting ? (
                <p className="text-2xl font-bold">Wait for the signal...</p>
              ) : startTime ? (
                <FloatingButton onClick={handleClick} className="bg-green-600 text-white py-8 px-16 text-3xl">
                  CLICK NOW! 👆
                </FloatingButton>
              ) : (
                <p className="text-2xl font-bold">Round {results.length + 1}/7</p>
              )}
              {results.length > 0 && (
                <div className="bg-blue-100 rounded-lg p-4">
                  <p className="font-bold">Average: {Math.round(results.reduce((a, b) => a + b.reaction_time, 0) / results.length)}ms</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ReflexMaster

