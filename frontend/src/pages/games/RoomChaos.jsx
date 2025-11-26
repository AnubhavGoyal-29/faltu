import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useChaos } from '../../context/ChaosContext'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const RoomChaos = () => {
  const { user } = useAuth()
  const { triggerChaos, chaosActive } = useChaos()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [points, setPoints] = useState(0)
  const [recentEvents, setRecentEvents] = useState([])

  useEffect(() => {
    fetchUserPoints()
    fetchRecentEvents()
  }, [])

  const fetchUserPoints = async () => {
    try {
      const response = await api.get('/users/profile')
      if (response.data?.points) {
        setPoints(response.data.points.total_points || 0)
      }
    } catch (error) {
      console.error('Failed to fetch points:', error)
    }
  }

  const fetchRecentEvents = async () => {
    try {
      const response = await api.get('/chaos/recent')
      if (response.data.success) {
        setRecentEvents(response.data.events || [])
      }
    } catch (error) {
      console.error('Failed to fetch events:', error)
    }
  }

  const handleTriggerChaos = async () => {
    if (points < 1000) {
      alert('Chaos trigger karne ke liye kam se kam 1000 points chahiye!')
      return
    }

    if (chaosActive) {
      alert('Chaos already active hai! Thoda wait karo!')
      return
    }

    setLoading(true)
    try {
      triggerConfettiBurst()
      await triggerChaos()
      await fetchUserPoints()
      await fetchRecentEvents()
      alert('Chaos triggered! 🌪️')
    } catch (error) {
      console.error('Trigger chaos error:', error)
      alert(error.response?.data?.error || 'Chaos trigger nahi hua!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-500 via-slate-500 to-zinc-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <FloatingButton
            onClick={() => navigate('/games')}
            className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
          >
            ← Back
          </FloatingButton>
          <h1 className="text-4xl font-black text-white drop-shadow-2xl">
            🌪️ Room Chaos Mode
          </h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        {/* Info Card */}
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">🌪️</div>
            <h2 className="text-3xl font-black text-gray-800 mb-4">
              Trigger Room Chaos!
            </h2>
            <p className="text-xl text-gray-600 mb-2">
              Cause random chaos events across the entire app!
            </p>
            <p className="text-lg text-gray-500">
              Cost: <span className="font-bold text-red-600">1000 points</span>
            </p>
          </div>

          {/* Points Display */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 mb-6 text-center">
            <p className="text-white text-lg mb-2">Your Points:</p>
            <p className="text-5xl font-black text-white">{points}</p>
          </div>

          {/* Trigger Button */}
          <FloatingButton
            onClick={handleTriggerChaos}
            disabled={loading || chaosActive || points < 1000}
            className={`w-full py-6 text-2xl font-black ${
              points < 1000
                ? 'bg-gray-400 cursor-not-allowed'
                : chaosActive
                ? 'bg-yellow-500'
                : 'bg-gradient-to-r from-red-600 to-orange-600'
            } text-white`}
          >
            {loading ? 'Triggering...' : chaosActive ? 'CHAOS ACTIVE! 🔥' : points < 1000 ? 'Not Enough Points! 💰' : 'TRIGGER CHAOS! 🌪️'}
          </FloatingButton>

          {points < 1000 && (
            <p className="text-center text-gray-600 mt-4">
              You need {1000 - points} more points to trigger chaos!
            </p>
          )}
        </div>

        {/* Recent Events */}
        {recentEvents.length > 0 && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-2xl font-black text-gray-800 mb-4">
              Recent Chaos Events 🌪️
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 rounded-lg p-4 border-l-4 border-red-500"
                >
                  <p className="text-gray-800 font-bold">{event.event_type}</p>
                  {event.event_data?.content && (
                    <p className="text-gray-600 text-sm mt-1">
                      {event.event_data.content}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(event.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
          <h3 className="text-xl font-black text-gray-800 mb-4">
            What is Room Chaos? 🤔
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li>• 🌪️ Random events happen across the app</li>
            <li>• 💥 Breaking news, confetti, screen shake, and more!</li>
            <li>• 🎉 All users see the chaos simultaneously</li>
            <li>• 🎁 Earn 25 points when you trigger chaos</li>
            <li>• ⏱️ Chaos events last for a few seconds</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default RoomChaos


