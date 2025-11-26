import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const EmojiTale = () => {
  const navigate = useNavigate()
  const [tale, setTale] = useState(null)
  const [emojiStory, setEmojiStory] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTale()
  }, [])

  const fetchTale = async () => {
    try {
      const response = await api.get('/games/emojiTale')
      if (response.data.success) {
        setTale(response.data.tale)
      }
    } catch (error) {
      console.error('Fetch tale error:', error)
    }
  }

  const handleSubmit = async () => {
    if (!emojiStory.trim()) {
      alert('Emoji tale to likho!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/emojiTale/submit', {
        tale_id: tale.tale_id,
        emoji_story: emojiStory
      })
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
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          📖 Emoji Tale
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        {tale && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            <div className="bg-pink-100 rounded-2xl p-6 mb-4">
              <p className="text-xl font-bold">{tale.challenge}</p>
            </div>

            <div className="space-y-4">
              <textarea
                value={emojiStory}
                onChange={(e) => setEmojiStory(e.target.value)}
                placeholder="Emoji tale yahan likho..."
                className="w-full px-4 py-3 rounded-lg border-4 border-pink-500 text-lg"
                rows="6"
              />
              <FloatingButton onClick={handleSubmit} disabled={loading} className="w-full bg-pink-600 text-white py-4 text-lg">
                {loading ? 'Submitting...' : 'Submit Tale! 🚀'}
              </FloatingButton>
            </div>

            {result && (
              <div className="mt-6 bg-green-100 rounded-lg p-4">
                <p className="font-bold">Creativity: {result.creativity_score}/100</p>
                <p>{result.ai_review}</p>
                <p className="text-green-800 font-bold mt-2">Points: {result.points_awarded}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default EmojiTale

