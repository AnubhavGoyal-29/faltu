import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const QuizChaos = () => {
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchQuiz()
  }, [])

  const fetchQuiz = async () => {
    try {
      const response = await api.get('/games/quizChaos')
      if (response.data.success) {
        setQuiz(response.data.quiz)
      }
    } catch (error) {
      console.error('Fetch quiz error:', error)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await api.post('/games/quizChaos/submit', {
        quiz_id: quiz.quiz_id,
        answers
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          ❓ Quiz Chaos
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        {quiz && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            {quiz.questions && quiz.questions.map((q, idx) => (
              <div key={idx} className="mb-6">
                <p className="font-bold text-lg mb-2">{q.question}</p>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => setAnswers({ ...answers, [idx]: optIdx })}
                      className={`w-full p-3 rounded-lg border-2 ${
                        answers[idx] === optIdx ? 'bg-purple-500 text-white' : 'bg-gray-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <FloatingButton onClick={handleSubmit} disabled={loading} className="w-full bg-purple-600 text-white py-4 text-lg">
              {loading ? 'Submitting...' : 'Submit Quiz! 🚀'}
            </FloatingButton>
            {result && (
              <div className="mt-6 bg-green-100 rounded-lg p-4">
                <p className="font-bold">Correct: {result.correct_count}/{result.total_questions}</p>
                <p className="text-green-800 font-bold mt-2">Points: {result.points_awarded}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default QuizChaos

