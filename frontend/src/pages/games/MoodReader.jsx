import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const MoodReader = () => {
  const navigate = useNavigate()
  const [moodInput, setMoodInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!moodInput.trim()) {
      alert('Kuch mood to describe karo!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/moodReader', { mood_input: moodInput })
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
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-rose-500 to-red-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          📖 Mood Reader
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
          <div className="space-y-4">
            <textarea
              value={moodInput}
              onChange={(e) => setMoodInput(e.target.value)}
              placeholder="Apna mood yahan describe karo..."
              className="w-full px-4 py-3 rounded-lg border-4 border-pink-500 text-lg"
              rows="6"
            />
            <FloatingButton onClick={handleSubmit} disabled={loading} className="w-full bg-pink-600 text-white py-4 text-lg">
              {loading ? 'Reading...' : 'Read Mood! 🚀'}
            </FloatingButton>
          </div>

          {result && (
            <div className="mt-6 bg-pink-100 rounded-lg p-4">
              <p className="font-bold text-xl">{result.reading}</p>
              <p className="text-lg mt-2">Accuracy: {(result.accuracy * 100).toFixed(0)}%</p>
              <p className="text-green-800 font-bold mt-4">Points: {result.points_awarded}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MoodReader

