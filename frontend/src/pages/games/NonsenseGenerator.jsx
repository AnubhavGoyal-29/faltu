import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const NonsenseGenerator = () => {
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
      const response = await api.get('/games/nonsenseGenerator')
      if (response.data.success) {
        setPrompt(response.data.prompt)
        setNonsense('')
        setResult(null)
      }
    } catch (error) {
      console.error('Fetch prompt error:', error)
    }
  }

  const handleSubmit = async () => {
    if (!nonsense.trim()) {
      alert('Kuch nonsense to generate karo!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/nonsenseGenerator/submit', {
        prompt_id: prompt.prompt_id,
        nonsense
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
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🎲 Nonsense Generator
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        {prompt && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            <div className="bg-purple-100 rounded-2xl p-4 mb-4">
              <p className="text-lg font-bold text-purple-800">{prompt.prompt}</p>
              <p className="text-sm text-purple-600 mt-2">Type: {prompt.nonsense_type}</p>
            </div>

            {!result ? (
              <div className="space-y-4">
                <textarea
                  value={nonsense}
                  onChange={(e) => setNonsense(e.target.value)}
                  placeholder="Apna nonsense yahan likho..."
                  className="w-full px-4 py-3 rounded-lg border-4 border-purple-500 text-lg"
                  rows="6"
                />
                <FloatingButton onClick={handleSubmit} disabled={loading} className="w-full bg-purple-600 text-white py-4 text-lg">
                  {loading ? 'Generating...' : 'Generate Nonsense! 🚀'}
                </FloatingButton>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-100 rounded-lg p-4">
                  <p className="font-bold text-2xl">Creativity Score: {result.creativity_score}/100</p>
                  <p className="text-green-800 font-bold mt-4">Points: {result.points_awarded}</p>
                </div>
                <FloatingButton onClick={fetchPrompt} className="w-full bg-purple-600 text-white py-4 text-lg">
                  Generate More! 🔄
                </FloatingButton>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default NonsenseGenerator

