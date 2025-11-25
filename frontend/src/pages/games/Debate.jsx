import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const Debate = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [topic, setTopic] = useState('')
  const [argument, setArgument] = useState('')
  const [debateResult, setDebateResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const startNewDebate = async () => {
    setLoading(true)
    try {
      const response = await api.get('/games/debate/topic')
      if (response.data.success) {
        setTopic(response.data.topic)
        setArgument('')
        setDebateResult(null)
      }
    } catch (error) {
      console.error('Get topic error:', error)
      alert('Topic fetch nahi hua!')
    } finally {
      setLoading(false)
    }
  }

  const submitArgument = async () => {
    if (!argument.trim()) {
      alert('Kuch argument to do bhai!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/debate/submit', {
        topic,
        argument
      })
      if (response.data.success) {
        setDebateResult(response.data.debate)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Submit debate error:', error)
      alert('Debate submit nahi hui!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <FloatingButton
            onClick={() => navigate('/games')}
            className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
          >
            ← Back
          </FloatingButton>
          <h1 className="text-4xl font-black text-white drop-shadow-2xl">
            💬 Random Argument Generator
          </h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        {!topic ? (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
            <p className="text-xl mb-4">Ready for a random absurd debate?</p>
            <FloatingButton
              onClick={startNewDebate}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-4 text-lg"
            >
              {loading ? 'Loading...' : 'Start Debate! 🎯'}
            </FloatingButton>
          </div>
        ) : (
          <>
            {/* Topic */}
            <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-black mb-4 text-gray-800">
                Debate Topic:
              </h2>
              <div className="bg-blue-100 rounded-2xl p-6">
                <p className="text-2xl font-bold text-blue-800">
                  {topic}
                </p>
              </div>
            </div>

            {/* Argument Input */}
            {!debateResult && (
              <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-xl font-black mb-4 text-gray-800">
                  Apna Argument Likho:
                </h3>
                <textarea
                  value={argument}
                  onChange={(e) => setArgument(e.target.value)}
                  placeholder="Tumhara side kya hai? Likho..."
                  className="w-full px-4 py-3 rounded-lg border-4 border-blue-500 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                  rows="6"
                />
                <div className="mt-4 flex gap-4">
                  <FloatingButton
                    onClick={submitArgument}
                    disabled={loading || !argument.trim()}
                    className="flex-1 bg-blue-600 text-white py-4 text-lg"
                  >
                    {loading ? 'Submitting...' : 'Submit Argument! 🚀'}
                  </FloatingButton>
                  <FloatingButton
                    onClick={startNewDebate}
                    disabled={loading}
                    className="bg-gray-500 text-white py-4 px-6"
                  >
                    New Topic 🔄
                  </FloatingButton>
                </div>
              </div>
            )}

            {/* Result */}
            {debateResult && (
              <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl space-y-4">
                <h3 className="text-2xl font-black text-gray-800">Debate Result:</h3>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-bold text-gray-800 mb-2">Your Argument:</p>
                  <p className="text-gray-700">{debateResult.user_argument}</p>
                </div>

                <div className="bg-red-50 rounded-lg p-4">
                  <p className="font-bold text-red-800 mb-2">AI Counter-Argument:</p>
                  <p className="text-gray-700">{debateResult.ai_counter_argument}</p>
                </div>

                <div className={`rounded-lg p-4 ${
                  debateResult.winner === 'user' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  <p className="font-bold text-lg mb-2">
                    Winner: {debateResult.winner === 'user' ? 'You! 🎉' : 'AI 🤖'}
                  </p>
                  <p className="text-gray-800">{debateResult.ai_explanation}</p>
                </div>

                <FloatingButton
                  onClick={() => {
                    setTopic('')
                    setArgument('')
                    setDebateResult(null)
                  }}
                  className="w-full bg-blue-600 text-white py-4 text-lg"
                >
                  New Debate! 🔄
                </FloatingButton>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Debate

