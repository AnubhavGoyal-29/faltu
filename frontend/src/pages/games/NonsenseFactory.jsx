import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const NonsenseFactory = () => {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState(null)
  const [nonsense, setNonsense] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPrompt()
  }, [])

  const fetchPrompt = async () => {
    try {
      const response = await api.get('/games/nonsenseFactory')
      if (response.data.success) {
        setPrompt(response.data.prompt)
      }
    } catch (error) {
      console.error('Fetch prompt error:', error)
    }
  }

  const handleSubmit = async () => {
    if (!nonsense.trim()) {
      alert('Nonsense to likho!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/nonsenseFactory/submit', {
        prompt_id: prompt.prompt_id,
        nonsense
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
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🏭 Nonsense Factory
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        {prompt && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            <div className="bg-purple-100 rounded-2xl p-6 mb-4">
              <p className="text-xl font-bold">{prompt.challenge}</p>
            </div>

            <div className="space-y-4">
              <textarea
                value={nonsense}
                onChange={(e) => setNonsense(e.target.value)}
                placeholder="Apna nonsense yahan likho..."
                className="w-full px-4 py-3 rounded-lg border-4 border-purple-500 text-lg"
                rows="6"
              />
              <FloatingButton onClick={handleSubmit} disabled={loading} className="w-full bg-purple-600 text-white py-4 text-lg">
                {loading ? 'Submitting...' : 'Submit Nonsense! 🚀'}
              </FloatingButton>
            </div>

            {result && (
              <div className="mt-6 bg-green-100 rounded-lg p-4">
                <p className="font-bold">Creativity: {result.creativity_score}/100</p>
                <p className="text-green-800 font-bold mt-2">Points: {result.points_awarded}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default NonsenseFactory

