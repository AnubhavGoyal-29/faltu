import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const AukaatMeter = () => {
  const navigate = useNavigate()
  const [check, setCheck] = useState(null)
  const [loading, setLoading] = useState(false)

  const getCheck = async () => {
    setLoading(true)
    try {
      const response = await api.get('/games/aukaatMeter')
      if (response.data.success) {
        setCheck(response.data.check)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Get check error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          📊 Aukaat Meter
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!check ? (
            <FloatingButton onClick={getCheck} disabled={loading} className="bg-red-600 text-white py-4 px-8 text-xl">
              {loading ? 'Checking...' : 'Check Aukaat! 🚀'}
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-100 rounded-2xl p-6">
                <p className="text-2xl font-bold">Aukaat: {check.aukaat}</p>
                <p className="text-lg mt-2">{check.message}</p>
                <p className="text-green-800 font-bold mt-4">Points: {check.points_awarded}</p>
              </div>
              <FloatingButton onClick={getCheck} className="bg-red-600 text-white py-4 px-8 text-xl">
                Check Again! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AukaatMeter

