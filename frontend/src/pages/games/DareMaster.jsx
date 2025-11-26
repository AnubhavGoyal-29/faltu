import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const DareMaster = () => {
  const navigate = useNavigate()
  const [dare, setDare] = useState(null)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)

  const getDare = async () => {
    setLoading(true)
    try {
      const response = await api.get('/games/dareMaster')
      if (response.data.success) {
        setDare(response.data.dare)
        setCompleted(false)
      }
    } catch (error) {
      console.error('Get dare error:', error)
    } finally {
      setLoading(false)
    }
  }

  const completeDare = async () => {
    try {
      const response = await api.post('/games/dareMaster/complete', { dare_id: dare.dare_id })
      if (response.data.success) {
        setCompleted(true)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Complete dare error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-600 via-rose-600 to-red-600 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          😈 Dare Master
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!dare ? (
            <FloatingButton onClick={getDare} disabled={loading} className="bg-pink-600 text-white py-4 px-8 text-xl">
              {loading ? 'Loading...' : 'Get Dare! 🚀'}
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              <div className="bg-pink-100 rounded-2xl p-6">
                <p className="text-xl font-bold">{dare.dare_text}</p>
              </div>
              {!completed ? (
                <FloatingButton onClick={completeDare} className="bg-green-600 text-white py-4 px-8 text-xl">
                  Complete Dare! ✅
                </FloatingButton>
              ) : (
                <div className="bg-green-100 rounded-lg p-4">
                  <p className="font-bold text-green-800">Dare Completed! Bonus points earned!</p>
                </div>
              )}
              <FloatingButton onClick={getDare} className="bg-pink-600 text-white py-4 px-8 text-xl">
                Get Another Dare! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DareMaster

