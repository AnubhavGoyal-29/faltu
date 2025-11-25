import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import FloatingButton from '../components/FloatingButton'
import { triggerConfettiBurst } from '../utils/confettiBlast'

const Games = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [randomColor, setRandomColor] = useState('from-purple-500')
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')

  const funMessages = [
    'Bhai tum timepass k liye hi born hue ho!',
    'Game khel, dimaag mat laga',
    'AI thinks you can win this… maybe',
    'Yeh games faltu hain, par mast hain!',
    'Tumhara dopamine level 📈',
    'Bored? Nahi! Abhi toh shuru hua hai!'
  ]

  useEffect(() => {
    // Random color change
    const colors = [
      'from-purple-500', 'from-pink-500', 'from-blue-500',
      'from-green-500', 'from-yellow-500', 'from-red-500',
      'from-orange-500', 'from-indigo-500'
    ]
    const interval = setInterval(() => {
      setRandomColor(colors[Math.floor(Math.random() * colors.length)])
    }, 3000)

    // Random popup
    const popupInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setPopupMessage(funMessages[Math.floor(Math.random() * funMessages.length)])
        setShowPopup(true)
        setTimeout(() => setShowPopup(false), 3000)
      }
    }, 10000)

    return () => {
      clearInterval(interval)
      clearInterval(popupInterval)
    }
  }, [])

  const games = [
    {
      id: 'bakchodi',
      name: 'Daily Bakchodi Challenge',
      emoji: '🎭',
      color: 'from-purple-500 to-pink-500',
      description: 'Daily random weird prompts! AI scores your submissions.'
    },
    {
      id: 'debate',
      name: 'Random Argument Generator',
      emoji: '💬',
      color: 'from-blue-500 to-cyan-500',
      description: 'Start absurd debates! AI counters with funny arguments.'
    },
    {
      id: 'meme',
      name: 'Instant Meme Battle',
      emoji: '😂',
      color: 'from-yellow-500 to-orange-500',
      description: 'Create memes! AI scores humor, creativity, nonsense.'
    },
    {
      id: 'wheel',
      name: 'Lucky Nonsense Wheel',
      emoji: '🎡',
      color: 'from-green-500 to-emerald-500',
      description: 'Spin the wheel! Get roasts, compliments, dares, rewards!'
    },
    {
      id: 'future',
      name: 'AI Predicts Your Future',
      emoji: '🔮',
      color: 'from-indigo-500 to-purple-500',
      description: 'AI predicts your future... badly but hilariously!'
    },
    {
      id: 'tap',
      name: '5-Second Tap Game',
      emoji: '👆',
      color: 'from-red-500 to-pink-500',
      description: 'Tap as fast as you can in 5 seconds!'
    },
    {
      id: 'runaway',
      name: 'Button That Runs Away',
      emoji: '🏃',
      color: 'from-orange-500 to-red-500',
      description: 'Catch the button before it runs away!'
    },
    {
      id: 'dare',
      name: 'Dare Machine',
      emoji: '😈',
      color: 'from-pink-500 to-rose-500',
      description: 'Get random funny dares from AI!'
    },
    {
      id: 'roast',
      name: 'Roast Me',
      emoji: '🔥',
      color: 'from-red-500 to-orange-500',
      description: 'Ask AI to roast you (funny, not mean)!'
    },
    {
      id: 'chaos',
      name: 'Room Chaos Mode',
      emoji: '🌪️',
      color: 'from-gray-500 to-slate-500',
      description: 'Join random rooms! AI sends polls, tasks, debates!'
    }
  ]

  const handleGameClick = (gameId) => {
    triggerConfettiBurst()
    // Map game IDs to routes
    const routes = {
      bakchodi: '/games/bakchodi',
      debate: '/games/debate',
      meme: '/games/meme',
      wheel: '/games/wheel',
      future: '/games/future',
      tap: '/games/tap',
      runaway: '/games/runaway',
      dare: '/games/dare',
      roast: '/games/roast',
      chaos: '/games/chaos'
    }
    navigate(routes[gameId] || '/games')
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${randomColor} via-pink-500 to-purple-600 p-6`}>
      {showPopup && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-white bg-opacity-95 rounded-2xl p-4 shadow-2xl border-4 border-yellow-400">
            <p className="text-xl font-black text-gray-800">{popupMessage}</p>
          </div>
        </div>
      )}

      <header className="max-w-7xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <FloatingButton
            onClick={() => navigate('/dashboard')}
            className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
          >
            ← Back
          </FloatingButton>
          <h1 className="text-4xl md:text-5xl font-black text-white drop-shadow-2xl animate-pulse-crazy">
            🎮 Faltu Games
          </h1>
          <div></div>
        </div>
        <p className="text-center text-white text-xl mt-4 font-bold">
          Pure Entertainment, Zero Logic! 🎉
        </p>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <div
              key={game.id}
              onClick={() => handleGameClick(game.id)}
              className={`
                bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl
                transform hover:scale-105 transition-all duration-300
                cursor-pointer animate-float
                border-4 border-transparent hover:border-yellow-400
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`text-6xl mb-4 animate-bounce`}>
                {game.emoji}
              </div>
              <h3 className="text-2xl font-black mb-2 text-gray-800">
                {game.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {game.description}
              </p>
              <div className={`bg-gradient-to-r ${game.color} text-white px-6 py-3 rounded-full text-center font-bold text-lg transform hover:scale-110 transition-transform`}>
                Play Now! 🚀
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Games

