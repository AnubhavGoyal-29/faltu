import { useState, useEffect } from 'react'

const colors = [
  '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b',
  '#eb4d4b', '#6c5ce7', '#a29bfe', '#fd79a8', '#00b894',
  '#00cec9', '#55efc4', '#81ecec', '#74b9ff', '#0984e3'
]

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]

export const useRandomStyle = (updateInterval = 5000) => {
  const [style, setStyle] = useState({
    backgroundColor: getRandomColor(),
    color: '#ffffff',
    transform: 'rotate(0deg)',
    scale: 1
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStyle({
        backgroundColor: getRandomColor(),
        color: Math.random() > 0.5 ? '#ffffff' : '#000000',
        transform: `rotate(${Math.random() * 10 - 5}deg)`,
        scale: 0.95 + Math.random() * 0.1
      })
    }, updateInterval)

    return () => clearInterval(interval)
  }, [updateInterval])

  return style
}

export const useRandomPosition = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to move
        setPosition({
          x: (Math.random() - 0.5) * 20,
          y: (Math.random() - 0.5) * 20
        })
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return position
}

export const getRandomTransform = () => {
  const transforms = [
    'rotate(5deg)',
    'rotate(-5deg)',
    'scale(1.05)',
    'scale(0.95)',
    'skewX(5deg)',
    'skewY(5deg)',
    'translateX(5px)',
    'translateY(5px)',
  ]
  return transforms[Math.floor(Math.random() * transforms.length)]
}

