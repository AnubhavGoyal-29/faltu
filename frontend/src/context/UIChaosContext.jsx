import { createContext, useContext, useState, useEffect } from 'react'

const UIChaosContext = createContext()

export const useUIChaos = () => {
  const context = useContext(UIChaosContext)
  if (!context) {
    throw new Error('useUIChaos must be used within UIChaosProvider')
  }
  return context
}

export const UIChaosProvider = ({ children }) => {
  const [discoMode, setDiscoMode] = useState(false)
  const [randomTheme, setRandomTheme] = useState(null)
  const [themeChangeInterval, setThemeChangeInterval] = useState(null)

  // Random theme changing every 10-20 seconds
  useEffect(() => {
    const changeTheme = () => {
      const themes = [
        'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500',
        'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500',
        'bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500',
        'bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500',
        'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
        'bg-gradient-to-br from-red-500 via-pink-500 to-purple-500',
      ]
      setRandomTheme(themes[Math.floor(Math.random() * themes.length)])
    }

    // Initial theme
    changeTheme()

    // Change theme every 10-20 seconds
    const interval = setInterval(() => {
      changeTheme()
    }, 10000 + Math.random() * 10000)

    setThemeChangeInterval(interval)

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [])

  const triggerDiscoMode = (duration = 5000) => {
    setDiscoMode(true)
    setTimeout(() => {
      setDiscoMode(false)
    }, duration)
  }

  const value = {
    discoMode,
    randomTheme,
    triggerDiscoMode,
  }

  return <UIChaosContext.Provider value={value}>{children}</UIChaosContext.Provider>
}

