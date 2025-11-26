import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const ReactionTest = () => {
  const navigate = useNavigate()
  const [test, setTest] = useState(null)
  const [waiting, setWaiting] = useState(false)
  const [canClick, setCanClick] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [reactions, setReactions] = useState([])
  const [round, setRound] = useState(0)
  const [result, setResult] = useState(null)

  const startTest = async () => {
    try {
      const response = await api.post('/games/reactionTest/start')
      if (response.data.success) {
        setTest(response.data.test)
        setRound(1)
        setReactions([])
        setResult(null)
        startRound()
      }
    } catch (error) {
      console.error('Start test error:', error)
    }
  }

  const startRound = () => {
    setWaiting(true)
    setCanClick(false)
    const delay = Math.random() * 4000 + 1000
    setTimeout(() => {
      setWaiting(false)
      setCanClick(true)
      setStartTime(Date.now())
    }, delay)
  }

  const handleClick = async () => {
    if (!canClick) return
    const reactionTime = Date.now() - startTime
    const newReactions = [...reactions, reactionTime]
    setReactions(newReactions)
    setCanClick(false)

    try {
      const response = await api.post('/games/reactionTest/submit', {
        test_id: test.test_id,
        reaction_time: reactionTime
      })
      if (response.data.success && newReactions.length < 5) {
        setRound(newReactions.length + 1)
        setTimeout(() => startRound(), 1000)
      } else if (newReactions.length >= 5) {
        setResult({ reactions: newReactions, total: newReactions.reduce((a, b) => a + b, 0) })
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          ⚡ Reaction Test
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!test && !result && (
            <FloatingButton onClick={startTest} className="bg-green-600 text-white py-4 px-8 text-xl">
              Start Reaction Test! 🚀
            </FloatingButton>
          )}

          {test && !result && (
            <div className="space-y-6">
              <p className="text-2xl font-bold">Round {round} of 5</p>
              {waiting && (
                <div className="bg-yellow-100 rounded-lg p-4">
                  <p className="text-xl">Wait for the signal...</p>
                </div>
              )}
              {canClick && (
                <FloatingButton
                  onClick={handleClick}
                  className="bg-green-600 text-white px-16 py-12 text-4xl animate-pulse"
                >
                  CLICK NOW! ⚡
                </FloatingButton>
              )}
              {reactions.length > 0 && (
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-lg">Last reaction: {reactions[reactions.length - 1]}ms</p>
                </div>
              )}
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4">
                <p className="font-bold text-2xl">Test Complete!</p>
                <p className="text-lg mt-2">Average: {Math.round(result.total / 5)}ms</p>
              </div>
              <FloatingButton onClick={startTest} className="bg-green-600 text-white py-4 px-8 text-xl">
                Try Again! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ReactionTest

