import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const DesiChallenge = () => {
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchChallenge()
  }, [])

  const fetchChallenge = async () => {
    try {
      const response = await api.get('/games/desiChallenge')
      if (response.data.success) {
        setChallenge(response.data.challenge)
        setCompleted(false)
      }
    } catch (error) {
      console.error('Fetch challenge error:', error)
    }
  }

  const completeChallenge = async () => {
    setLoading(true)
    try {
      const response = await api.post('/games/desiChallenge/complete', {
        challenge_id: challenge.challenge_id
      })
      if (response.data.success) {
        setCompleted(true)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Complete error:', error)
      alert('Complete nahi hui!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🇮🇳 Desi Challenge
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        {challenge && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
            {!completed ? (
              <div className="space-y-6">
                <div className="bg-orange-100 rounded-2xl p-6">
                  <p className="text-sm text-orange-600 mb-2">Type: {challenge.challenge_type}</p>
                  <p className="text-2xl font-black text-orange-800">{challenge.challenge_text}</p>
                </div>
                <FloatingButton onClick={completeChallenge} disabled={loading} className="bg-orange-600 text-white py-4 px-8 text-xl">
                  {loading ? 'Completing...' : 'Complete Challenge! ✅'}
                </FloatingButton>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-100 rounded-lg p-4">
                  <p className="font-bold text-green-800 text-2xl">Challenge Complete! 🎉</p>
                  <p className="text-green-800 font-bold mt-4">Points Earned!</p>
                </div>
                <FloatingButton onClick={fetchChallenge} className="bg-orange-600 text-white py-4 px-8 text-xl">
                  Get Another Challenge! 🔄
                </FloatingButton>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default DesiChallenge

