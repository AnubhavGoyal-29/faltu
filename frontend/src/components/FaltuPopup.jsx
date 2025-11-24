import { useState, useEffect } from 'react'
import { getRandomTransform } from '../hooks/useRandomStyle'

const bakchodMessages = [
  "Bhai kidhar so gaya?",
  "Chal kuch faltu karte hain",
  "Suna, chal game khelte hain",
  "Yaha kya dekh rha hai? Message bhej",
  "Faltu fun is waiting...",
  "Kuch interesting nahi lag raha?",
  "Chaos trigger kar, maza aayega!",
  "Bhai kya mast joke mara",
  "Kisi ko tag kar ke bhag",
  "Aur kya chal raha hai?",
  "Boring lag raha hai? Try chaos!",
  "Points kamane ka time hai!",
  "Random chat join kar le",
  "Joke sun, hasi aayegi"
]

const getRandomMessage = () => bakchodMessages[Math.floor(Math.random() * bakchodMessages.length)]

const FaltuPopup = ({ message, onClose, type = 'info' }) => {
  const [transform, setTransform] = useState(getRandomTransform())
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    const interval = setInterval(() => {
      setTransform(getRandomTransform())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => {
      if (onClose) onClose()
    }, 300)
  }

  const typeStyles = {
    info: 'bg-blue-500 border-blue-300',
    warning: 'bg-yellow-500 border-yellow-300',
    success: 'bg-green-500 border-green-300',
    chaos: 'bg-red-500 border-red-300 animate-pulse-crazy'
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`
          relative bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl
          animate-bounce-silly
          ${typeStyles[type] || typeStyles.info}
          transition-transform duration-300
        `}
        style={{ transform }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-white text-2xl font-bold hover:scale-125 transition-transform"
        >
          ×
        </button>
        <div className="text-center">
          <p className="text-white text-xl font-bold mb-4">
            {message || getRandomMessage()}
          </p>
          <button
            onClick={handleClose}
            className="mt-4 px-6 py-2 bg-white text-gray-800 rounded-full font-bold hover:scale-110 transition-transform"
          >
            Theek Hai! 👍
          </button>
        </div>
      </div>
    </div>
  )
}

export default FaltuPopup
export { getRandomMessage }

