import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const RoastMe = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [roast, setRoast] = useState(null)
  const [loading, setLoading] = useState(false)

  const getRoast = async () => {
    setLoading(true)
    try {
      const response = await api.get('/games/roast')
      if (response.data.success) {
        setRoast(response.data.roast)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Get roast error:', error)
      alert('Roast fetch nahi hui!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <FloatingButton
            onClick={() => navigate('/games')}
            className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
          >
            ← Back
          </FloatingButton>
          <h1 className="text-4xl font-black text-white drop-shadow-2xl">
            🔥 Roast Me
          </h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!roast ? (
            <>
              <div className="text-6xl mb-6">🔥</div>
              <p className="text-2xl mb-6">Ready to get roasted? (Funny, not mean!)</p>
              <FloatingButton
                onClick={getRoast}
                disabled={loading}
                className="bg-red-600 text-white px-12 py-6 text-2xl"
              >
                {loading ? 'Loading...' : 'Roast Me! 🔥'}
              </FloatingButton>
            </>
          ) : (
            <>
              <div className="text-6xl mb-6">🔥</div>
              <h2 className="text-2xl font-black text-gray-800 mb-6">Your Roast:</h2>
              <div className="bg-red-100 rounded-2xl p-6 mb-6">
                <p className="text-2xl font-bold text-red-800">
                  {roast.roast_text}
                </p>
              </div>
              <FloatingButton
                onClick={() => {
                  setRoast(null)
                  getRoast()
                }}
                className="bg-red-600 text-white px-12 py-6 text-2xl"
              >
                Another Roast! 🔄
              </FloatingButton>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default RoastMe

