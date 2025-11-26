import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const VibeScanner = () => {
  const navigate = useNavigate()
  const [vibeInput, setVibeInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!vibeInput.trim()) {
      alert('Kuch vibe to do!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/vibeScanner', { vibe_input: vibeInput })
      if (response.data.success) {
        setResult(response.data.result)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          📡 Vibe Scanner
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
          <div className="space-y-4">
            <textarea
              value={vibeInput}
              onChange={(e) => setVibeInput(e.target.value)}
              placeholder="Apna vibe yahan describe karo..."
              className="w-full px-4 py-3 rounded-lg border-4 border-indigo-500 text-lg"
              rows="6"
            />
            <FloatingButton onClick={handleSubmit} disabled={loading} className="w-full bg-indigo-600 text-white py-4 text-lg">
              {loading ? 'Scanning...' : 'Scan Vibe! 🚀'}
            </FloatingButton>
          </div>

          {result && (
            <div className="mt-6 bg-indigo-100 rounded-lg p-4">
              <p className="font-bold text-xl">Vibe Score: {result.vibe_score}/100</p>
              <p className="text-lg mt-2">{result.vibe_reading}</p>
              <p className="text-green-800 font-bold mt-4">Points: {result.points_awarded}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default VibeScanner

