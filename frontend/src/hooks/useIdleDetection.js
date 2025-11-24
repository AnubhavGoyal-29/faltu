import { useState, useEffect, useRef } from 'react'

export const useIdleDetection = (idleTime = 15000, onIdle) => {
  const [isIdle, setIsIdle] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    
    const resetTimer = () => {
      setIsIdle(false)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      
      timerRef.current = setTimeout(() => {
        setIsIdle(true)
        if (onIdle) {
          onIdle()
        }
      }, idleTime)
    }

    // Set initial timer
    resetTimer()

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, resetTimer, true)
    })

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      events.forEach(event => {
        window.removeEventListener(event, resetTimer, true)
      })
    }
  }, [idleTime, onIdle])

  return isIdle
}

