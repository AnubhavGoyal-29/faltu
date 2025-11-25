import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const WheelSpin = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState(null)
  const [rotation, setRotation] = useState(0)

  const spin = async () => {
    if (spinning) return

    setSpinning(true)
    setResult(null)
    
    // Random rotation for animation
    const newRotation = rotation + 1800 + Math.random() * 360
    setRotation(newRotation)

    try {
      const response = await api.post('/games/wheel/spin')
      if (response.data.success) {
        setTimeout(() => {
          setResult(response.data.result)
          setSpinning(false)
          triggerConfettiBurst()
        }, 2000)
      }
    } catch (error) {
      console.error('Spin error:', error)
      setSpinning(false)
    }
  }

  const getResultColor = (type) => {
    const colors = {
      roast: 'bg-red-500',
      compliment: 'bg-green-500',
      dare: 'bg-purple-500',
      mini_game: 'bg-blue-500',
      mystery_reward: 'bg-yellow-500'
    }
    return colors[type] || 'bg-gray-500'
  }

  const getResultEmoji = (type) => {
    const emojis = {
      roast: '🔥',
      compliment: '💚',
      dare: '😈',
      mini_game: '🎮',
      mystery_reward: '🎁'
    }
    return emojis[type] || '🎯'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <FloatingButton
            onClick={() => navigate('/games')}
            className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
          >
            ← Back
          </FloatingButton>
          <h1 className="text-4xl font-black text-white drop-shadow-2xl">
            🎡 Lucky Nonsense Wheel
          </h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          <div className="mb-8">
            <div
              className={`w-64 h-64 mx-auto rounded-full border-8 border-gray-800 relative overflow-hidden transition-transform duration-2000 ${
                spinning ? 'animate-spin' : ''
              }`}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl">🎡</div>
              </div>
              <div className="absolute top-0 left-1/2 w-0 h-0 border-l-8 border-r-8 border-t-16 border-t-red-500 transform -translate-x-1/2"></div>
            </div>
          </div>

          <FloatingButton
            onClick={spin}
            disabled={spinning}
            className="bg-green-600 text-white px-12 py-6 text-2xl mb-6"
          >
            {spinning ? 'Spinning...' : 'Spin the Wheel! 🎡'}
          </FloatingButton>

          {result && (
            <div className={`${getResultColor(result.type)} rounded-2xl p-6 text-white mt-6 animate-bounce`}>
              <div className="text-6xl mb-4">{getResultEmoji(result.type)}</div>
              <h3 className="text-2xl font-black mb-2 capitalize">{result.type.replace('_', ' ')}</h3>
              {result.content && (
                <p className="text-xl">{result.content}</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default WheelSpin

