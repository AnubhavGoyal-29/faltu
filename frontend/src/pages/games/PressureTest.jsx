import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const PressureTest = () => {
  const navigate = useNavigate()
  const [test, setTest] = useState(null)
  const [currentRound, setCurrentRound] = useState(0)
  const [scores, setScores] = useState([])
  const [loading, setLoading] = useState(false)

  const startTest = async () => {
    try {
      const response = await api.post('/games/pressureTest/start')
      if (response.data.success) {
        setTest(response.data.test)
        setCurrentRound(0)
        setScores([])
      }
    } catch (error) {
      console.error('Start test error:', error)
    }
  }

  const submitRound = async (score) => {
    setLoading(true)
    try {
      const response = await api.post('/games/pressureTest/round', {
        test_id: test.test_id,
        round_score: score
      })
      if (response.data.success) {
        setScores([...scores, response.data.result])
        if (currentRound < 3) {
          setCurrentRound(currentRound + 1)
        } else {
          completeTest()
        }
      }
    } catch (error) {
      console.error('Submit round error:', error)
    } finally {
      setLoading(false)
    }
  }

  const completeTest = async () => {
    const totalScore = scores.reduce((a, b) => a + b.round_score, 0)
    try {
      const response = await api.post('/games/pressureTest/complete', {
        test_id: test.test_id,
        total_score: totalScore
      })
      if (response.data.success) {
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Complete test error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          ⏰ Pressure Test
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!test ? (
            <FloatingButton onClick={startTest} className="bg-red-600 text-white py-4 px-8 text-xl">
              Start Pressure Test! 🚀
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              <p className="text-xl font-bold">Round {currentRound + 1}/4</p>
              <div className="grid grid-cols-3 gap-4">
                {[50, 75, 100].map((score) => (
                  <FloatingButton
                    key={score}
                    onClick={() => submitRound(score)}
                    disabled={loading}
                    className="bg-red-600 text-white py-4 text-lg"
                  >
                    {score}
                  </FloatingButton>
                ))}
              </div>
              {scores.length > 0 && (
                <div className="bg-green-100 rounded-lg p-4">
                  <p className="font-bold">Scores: {scores.map(s => s.round_score).join(', ')}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default PressureTest

