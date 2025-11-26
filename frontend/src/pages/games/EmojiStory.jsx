import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const EmojiStory = () => {
  const navigate = useNavigate()
  const [story, setStory] = useState(null)
  const [emojiStory, setEmojiStory] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStory()
  }, [])

  const fetchStory = async () => {
    try {
      const response = await api.get('/games/emojiStory')
      if (response.data.success) {
        setStory(response.data.story)
        setEmojiStory('')
        setResult(null)
      }
    } catch (error) {
      console.error('Fetch story error:', error)
    }
  }

  const handleSubmit = async () => {
    if (!emojiStory.trim()) {
      alert('Kuch emoji story to banao!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/emojiStory/submit', {
        story_id: story.story_id,
        emoji_story: emojiStory
      })
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          📖 Emoji Story
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        {story && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            <div className="bg-yellow-100 rounded-2xl p-4 mb-4">
              <p className="text-lg font-bold text-yellow-800">{story.challenge}</p>
              <p className="text-sm text-yellow-600 mt-2">
                Use {story.required_emojis} emojis ({story.min_emojis}-{story.max_emojis} range)
              </p>
            </div>

            {!result ? (
              <div className="space-y-4">
                <textarea
                  value={emojiStory}
                  onChange={(e) => setEmojiStory(e.target.value)}
                  placeholder="Apni emoji story yahan likho..."
                  className="w-full px-4 py-3 rounded-lg border-4 border-yellow-500 text-lg"
                  rows="6"
                />
                <FloatingButton onClick={handleSubmit} disabled={loading} className="w-full bg-yellow-600 text-white py-4 text-lg">
                  {loading ? 'Submitting...' : 'Submit Story! 🚀'}
                </FloatingButton>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-100 rounded-lg p-4">
                  <p className="font-bold text-2xl">Creativity Score: {result.creativity_score}/100</p>
                  <p className="text-green-800 font-bold mt-4">Points: {result.points_awarded}</p>
                </div>
                <FloatingButton onClick={fetchStory} className="w-full bg-yellow-600 text-white py-4 text-lg">
                  Create Another! 🔄
                </FloatingButton>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default EmojiStory

