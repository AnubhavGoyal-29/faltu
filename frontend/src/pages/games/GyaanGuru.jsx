import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const GyaanGuru = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [gyaan, setGyaan] = useState(null)
  const [rating, setRating] = useState(50)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchGyaan()
  }, [])

  const fetchGyaan = async () => {
    try {
      const response = await api.get('/games/gyaanGuru')
      if (response.data.success) {
        setGyaan(response.data.gyaan)
      }
    } catch (error) {
      console.error('Fetch gyaan error:', error)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await api.post('/games/gyaanGuru/rate', {
        gyaan_id: gyaan.gyaan_id,
        rating
      })
      if (response.data.success) {
        setSubmitted(true)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Submit rating error:', error)
      alert('Rating submit nahi hui!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🧙 Gyaan Guru
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        {gyaan && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            <div className="bg-purple-100 rounded-2xl p-6 mb-4">
              <p className="text-xl font-bold text-purple-800">{gyaan.gyaan_text || gyaan.gyaan}</p>
            </div>

            {!submitted ? (
              <div className="space-y-4">
                <label className="block text-lg font-bold">Rate this gyaan (0-100):</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full"
                />
                <p className="text-center text-2xl font-bold">{rating}</p>
                <FloatingButton onClick={handleSubmit} disabled={loading} className="w-full bg-purple-600 text-white py-4 text-lg">
                  {loading ? 'Submitting...' : 'Submit Rating! 🚀'}
                </FloatingButton>
              </div>
            ) : (
              <div className="bg-green-100 rounded-lg p-4">
                <p className="font-bold text-green-800">Rating submitted! Points earned!</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default GyaanGuru

