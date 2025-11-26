import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const PoetryChaos = () => {
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState(null)
  const [poem, setPoem] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchChallenge()
  }, [])

  const fetchChallenge = async () => {
    try {
      const response = await api.get('/games/poetryChaos')
      if (response.data.success) {
        setChallenge(response.data.challenge)
      }
    } catch (error) {
      console.error('Fetch challenge error:', error)
    }
  }

  const handleSubmit = async () => {
    if (!poem.trim()) {
      alert('Poem to likho!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/poetryChaos/submit', {
        poetry_id: challenge.poetry_id,
        poem
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          📜 Poetry Chaos
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        {challenge && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            <div className="bg-indigo-100 rounded-2xl p-6 mb-4">
              <p className="text-xl font-bold">{challenge.challenge}</p>
              <p className="text-sm text-gray-600 mt-2">Style: {challenge.style}</p>
            </div>

            <div className="space-y-4">
              <textarea
                value={poem}
                onChange={(e) => setPoem(e.target.value)}
                placeholder="Apna poem yahan likho..."
                className="w-full px-4 py-3 rounded-lg border-4 border-indigo-500 text-lg"
                rows="8"
              />
              <FloatingButton onClick={handleSubmit} disabled={loading} className="w-full bg-indigo-600 text-white py-4 text-lg">
                {loading ? 'Submitting...' : 'Submit Poem! 🚀'}
              </FloatingButton>
            </div>

            {result && (
              <div className="mt-6 bg-green-100 rounded-lg p-4">
                <p className="font-bold">Score: {result.score}/100</p>
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

export default PoetryChaos

