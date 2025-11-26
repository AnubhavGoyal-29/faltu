import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const BakchodiLevel = () => {
  const navigate = useNavigate()
  const [bakchodiText, setBakchodiText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!bakchodiText.trim()) {
      alert('Kuch bakchodi to likho!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/bakchodiLevel', { bakchodi_text: bakchodiText })
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
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🎭 Bakchodi Level
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
          <div className="space-y-4">
            <textarea
              value={bakchodiText}
              onChange={(e) => setBakchodiText(e.target.value)}
              placeholder="Apna bakchodi yahan likho..."
              className="w-full px-4 py-3 rounded-lg border-4 border-orange-500 text-lg"
              rows="6"
            />
            <FloatingButton onClick={handleSubmit} disabled={loading} className="w-full bg-orange-600 text-white py-4 text-lg">
              {loading ? 'Checking...' : 'Check Bakchodi Level! 🚀'}
            </FloatingButton>
          </div>

          {result && (
            <div className="mt-6 bg-orange-100 rounded-lg p-4">
              <p className="font-bold text-2xl">Bakchodi Score: {result.bakchodi_score}/100</p>
              <p className="text-lg mt-2">Level: {result.level}</p>
              {result.level === 'god' && <p className="text-purple-800 font-bold">👑 GOD LEVEL!</p>}
              {result.level === 'legendary' && <p className="text-purple-800 font-bold">🔥 LEGENDARY!</p>}
              <p className="mt-2">{result.message}</p>
              <p className="text-green-800 font-bold mt-4">Points: {result.points_awarded}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default BakchodiLevel

