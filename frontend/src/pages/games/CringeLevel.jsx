import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const CringeLevel = () => {
  const navigate = useNavigate()
  const [cringeText, setCringeText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!cringeText.trim()) {
      alert('Kuch cringe to likho!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/cringeLevel', { cringe_text: cringeText })
      if (response.data.success) {
        setResult(response.data.result)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Submit nahi hui!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          😬 Cringe Level
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
          <div className="space-y-4">
            <textarea
              value={cringeText}
              onChange={(e) => setCringeText(e.target.value)}
              placeholder="Apna cringe text yahan likho..."
              className="w-full px-4 py-3 rounded-lg border-4 border-purple-500 text-lg"
              rows="6"
            />
            <FloatingButton onClick={handleSubmit} disabled={loading} className="w-full bg-purple-600 text-white py-4 text-lg">
              {loading ? 'Checking...' : 'Check Cringe Level! 🚀'}
            </FloatingButton>
          </div>

          {result && (
            <div className="mt-6 bg-yellow-100 rounded-lg p-4">
              <p className="font-bold text-2xl">Cringe Score: {result.cringe_score}/100</p>
              <p className="text-lg mt-2">Level: {result.cringe_level}</p>
              <p className="mt-2">{result.message}</p>
              <p className="text-green-800 font-bold mt-4">Points: {result.points_awarded}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default CringeLevel

