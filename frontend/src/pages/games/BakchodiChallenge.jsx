import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const BakchodiChallenge = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [challenge, setChallenge] = useState(null)
  const [submission, setSubmission] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)
  const [review, setReview] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchChallenge()
    fetchHistory()
  }, [])

  const fetchChallenge = async () => {
    try {
      const response = await api.get('/games/bakchodi/challenge')
      if (response.data.success) {
        const ch = response.data.challenge
        setChallenge(ch)
        setSubmitted(!!ch.submission)
        if (ch.submission) {
          setSubmission(ch.submission)
          setScore(ch.ai_score)
          setReview(ch.ai_review)
        }
      }
    } catch (error) {
      console.error('Fetch challenge error:', error)
    }
  }

  const fetchHistory = async () => {
    try {
      const response = await api.get('/games/bakchodi/history')
      if (response.data.success) {
        setHistory(response.data.challenges || [])
      }
    } catch (error) {
      console.error('Fetch history error:', error)
    }
  }

  const handleSubmit = async () => {
    if (!submission.trim()) {
      alert('Kuch to likho bhai!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/bakchodi/submit', { submission })
      if (response.data.success) {
        const ch = response.data.challenge
        setSubmitted(true)
        setScore(ch.ai_score)
        setReview(ch.ai_review)
        triggerConfettiBurst()
        fetchHistory()
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Submission failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <FloatingButton
            onClick={() => navigate('/games')}
            className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
          >
            ← Back
          </FloatingButton>
          <h1 className="text-4xl font-black text-white drop-shadow-2xl">
            🎭 Daily Bakchodi Challenge
          </h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        {/* Current Challenge */}
        {challenge && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-black mb-4 text-gray-800">
              Aaj Ka Challenge:
            </h2>
            <div className="bg-purple-100 rounded-2xl p-6 mb-4">
              <p className="text-xl font-bold text-purple-800">
                {challenge.challenge_text}
              </p>
            </div>

            {!submitted ? (
              <div className="space-y-4">
                <textarea
                  value={submission}
                  onChange={(e) => setSubmission(e.target.value)}
                  placeholder="Apna answer yahan likho..."
                  className="w-full px-4 py-3 rounded-lg border-4 border-purple-500 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
                  rows="6"
                />
                <FloatingButton
                  onClick={handleSubmit}
                  disabled={loading || !submission.trim()}
                  className="w-full bg-purple-600 text-white py-4 text-lg"
                >
                  {loading ? 'Submitting...' : 'Submit Karo! 🚀'}
                </FloatingButton>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-100 rounded-lg p-4">
                  <p className="font-bold text-green-800 mb-2">Your Submission:</p>
                  <p className="text-gray-800">{submission}</p>
                </div>
                {score !== null && (
                  <div className="bg-yellow-100 rounded-lg p-4">
                    <p className="font-bold text-yellow-800 mb-2">
                      Score: {score}/100 🎯
                    </p>
                    <p className="text-gray-800">{review}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            <h2 className="text-2xl font-black mb-4 text-gray-800">
              Past Challenges 📜
            </h2>
            <div className="space-y-4">
              {history.map((ch) => (
                <div key={ch.challenge_id} className="bg-gray-50 rounded-lg p-4">
                  <p className="font-bold text-gray-800 mb-2">{ch.challenge_text}</p>
                  {ch.submission && (
                    <>
                      <p className="text-sm text-gray-600 mb-1">
                        Submission: {ch.submission}
                      </p>
                      {ch.ai_score !== null && (
                        <p className="text-sm font-bold text-purple-600">
                          Score: {ch.ai_score}/100
                        </p>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default BakchodiChallenge

