import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const JhandMeter = () => {
  const navigate = useNavigate()
  const [meter, setMeter] = useState(null)
  const [loading, setLoading] = useState(false)

  const getMeter = async () => {
    setLoading(true)
    try {
      const response = await api.get('/games/jhandMeter')
      if (response.data.success) {
        setMeter(response.data.meter)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Get meter error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 via-slate-500 to-zinc-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          📉 Jhand Meter
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!meter ? (
            <FloatingButton onClick={getMeter} disabled={loading} className="bg-gray-600 text-white py-4 px-8 text-xl">
              {loading ? 'Measuring...' : 'Measure Jhand! 🚀'}
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-100 rounded-2xl p-6">
                <p className="text-2xl font-bold">Jhand Score: {meter.jhand_score}/100</p>
                <p className="text-lg mt-2">Level: {meter.jhand_level}</p>
                <p className="text-lg mt-2">{meter.message}</p>
                <p className="text-green-800 font-bold mt-4">Points: {meter.points_awarded}</p>
              </div>
              <FloatingButton onClick={getMeter} className="bg-gray-600 text-white py-4 px-8 text-xl">
                Measure Again! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default JhandMeter

