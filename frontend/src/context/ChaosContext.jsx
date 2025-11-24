import { createContext, useContext, useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import api from '../api/axios'
import { useAuth } from './AuthContext'
import { triggerConfetti, triggerConfettiBurst, triggerConfettiRain } from '../utils/confettiBlast'

const ChaosContext = createContext()

export const useChaos = () => {
  const context = useContext(ChaosContext)
  if (!context) {
    throw new Error('useChaos must be used within a ChaosProvider')
  }
  return context
}

export const ChaosProvider = ({ children }) => {
  const [chaosActive, setChaosActive] = useState(false)
  const [chaosType, setChaosType] = useState(null)
  const [chaosData, setChaosData] = useState(null)
  const { token } = useAuth()
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (token) {
      // Connect to socket for chaos events
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: { token }
      })

      newSocket.on('chaos_event', (data) => {
        triggerChaosEffect(data.event_type, data.event_data)
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    }
  }, [token])

  const triggerChaosEffect = (type, data) => {
    setChaosActive(true)
    setChaosType(type)
    setChaosData(data)

    switch (type) {
      case 'confetti':
        triggerConfettiBurst()
        setTimeout(() => setChaosActive(false), data.duration || 3000)
        break

      case 'breaking_news':
        // Show breaking news popup
        setTimeout(() => setChaosActive(false), 5000)
        break

      case 'upside_down':
        document.body.classList.add('chaos-upside-down')
        setTimeout(() => {
          document.body.classList.remove('chaos-upside-down')
          setChaosActive(false)
        }, data.duration || 2000)
        break

      case 'shake':
        document.body.classList.add('chaos-shake')
        setTimeout(() => {
          document.body.classList.remove('chaos-shake')
          setChaosActive(false)
        }, 500)
        break

      case 'color_invert':
        document.body.classList.add('chaos-color-invert')
        setTimeout(() => {
          document.body.classList.remove('chaos-color-invert')
          setChaosActive(false)
        }, data.duration || 2000)
        break

      case 'rainbow':
        document.body.classList.add('chaos-rainbow')
        setTimeout(() => {
          document.body.classList.remove('chaos-rainbow')
          setChaosActive(false)
        }, data.duration || 2000)
        break

      case 'sound':
        // Play a random sound (browser beep)
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.frequency.value = 200 + Math.random() * 400
        oscillator.type = 'sine'

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)

        setTimeout(() => setChaosActive(false), 1000)
        break

      default:
        setTimeout(() => setChaosActive(false), 2000)
    }
  }

  const triggerChaos = async () => {
    try {
      const response = await api.post('/chaos/trigger')
      // The backend will broadcast the event to all clients via socket
      // We trigger the effect locally for the user who triggered it
      triggerChaosEffect(response.data.event.event_type, response.data.event.event_data)
    } catch (error) {
      console.error('Failed to trigger chaos:', error)
      alert('Failed to trigger chaos event')
    }
  }

  const value = {
    chaosActive,
    chaosType,
    chaosData,
    triggerChaos
  }

  return <ChaosContext.Provider value={value}>{children}</ChaosContext.Provider>
}

