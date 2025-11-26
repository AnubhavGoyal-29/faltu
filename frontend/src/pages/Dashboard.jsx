import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useChaos } from '../context/ChaosContext'
import { useUIChaos } from '../context/UIChaosContext'
import { useIdleDetection } from '../hooks/useIdleDetection'
import api from '../api/axios'
import FloatingButton from '../components/FloatingButton'
import FaltuPopup, { getRandomMessage } from '../components/FaltuPopup'
import DiscoMode from '../components/DiscoMode'
import LuckyDrawTimer from '../components/LuckyDrawTimer'
import { triggerConfettiBurst } from '../utils/confettiBlast'

const stupidQuotes = [
  "Life is too short to be serious all the time!",
  "Chaos is just order waiting to be discovered!",
  "Why be normal when you can be chaotic?",
  "Randomness is the spice of life!",
  "In chaos, we find freedom!",
  "Being pointless is the point!",
  "Faltu fun is the best fun!",
  "Embrace the randomness!",
]

const Dashboard = () => {
  const { user, logout, fetchProfile } = useAuth()
  const { triggerChaos, chaosActive } = useChaos()
  const { discoMode, randomTheme, triggerDiscoMode } = useUIChaos()
  const navigate = useNavigate()
  const [points, setPoints] = useState(0)
  const [loginStreak, setLoginStreak] = useState(0)
  const [lastDraw, setLastDraw] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState('')
  const [currentQuote, setCurrentQuote] = useState(stupidQuotes[0])
  const [buttonWiggle, setButtonWiggle] = useState(false)

  const isIdle = useIdleDetection(15000, async () => {
    // Try to get AI-generated engagement, fallback to random message
    try {
      // Could call API here if endpoint exists
      // const aiEngagement = await getAIIdleEngagement()
      // if (aiEngagement && aiEngagement.content) {
      //   setPopupMessage(aiEngagement.content)
      // } else {
        setPopupMessage(getRandomMessage())
      // }
    } catch (error) {
      setPopupMessage(getRandomMessage())
    }
    setShowPopup(true)
  })

  // Define callbacks BEFORE useEffect that uses them
  const fetchDashboardData = useCallback(async () => {
    try {
      const profileResponse = await api.get('/users/profile')
      if (profileResponse.data?.points) {
        setPoints(profileResponse.data.points.total_points || 0)
        setLoginStreak(profileResponse.data.points.login_streak || 0)
      }

      try {
        const drawResponse = await api.get('/lucky-draws/last')
        // Only set if draw exists and has winner
        if (drawResponse.data && drawResponse.data.winner) {
          setLastDraw(drawResponse.data)
        } else {
          setLastDraw(null)
        }
      } catch (drawError) {
        // No lucky draw yet, that's okay
        console.log('No lucky draw data available')
        setLastDraw(null)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Don't reset to 0 on error - keep previous values
      // Only set defaults if this is first load
      if (points === 0 && loginStreak === 0) {
        setPoints(0)
        setLoginStreak(0)
      }
      setLastDraw(null)
    }
  }, [points, loginStreak])

  const checkRushActivities = useCallback(async () => {
    try {
      console.log('🎯 [DASHBOARD] Checking for rush activities...')
      const response = await api.get('/rush/available')
      console.log('🎯 [DASHBOARD] Rush available response:', response.data)
      
      if (response.data.success && response.data.has_available) {
        console.log('🎯 [DASHBOARD] Rush activities available! Redirecting...')
        // Redirect to rush activity
        navigate('/rush', { replace: true })
      } else {
        console.log('🎯 [DASHBOARD] No rush activities available, showing dashboard')
      }
    } catch (error) {
      console.error('🎯 [DASHBOARD] Failed to check rush activities:', error)
      // Continue showing dashboard if check fails
    }
  }, [navigate])

  useEffect(() => {
    // Only fetch if user is loaded
    if (user) {
      fetchDashboardData()
      checkRushActivities()
    }
  }, [user, fetchDashboardData, checkRushActivities]) // Include stable callbacks

  // Separate effect for UI animations to prevent re-fetching on quote changes
  useEffect(() => {
    // Rotate quotes
    const quoteInterval = setInterval(() => {
      setCurrentQuote(stupidQuotes[Math.floor(Math.random() * stupidQuotes.length)])
    }, 5000)

    // Random button wiggle
    const wiggleInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setButtonWiggle(true)
        setTimeout(() => setButtonWiggle(false), 1000)
      }
    }, 8000)

    return () => {
      clearInterval(quoteInterval)
      clearInterval(wiggleInterval)
    }
  }, []) // Empty deps - only run once on mount

  const handleTriggerChaos = useCallback(async () => {
    triggerConfettiBurst()
    triggerDiscoMode(3000)
    setButtonWiggle(true)
    setTimeout(() => setButtonWiggle(false), 2000)
    
    await triggerChaos()
    setTimeout(() => {
      fetchDashboardData()
    }, 1000)
  }, [triggerChaos, fetchDashboardData])

  // Show loading if user not loaded yet
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-500 to-red-500">
        <div className="text-white text-2xl font-bold animate-pulse">Loading...</div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${randomTheme || 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500'}`}>
      <DiscoMode active={discoMode} />
      
      {/* Lucky Draw Timer - Top Right */}
      <LuckyDrawTimer />
      
      {showPopup && (
        <FaltuPopup
          message={popupMessage}
          onClose={() => setShowPopup(false)}
          type="info"
        />
      )}

      <header className="bg-white bg-opacity-20 backdrop-blur-md p-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-black text-white drop-shadow-lg animate-pulse-crazy">
            🎉 FaltuVerse Dashboard
          </h1>
          <div className="flex items-center gap-4">
            {user?.profile_photo && (
              <img 
                src={user.profile_photo} 
                alt={user?.name || 'User'} 
                className="w-12 h-12 rounded-full border-4 border-white shadow-lg animate-float"
              />
            )}
            <span className="text-white font-bold text-lg">{user?.name || 'User'}</span>
            <button 
              onClick={logout} 
              className="px-4 py-2 bg-white bg-opacity-30 rounded-full text-white font-bold hover:bg-opacity-50 transition-all animate-wiggle"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform animate-float">
            <h3 className="text-gray-600 text-lg mb-2">Total Points</h3>
            <p className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {points}
            </p>
          </div>
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform animate-float" style={{ animationDelay: '0.5s' }}>
            <h3 className="text-gray-600 text-lg mb-2">Login Streak</h3>
            <p className="text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {loginStreak} 🔥
            </p>
          </div>
        </div>

        {/* Rotating Quote */}
        <div className="bg-white bg-opacity-80 rounded-3xl p-6 text-center shadow-xl animate-pulse-crazy">
          <p className="text-2xl font-bold text-gray-800 italic">
            "{currentQuote}"
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
            <h3 className="text-2xl font-black mb-4 text-gray-800">💬 Random Chat</h3>
            <p className="text-gray-600 mb-4">Join a random chat room and talk nonsense!</p>
            <FloatingButton
              onClick={() => navigate('/chat')}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
            >
              Go to Chat 🚀
            </FloatingButton>
          </div>

          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
            <h3 className="text-2xl font-black mb-4 text-gray-800">💥 Trigger Chaos</h3>
            <p className="text-gray-600 mb-4">Cause random chaos events across the app!</p>
            <FloatingButton
              onClick={handleTriggerChaos}
              disabled={chaosActive}
              chaos={true}
              className={`w-full bg-gradient-to-r from-red-500 to-pink-500 text-white ${buttonWiggle ? 'animate-wiggle' : ''}`}
            >
              {chaosActive ? 'CHAOS ACTIVE! 🔥' : 'PRESS FOR SOMETHING POINTLESS 💥'}
            </FloatingButton>
          </div>

          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
            <h3 className="text-2xl font-black mb-4 text-gray-800">😂 Random Joke</h3>
            <p className="text-gray-600 mb-4">Get a random AI-generated nonsense joke!</p>
            <FloatingButton
              onClick={() => navigate('/jokes')}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
            >
              Get Joke 🎭
            </FloatingButton>
          </div>

          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
            <h3 className="text-2xl font-black mb-4 text-gray-800">🎯 Wordle Game</h3>
            <p className="text-gray-600 mb-4">Daily Hinglish wordle game! 5 letters ka word guess karo!</p>
            <FloatingButton
              onClick={() => navigate('/wordle')}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white"
            >
              Play Wordle 🎯
            </FloatingButton>
          </div>
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
            <h3 className="text-2xl font-black mb-4 text-gray-800">🎲 Tambola Game</h3>
            <p className="text-gray-600 mb-4">Har 5 minute mein naya game! Register karo aur jeeto!</p>
            <FloatingButton
              onClick={() => navigate('/tambola')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white"
            >
              Play Tambola 🎲
            </FloatingButton>
          </div>
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform">
            <h3 className="text-2xl font-black mb-4 text-gray-800">🎮 Faltu Games</h3>
            <p className="text-gray-600 mb-4">10+ micro-games! Bakchodi, memes, debates, and more chaos!</p>
            <FloatingButton
              onClick={() => navigate('/games')}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
            >
              Play Games 🎮
            </FloatingButton>
          </div>
          
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-6 shadow-2xl transform hover:scale-105 transition-transform animate-pulse-crazy">
            <h3 className="text-2xl font-black mb-4 text-white">⚡ Start Rush</h3>
            <p className="text-white mb-4 opacity-90">Complete all unvisited activities one by one!</p>
            <FloatingButton
              onClick={() => navigate('/rush')}
              className="w-full bg-white text-red-600 font-black"
            >
              🚀 Start Rush Now!
            </FloatingButton>
          </div>
        </div>

        {/* Last Lucky Draw */}
        {lastDraw && lastDraw.winner && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl animate-bounce-silly">
            <h3 className="text-2xl font-black mb-4 text-gray-800">🎰 Last Lucky Draw Winner</h3>
            <div className="flex items-center gap-4">
              {lastDraw.winner?.profile_photo && (
                <img 
                  src={lastDraw.winner.profile_photo} 
                  alt={lastDraw.winner?.name || 'Winner'} 
                  className="w-16 h-16 rounded-full border-4 border-yellow-400 shadow-lg animate-float"
                />
              )}
              <div>
                <p className="text-xl font-bold text-gray-800">{lastDraw.winner?.name || 'Unknown'}</p>
                <p className="text-lg text-yellow-600 font-bold">Won {lastDraw.reward_points || 0} points! 🎉</p>
                <p className="text-sm text-gray-500">
                  {lastDraw.timestamp ? new Date(lastDraw.timestamp).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard
