import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const SpeedTyping = () => {
  const navigate = useNavigate()
  const [typing, setTyping] = useState(null)
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [result, setResult] = useState(null)
  const [gameActive, setGameActive] = useState(false)

  const startTyping = async () => {
    try {
      const response = await api.post('/games/speedTyping/start')
      if (response.data.success) {
        setTyping(response.data.typing)
        setUserInput('')
        setStartTime(null)
        setResult(null)
        setGameActive(true)
      }
    } catch (error) {
      console.error('Start typing error:', error)
    }
  }

  const handleInputChange = (e) => {
    if (!startTime) {
      setStartTime(Date.now())
    }
    setUserInput(e.target.value)
    
    if (e.target.value === typing.text_to_type) {
      endGame()
    }
  }

  const endGame = async () => {
    if (!startTime) return
    const timeTaken = (Date.now() - startTime) / 1000 / 60 // minutes
    const words = typing.text_to_type.split(' ').length
    const wpm = Math.round(words / timeTaken)
    const accuracy = 100 // Simplified - can calculate based on errors
    
    setGameActive(false)
    try {
      const response = await api.post('/games/speedTyping/submit', {
        typing_id: typing.typing_id,
        wpm,
        accuracy
      })
      if (response.data.success) {
        setResult(response.data)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Submit error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          ⌨️ Speed Typing
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
          {!typing && !result && (
            <div className="text-center">
              <FloatingButton onClick={startTyping} className="bg-blue-600 text-white py-4 px-8 text-xl">
                Start Typing Test! 🚀
              </FloatingButton>
            </div>
          )}

          {typing && gameActive && (
            <div className="space-y-4">
              <div className="bg-blue-100 rounded-lg p-4">
                <p className="text-xl font-bold">{typing.text_to_type}</p>
              </div>
              <textarea
                value={userInput}
                onChange={handleInputChange}
                placeholder="Type the text above..."
                className="w-full px-4 py-3 rounded-lg border-4 border-blue-500 text-lg"
                rows="4"
              />
            </div>
          )}

          {result && (
            <div className="space-y-4 text-center">
              <div className="bg-green-100 rounded-lg p-4">
                <p className="font-bold text-2xl">WPM: {result.wpm}</p>
                <p className="text-lg mt-2">Accuracy: {result.accuracy}%</p>
                <p className="text-green-800 font-bold mt-4">Points: {result.points_awarded}</p>
              </div>
              <FloatingButton onClick={startTyping} className="bg-blue-600 text-white py-4 px-8 text-xl">
                Try Again! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default SpeedTyping

