import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const DesiMaster = () => {
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)

  const getChallenge = async () => {
    setLoading(true)
    try {
      const response = await api.get('/games/desiMaster')
      if (response.data.success) {
        setChallenge(response.data.challenge)
        setCompleted(false)
      }
    } catch (error) {
      console.error('Get challenge error:', error)
    } finally {
      setLoading(false)
    }
  }

  const completeChallenge = async () => {
    try {
      const response = await api.post('/games/desiMaster/complete', {
        challenge_id: challenge.challenge_id,
        completion: true
      })
      if (response.data.success) {
        setCompleted(true)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Complete challenge error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-600 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🇮🇳 Desi Master
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!challenge ? (
            <FloatingButton onClick={getChallenge} disabled={loading} className="bg-orange-600 text-white py-4 px-8 text-xl">
              {loading ? 'Loading...' : 'Get Desi Challenge! 🚀'}
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              <div className="bg-orange-100 rounded-2xl p-6">
                <p className="text-sm text-gray-600 mb-2">Type: {challenge.challenge_type}</p>
                <p className="text-xl font-bold">{challenge.challenge_text}</p>
              </div>
              {!completed ? (
                <FloatingButton onClick={completeChallenge} className="bg-green-600 text-white py-4 px-8 text-xl">
                  Complete Challenge! ✅
                </FloatingButton>
              ) : (
                <div className="bg-green-100 rounded-lg p-4">
                  <p className="font-bold text-green-800">Challenge Completed! Bonus points earned!</p>
                </div>
              )}
              <FloatingButton onClick={getChallenge} className="bg-orange-600 text-white py-4 px-8 text-xl">
                Get Another Challenge! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DesiMaster

