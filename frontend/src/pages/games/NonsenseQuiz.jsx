import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const NonsenseQuiz = () => {
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
      const response = await api.get('/games/nonsenseQuiz')
      if (response.data.success) {
        setQuiz(response.data.quiz)
        setAnswers({})
        setResult(null)
      }
    } catch (error) {
      console.error('Fetch quiz error:', error)
    }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      alert('Sab questions ke answers do!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/nonsenseQuiz/submit', {
        quiz_id: quiz.quiz_id,
        answers: Object.values(answers)
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
          🎲 Nonsense Quiz
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        {quiz && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            {!result ? (
              <div className="space-y-6">
                {quiz.questions.map((q, idx) => (
                  <div key={idx} className="bg-purple-100 rounded-lg p-4">
                    <p className="font-bold text-lg mb-2">{q.q}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <label key={optIdx} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${idx}`}
                            value={opt}
                            checked={answers[idx] === opt}
                            onChange={() => setAnswers({ ...answers, [idx]: opt })}
                            className="w-4 h-4"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <FloatingButton onClick={handleSubmit} disabled={loading} className="w-full bg-purple-600 text-white py-4 text-lg">
                  {loading ? 'Submitting...' : 'Submit Quiz! 🚀'}
                </FloatingButton>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-100 rounded-lg p-4 text-center">
                  <p className="font-bold text-2xl">Correct: {result.correct_answers}/{result.total_questions}</p>
                  <p className="text-green-800 font-bold mt-4">Points: {result.points_awarded}</p>
                </div>
                <FloatingButton onClick={fetchQuiz} className="w-full bg-purple-600 text-white py-4 text-lg">
                  Take Another Quiz! 🔄
                </FloatingButton>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default NonsenseQuiz

