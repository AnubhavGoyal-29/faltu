import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const DareMachine = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dare, setDare] = useState(null)
  const [loading, setLoading] = useState(false)

  const getDare = async () => {
    setLoading(true)
    try {
      const response = await api.get('/games/dare')
      if (response.data.success) {
        setDare(response.data.dare)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Get dare error:', error)
      alert('Dare fetch nahi hui!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <FloatingButton
            onClick={() => navigate('/games')}
            className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
          >
            ← Back
          </FloatingButton>
          <h1 className="text-4xl font-black text-white drop-shadow-2xl">
            😈 Dare Machine
          </h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!dare ? (
            <>
              <div className="text-6xl mb-6">😈</div>
              <p className="text-2xl mb-6">Ready for a dare?</p>
              <FloatingButton
                onClick={getDare}
                disabled={loading}
                className="bg-pink-600 text-white px-12 py-6 text-2xl"
              >
                {loading ? 'Loading...' : 'Give Me a Dare! 😈'}
              </FloatingButton>
            </>
          ) : (
            <>
              <div className="text-6xl mb-6">😈</div>
              <h2 className="text-2xl font-black text-gray-800 mb-6">Your Dare:</h2>
              <div className="bg-pink-100 rounded-2xl p-6 mb-6">
                <p className="text-2xl font-bold text-pink-800">
                  {dare.dare_text}
                </p>
              </div>
              <FloatingButton
                onClick={() => {
                  setDare(null)
                  getDare()
                }}
                className="bg-pink-600 text-white px-12 py-6 text-2xl"
              >
                Another Dare! 🔄
              </FloatingButton>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default DareMachine

