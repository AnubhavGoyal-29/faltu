import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const Debate = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [debateId, setDebateId] = useState(null)
  const [topic, setTopic] = useState('')
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('active') // active, user_won, ai_won, user_forfeit, completed
  const [winner, setWinner] = useState(null)
  const [explanation, setExplanation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const startNewDebate = async () => {
    setLoading(true)
    try {
      const response = await api.get('/games/debate/topic')
      if (response.data.success) {
        setDebateId(response.data.debate_id)
        setTopic(response.data.topic)
        setMessages([])
        setMessage('')
        setStatus('active')
        setWinner(null)
        setExplanation(null)
      }
    } catch (error) {
      console.error('Get topic error:', error)
      alert('Topic fetch nahi hua!')
    } finally {
      setLoading(false)
    }
  }

  const loadDebate = async (id) => {
    try {
      const response = await api.get(`/games/debate/${id}`)
      if (response.data.success) {
        const debate = response.data.debate
        setDebateId(debate.debate_id)
        setTopic(debate.topic)
        setMessages(debate.messages || [])
        setStatus(debate.status)
        setWinner(debate.winner)
        setExplanation(debate.ai_explanation)
      }
    } catch (error) {
      console.error('Load debate error:', error)
    }
  }

  const submitMessage = async () => {
    if (!message.trim() || !debateId) {
      alert('Kuch message to do bhai!')
      return
    }

    if (status !== 'active') {
      alert('Debate already completed!')
      return
    }

    setLoading(true)
    setAiThinking(true)
    
    try {
      const response = await api.post('/games/debate/message', {
        debate_id: debateId,
        message: message.trim()
      })
      
      if (response.data.success) {
        const debate = response.data.debate
        setMessages(debate.messages || [])
        setStatus(debate.status)
        setWinner(debate.winner)
        setExplanation(debate.ai_explanation)
        setMessage('')
        
        if (debate.status !== 'active') {
          triggerConfettiBurst()
        }
      }
    } catch (error) {
      console.error('Submit message error:', error)
      alert(error.response?.data?.error || 'Message submit nahi hui!')
    } finally {
      setLoading(false)
      setAiThinking(false)
    }
  }

  const forfeitDebate = async () => {
    if (!debateId) return
    
    if (!confirm('Are you sure you want to forfeit? AI will win!')) {
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/debate/forfeit', {
        debate_id: debateId
      })
      
      if (response.data.success) {
        const debate = response.data.debate
        setStatus(debate.status)
        setWinner(debate.winner)
        setExplanation(debate.ai_explanation)
      }
    } catch (error) {
      console.error('Forfeit error:', error)
      alert('Forfeit nahi hua!')
    } finally {
      setLoading(false)
    }
  }

  const isCompleted = status !== 'active'
  const messageCount = messages.length

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
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Messages: {messageCount} / 10+ (minimum)
                </p>
                {!isCompleted && (
                  <FloatingButton
                    onClick={forfeitDebate}
                    disabled={loading}
                    className="bg-red-500 text-white px-4 py-2 text-sm"
                  >
                    I Accept Loss 😔
                  </FloatingButton>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
              <h3 className="text-xl font-black mb-4 text-gray-800">Debate Messages:</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Start the debate by sending your first argument!</p>
                ) : (
                  messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-blue-100 ml-8'
                          : 'bg-red-100 mr-8'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-sm">
                          {msg.sender === 'user' ? '👤 You' : '🤖 AI'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-gray-800">{msg.message}</p>
                    </div>
                  ))
                )}
                {aiThinking && (
                  <div className="bg-gray-100 p-4 rounded-lg mr-8">
                    <p className="text-gray-600 italic">🤖 AI soch raha hai...</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            {!isCompleted && (
              <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
                <h3 className="text-xl font-black mb-4 text-gray-800">
                  Apna Argument Likho:
                </h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tumhara side kya hai? Likho..."
                  className="w-full px-4 py-3 rounded-lg border-4 border-blue-500 text-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                  rows="4"
                  disabled={loading || aiThinking}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      submitMessage()
                    }
                  }}
                />
                <div className="mt-4 flex gap-4">
                  <FloatingButton
                    onClick={submitMessage}
                    disabled={loading || aiThinking || !message.trim()}
                    className="flex-1 bg-blue-600 text-white py-4 text-lg"
                  >
                    {loading || aiThinking ? 'Sending...' : 'Send Message! 🚀'}
                  </FloatingButton>
                  <FloatingButton
                    onClick={startNewDebate}
                    disabled={loading}
                    className="bg-gray-500 text-white py-4 px-6"
                  >
                    New Topic 🔄
                  </FloatingButton>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Tip: Press Ctrl+Enter to send quickly
                </p>
              </div>
            )}

            {/* Result */}
            {isCompleted && (
              <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl space-y-4">
                <h3 className="text-2xl font-black text-gray-800">Debate Result:</h3>
                
                <div className={`rounded-lg p-4 ${
                  winner === 'user' ? 'bg-green-100' : 'bg-yellow-100'
                }`}>
                  <p className="font-bold text-lg mb-2">
                    Winner: {winner === 'user' ? 'You! 🎉' : 'AI 🤖'}
                  </p>
                  {explanation && (
                    <p className="text-gray-800">{explanation}</p>
                  )}
                  {status === 'user_forfeit' && (
                    <p className="text-gray-600 mt-2">You forfeited the debate.</p>
                  )}
                </div>

                <FloatingButton
                  onClick={() => {
                    setDebateId(null)
                    setTopic('')
                    setMessages([])
                    setMessage('')
                    setStatus('active')
                    setWinner(null)
                    setExplanation(null)
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
