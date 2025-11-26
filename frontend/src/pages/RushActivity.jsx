import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import FloatingButton from '../components/FloatingButton'
import { triggerConfettiBurst } from '../utils/confettiBlast'

// Import all activity components
import BakchodiChallenge from './games/BakchodiChallenge'
import Wordle from './Wordle'
import Debate from './games/Debate'
import MemeBattle from './games/MemeBattle'
import WheelSpin from './games/WheelSpin'
import FuturePrediction from './games/FuturePrediction'
import TapGame from './games/TapGame'
import RunawayButton from './games/RunawayButton'
import DareMachine from './games/DareMachine'
import RoastMe from './games/RoastMe'

const ACTIVITY_COMPONENTS = {
  bakchodi: BakchodiChallenge,
  wordle: Wordle,
  debate: Debate,
  meme: MemeBattle,
  wheel: WheelSpin,
  future: FuturePrediction,
  tap: TapGame,
  runaway: RunawayButton,
  dare: DareMachine,
  roast: RoastMe
}

const RushActivity = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { activityType } = useParams()
  const [loading, setLoading] = useState(true)
  const [activityData, setActivityData] = useState(null)
  const [showSkipButton, setShowSkipButton] = useState(true)

  useEffect(() => {
    if (!activityType) {
      // If no activity type, get next rush activity
      fetchNextActivity()
    }
    // If activityType exists, component will render it directly
  }, [activityType])

  const fetchNextActivity = async () => {
    try {
      setLoading(true)
      console.log('🎯 [RUSH] Fetching next activity...')
      const response = await api.get('/rush/next')
      console.log('🎯 [RUSH] Next activity response:', response.data)
      
      if (response.data.success && response.data.has_activity) {
        const activity = response.data.activity
        console.log('🎯 [RUSH] Next activity:', activity.type, activity.name)
        // Navigate to the activity route
        navigate(`/rush/${activity.type}`, { replace: true })
      } else {
        console.log('🎯 [RUSH] No more activities available, going to dashboard')
        // No more activities, go to dashboard
        navigate('/dashboard', { replace: true })
      }
    } catch (error) {
      console.error('🎯 [RUSH] Failed to fetch next activity:', error)
      navigate('/dashboard', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  // When activityType is provided, just mark it as visited and render
  useEffect(() => {
    if (activityType && ACTIVITY_COMPONENTS[activityType]) {
      // Mark activity as visited when component loads
      api.post('/rush/complete', {
        activity_type: activityType,
        status: 'seen'
      }).catch(err => console.error('Failed to mark as seen:', err))
      
      setLoading(false)
    }
  }, [activityType])

  const handleSkip = async () => {
    try {
      await api.post('/rush/complete', {
        activity_type: activityType,
        status: 'skipped'
      })
      
      // Move to next activity
      fetchNextActivity()
    } catch (error) {
      console.error('Failed to skip activity:', error)
    }
  }

  const handleComplete = async () => {
    try {
      await api.post('/rush/complete', {
        activity_type: activityType,
        status: 'completed'
      })
      
      triggerConfettiBurst()
      
      // Move to next activity after a short delay
      setTimeout(() => {
        fetchNextActivity()
      }, 1500)
    } catch (error) {
      console.error('Failed to complete activity:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-spin">🎯</div>
          <p className="text-2xl font-bold">Rush activity load ho rahi hai...</p>
        </div>
      </div>
    )
  }

  if (!activityType || !ACTIVITY_COMPONENTS[activityType]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-2xl font-bold mb-4">Activity nahi mili!</p>
          <FloatingButton
            onClick={() => navigate('/dashboard')}
            className="bg-white text-purple-600"
          >
            Dashboard pe jao
          </FloatingButton>
        </div>
      </div>
    )
  }

  const ActivityComponent = ACTIVITY_COMPONENTS[activityType]

  return (
    <div className="relative">
      {/* Skip button - fixed top right */}
      {showSkipButton && (
        <div className="fixed top-4 right-4 z-50">
          <FloatingButton
            onClick={handleSkip}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            ⏭️ Skip
          </FloatingButton>
        </div>
      )}

      {/* Activity Component with completion handler */}
      <ActivityComponentWrapper
        Component={ActivityComponent}
        onComplete={handleComplete}
        onSkip={() => setShowSkipButton(false)}
      />
    </div>
  )
}

// Wrapper component to inject completion handler
const ActivityComponentWrapper = ({ Component, onComplete, onSkip }) => {
  // This will be enhanced to detect when activity is completed
  // For now, activities will call onComplete manually if needed
  return <Component />
}

export default RushActivity

