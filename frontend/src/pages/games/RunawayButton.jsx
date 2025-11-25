import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const RunawayButton = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [attempts, setAttempts] = useState(0)
  const [won, setWon] = useState(false)
  const [buttonPosition, setButtonPosition] = useState({ x: 50, y: 50 })

  const handleMouseEnter = () => {
    if (won) return
    
    const newX = Math.random() * 80 + 10
    const newY = Math.random() * 80 + 10
    setButtonPosition({ x: newX, y: newY })
    setAttempts((prev) => prev + 1)
  }

  const handleClick = async () => {
    if (won) return

    setWon(true)
    triggerConfettiBurst()
    
    try {
      await api.post('/games/runaway/win', { attempts })
    } catch (error) {
      console.error('Record win error:', error)
    }
  }

  const reset = () => {
    setAttempts(0)
    setWon(false)
    setButtonPosition({ x: 50, y: 50 })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 p-6 relative">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <FloatingButton
            onClick={() => navigate('/games')}
            className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
          >
            ← Back
          </FloatingButton>
          <h1 className="text-4xl font-black text-white drop-shadow-2xl">
            🏃 Button That Runs Away
          </h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          <p className="text-xl mb-4">Button ko pakdo jab tak wo bhaag raha hai!</p>
          <p className="text-lg text-gray-600 mb-6">Attempts: {attempts}</p>

          <div className="relative h-96 bg-gray-100 rounded-2xl overflow-hidden">
            <button
              onMouseEnter={handleMouseEnter}
              onClick={handleClick}
              disabled={won}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                won ? 'bg-green-500' : 'bg-red-500'
              } text-white px-8 py-4 rounded-full text-xl font-black shadow-2xl ${
                !won && 'hover:scale-110'
              }`}
              style={{
                left: `${buttonPosition.x}%`,
                top: `${buttonPosition.y}%`
              }}
            >
              {won ? '🎉 Pakad Liya!' : 'Click Me! 🏃'}
            </button>
          </div>

          {won && (
            <div className="mt-6">
              <p className="text-2xl font-bold text-green-600 mb-4">
                Jeet Gaye! {attempts} attempts mein pakad liya! 🎉
              </p>
              <FloatingButton
                onClick={reset}
                className="bg-orange-600 text-white px-8 py-4 text-lg"
              >
                Phir Se Khelo! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default RunawayButton

