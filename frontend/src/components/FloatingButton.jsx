import { useState, useEffect } from 'react'
import { useRandomPosition } from '../hooks/useRandomStyle'

const FloatingButton = ({ children, onClick, className = '', disabled = false, chaos = false }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [randomAnim, setRandomAnim] = useState('')
  const position = useRandomPosition()

  useEffect(() => {
    if (chaos) {
      const anims = ['animate-wiggle', 'animate-bounce-silly', 'animate-float', 'animate-pulse-crazy']
      const interval = setInterval(() => {
        setRandomAnim(anims[Math.floor(Math.random() * anims.length)])
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [chaos])

  const baseClasses = `
    relative px-6 py-4 rounded-2xl font-bold text-lg
    transition-all duration-300 transform
    ${chaos ? randomAnim : ''}
    ${isHovered ? 'scale-110 shadow-2xl' : 'scale-100'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={baseClasses}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) ${chaos ? getRandomTransform() : ''}`,
      }}
    >
      {children}
      {isHovered && !disabled && (
        <span className="absolute inset-0 rounded-2xl bg-white opacity-20 animate-pulse"></span>
      )}
    </button>
  )
}

const getRandomTransform = () => {
  const transforms = ['rotate(5deg)', 'rotate(-5deg)', 'scale(1.1)', 'scale(0.9)']
  return transforms[Math.floor(Math.random() * transforms.length)]
}

export default FloatingButton

