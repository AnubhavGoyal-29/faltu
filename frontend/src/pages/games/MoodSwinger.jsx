import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const MoodSwinger = () => {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [currentMood, setCurrentMood] = useState('')
  const [loading, setLoading] = useState(false)

  const startSession = async () => {
    try {
      const response = await api.post('/games/moodSwinger/start')
      if (response.data.success) {
        setSession(response.data.session)
      }
    } catch (error) {
      console.error('Start session error:', error)
    }
  }

  const submitMood = async (mood) => {
    setLoading(true)
    try {
      const response = await api.post('/games/moodSwinger/switch', {
        session_id: session.session_id,
        mood
      })
      if (response.data.success) {
        setCurrentMood(mood)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Submit mood error:', error)
    } finally {
      setLoading(false)
    }
  }

  const moods = ['happy', 'sad', 'angry', 'confused', 'excited', 'chill']

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🎭 Mood Swinger
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        {!session ? (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
            <FloatingButton onClick={startSession} className="bg-blue-600 text-white py-4 px-8 text-xl">
              Start Mood Swinger! 🚀
            </FloatingButton>
          </div>
        ) : (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            <p className="text-xl font-bold mb-4">Switch moods rapidly!</p>
            <div className="grid grid-cols-3 gap-4">
              {moods.map((mood) => (
                <FloatingButton
                  key={mood}
                  onClick={() => submitMood(mood)}
                  disabled={loading}
                  className="bg-blue-600 text-white py-4 text-lg capitalize"
                >
                  {mood}
                </FloatingButton>
              ))}
            </div>
            {currentMood && (
              <div className="mt-4 bg-green-100 rounded-lg p-4">
                <p className="font-bold">Mood switched to: {currentMood}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default MoodSwinger

