import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const EmojiMashup = () => {
  const navigate = useNavigate()
  const [mashup, setMashup] = useState(null)
  const [emojiStory, setEmojiStory] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMashup()
  }, [])

  const fetchMashup = async () => {
    try {
      const response = await api.get('/games/emojiMashup')
      if (response.data.success) {
        setMashup(response.data.mashup)
      }
    } catch (error) {
      console.error('Fetch mashup error:', error)
    }
  }

  const handleSubmit = async () => {
    if (!emojiStory.trim()) {
      alert('Emoji story to likho!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/emojiMashup/submit', {
        mashup_id: mashup.mashup_id,
        emoji_story: emojiStory
      })
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
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          😂 Emoji Mashup
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        {mashup && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            <div className="bg-pink-100 rounded-2xl p-6 mb-4">
              <p className="text-xl font-bold">{mashup.challenge}</p>
            </div>

            <div className="space-y-4">
              <textarea
                value={emojiStory}
                onChange={(e) => setEmojiStory(e.target.value)}
                placeholder="Emoji story yahan likho..."
                className="w-full px-4 py-3 rounded-lg border-4 border-pink-500 text-lg"
                rows="6"
              />
              <FloatingButton onClick={handleSubmit} disabled={loading} className="w-full bg-pink-600 text-white py-4 text-lg">
                {loading ? 'Submitting...' : 'Submit! 🚀'}
              </FloatingButton>
            </div>

            {result && (
              <div className="mt-6 bg-green-100 rounded-lg p-4">
                <p className="font-bold">Creativity Score: {result.creativity_score}/100</p>
                <p>{result.ai_review}</p>
                <p className="text-green-800 font-bold">Points: {result.points_awarded}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default EmojiMashup

