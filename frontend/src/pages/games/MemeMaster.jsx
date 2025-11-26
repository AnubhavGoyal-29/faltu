import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const MemeMaster = () => {
  const navigate = useNavigate()
  const [memeCaption, setMemeCaption] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!memeCaption.trim()) {
      alert('Meme caption to likho!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/memeMaster/submit', { meme_caption: memeCaption })
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🎭 Meme Master
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
          <div className="space-y-4">
            <textarea
              value={memeCaption}
              onChange={(e) => setMemeCaption(e.target.value)}
              placeholder="Apna meme caption yahan likho..."
              className="w-full px-4 py-3 rounded-lg border-4 border-yellow-500 text-lg"
              rows="6"
            />
            <FloatingButton onClick={handleSubmit} disabled={loading} className="w-full bg-yellow-600 text-white py-4 text-lg">
              {loading ? 'Submitting...' : 'Submit Meme! 🚀'}
            </FloatingButton>
          </div>

          {result && (
            <div className="mt-6 bg-yellow-100 rounded-lg p-4">
              <p className="font-bold text-2xl">Meme Score: {result.meme_score}/100</p>
              {result.viral && <p className="text-green-800 font-bold">🔥 VIRAL!</p>}
              {result.legendary && <p className="text-purple-800 font-bold">👑 LEGENDARY!</p>}
              <p className="mt-2">{result.ai_review}</p>
              <p className="text-green-800 font-bold mt-4">Points: {result.points_awarded}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MemeMaster

