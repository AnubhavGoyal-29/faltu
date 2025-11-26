import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const MemeGenerator = () => {
  const navigate = useNavigate()
  const [memeText, setMemeText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!memeText.trim()) {
      alert('Kuch meme text to likho!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/memeGenerator/submit', { meme_text: memeText })
      if (response.data.success) {
        setResult(response.data)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🎨 Meme Generator
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
          {result && result.image_url && (
            <div className="mb-4">
              <img src={result.image_url} alt="Meme" className="w-full rounded-lg" />
            </div>
          )}
          <div className="space-y-4">
            <textarea
              value={memeText}
              onChange={(e) => setMemeText(e.target.value)}
              placeholder="Apna meme caption yahan likho..."
              className="w-full px-4 py-3 rounded-lg border-4 border-blue-500 text-lg"
              rows="4"
            />
            <FloatingButton onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 text-white py-4 text-lg">
              {loading ? 'Generating...' : 'Generate Meme! 🚀'}
            </FloatingButton>
          </div>

          {result && (
            <div className="mt-6 bg-blue-100 rounded-lg p-4">
              <p className="font-bold text-2xl">Score: {result.score}/100</p>
              {result.viral && <p className="text-yellow-600 font-bold mt-2">🔥 VIRAL MEME!</p>}
              <p className="text-green-800 font-bold mt-4">Points: {result.points_awarded}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MemeGenerator

