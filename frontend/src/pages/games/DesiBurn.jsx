import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const DesiBurn = () => {
  const navigate = useNavigate()
  const [burn, setBurn] = useState(null)
  const [loading, setLoading] = useState(false)

  const getBurn = async () => {
    setLoading(true)
    try {
      const response = await api.get('/games/desiBurn')
      if (response.data.success) {
        setBurn(response.data.burn)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Get burn error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🔥 Desi Burn
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!burn ? (
            <FloatingButton onClick={getBurn} disabled={loading} className="bg-orange-600 text-white py-4 px-8 text-xl">
              {loading ? 'Loading...' : 'Get Desi Burn! 🚀'}
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              <div className="bg-orange-100 rounded-2xl p-6">
                <p className="text-xl font-bold">{burn.burn_text}</p>
                <p className="text-green-800 font-bold mt-4">Points: {burn.points_awarded}</p>
              </div>
              <FloatingButton onClick={getBurn} className="bg-orange-600 text-white py-4 px-8 text-xl">
                Get Another Burn! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default DesiBurn

