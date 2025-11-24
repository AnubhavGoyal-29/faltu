import { useState, useEffect } from 'react'
import { useRandomStyle } from '../hooks/useRandomStyle'

const JokeCard = ({ joke, loading = false }) => {
  const [bounce, setBounce] = useState(false)
  const randomStyle = useRandomStyle(3000)

  useEffect(() => {
    if (joke) {
      setBounce(true)
      setTimeout(() => setBounce(false), 1000)
    }
  }, [joke])

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-2xl animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-full"></div>
      </div>
    )
  }

  if (!joke) return null

  return (
    <div
      className={`
        bg-gradient-to-br rounded-3xl p-8 shadow-2xl
        transition-all duration-500
        ${bounce ? 'animate-bounce-silly' : ''}
      `}
      style={{
        background: `linear-gradient(135deg, ${randomStyle.backgroundColor} 0%, ${getRandomColor()} 100%)`,
        transform: `rotate(${randomStyle.transform}) scale(${randomStyle.scale})`,
      }}
    >
      <div className="text-center">
        <span className="text-4xl mb-4 block">😂</span>
        <p className="text-white text-xl font-bold leading-relaxed">
          {joke}
        </p>
      </div>
    </div>
  )
}

const getRandomColor = () => {
  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b',
    '#eb4d4b', '#6c5ce7', '#a29bfe', '#fd79a8', '#00b894'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

export default JokeCard

