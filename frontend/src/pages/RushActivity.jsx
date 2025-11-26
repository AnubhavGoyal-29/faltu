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
// Missing 29 games
import GyaanShot from './games/GyaanShot'
import BakwaasMeter from './games/BakwaasMeter'
import EmojiFight from './games/EmojiFight'
import MoodSwitch from './games/MoodSwitch'
import NonsensePoetry from './games/NonsensePoetry'
import AukaatCheck from './games/AukaatCheck'
import JhandChallenge from './games/JhandChallenge'
import DesiSpeedTap from './games/DesiSpeedTap'
import CringeMeter from './games/CringeMeter'
import VibeCheck from './games/VibeCheck'
import RandomFact from './games/RandomFact'
import TimeBomb from './games/TimeBomb'
import ChaosButton from './games/ChaosButton'
import MemeGenerator from './games/MemeGenerator'
import DesiRoast from './games/DesiRoast'
import LuckDraw from './games/LuckDraw'
import ReactionTest from './games/ReactionTest'
import NonsenseGenerator from './games/NonsenseGenerator'
import MoodRing from './games/MoodRing'
import BakchodiMeter from './games/BakchodiMeter'
import RandomDare from './games/RandomDare'
import SpeedTyping from './games/SpeedTyping'
import EmojiStory from './games/EmojiStory'
import VibeMeter from './games/VibeMeter'
import RandomCompliment from './games/RandomCompliment'
import PressureCooker from './games/PressureCooker'
import NonsenseQuiz from './games/NonsenseQuiz'
import DesiChallenge from './games/DesiChallenge'
import RandomRoast from './games/RandomRoast'
// Import missing games from NEW 30 GAMES
import GyaanGuru from './games/GyaanGuru'
import BakwaasBattle from './games/BakwaasBattle'
import EmojiMashup from './games/EmojiMashup'
import MoodSwinger from './games/MoodSwinger'
import PoetryChaos from './games/PoetryChaos'
import AukaatMeter from './games/AukaatMeter'
import JhandMeter from './games/JhandMeter'
import DesiSpeedRush from './games/DesiSpeedRush'
import CringeLevel from './games/CringeLevel'
import VibeDetector from './games/VibeDetector'
import UselessFact from './games/UselessFact'
import BombTimer from './games/BombTimer'
import ChaosGenerator from './games/ChaosGenerator'
import MemeMaster from './games/MemeMaster'
import DesiBurn from './games/DesiBurn'
import LuckyChaos from './games/LuckyChaos'
import ReflexMaster from './games/ReflexMaster'
import NonsenseFactory from './games/NonsenseFactory'
import MoodReader from './games/MoodReader'
import BakchodiLevel from './games/BakchodiLevel'
import DareMaster from './games/DareMaster'
import TypingChaos from './games/TypingChaos'
import EmojiTale from './games/EmojiTale'
import VibeScanner from './games/VibeScanner'
import ComplimentChaos from './games/ComplimentChaos'
import PressureTest from './games/PressureTest'
import QuizChaos from './games/QuizChaos'
import ChaosSurvival from './games/ChaosSurvival'
import DesiMaster from './games/DesiMaster'

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
  roast: RoastMe,
  // Missing 29 games (camelCase keys to match backend)
  gyaanShot: GyaanShot,
  bakwaasMeter: BakwaasMeter,
  emojiFight: EmojiFight,
  moodSwitch: MoodSwitch,
  nonsensePoetry: NonsensePoetry,
  aukaatCheck: AukaatCheck,
  jhandChallenge: JhandChallenge,
  desiSpeedTap: DesiSpeedTap,
  cringeMeter: CringeMeter,
  vibeCheck: VibeCheck,
  randomFact: RandomFact,
  timeBomb: TimeBomb,
  chaosButton: ChaosButton,
  memeGenerator: MemeGenerator,
  desiRoast: DesiRoast,
  luckDraw: LuckDraw,
  reactionTest: ReactionTest,
  nonsenseGenerator: NonsenseGenerator,
  moodRing: MoodRing,
  bakchodiMeter: BakchodiMeter,
  randomDare: RandomDare,
  speedTyping: SpeedTyping,
  emojiStory: EmojiStory,
  vibeMeter: VibeMeter,
  randomCompliment: RandomCompliment,
  pressureCooker: PressureCooker,
  nonsenseQuiz: NonsenseQuiz,
  desiChallenge: DesiChallenge,
  randomRoast: RandomRoast,
  // NEW 30 GAMES (camelCase keys to match backend)
  gyaanGuru: GyaanGuru,
  bakwaasBattle: BakwaasBattle,
  emojiMashup: EmojiMashup,
  moodSwinger: MoodSwinger,
  poetryChaos: PoetryChaos,
  aukaatMeter: AukaatMeter,
  jhandMeter: JhandMeter,
  desiSpeedRush: DesiSpeedRush,
  cringeLevel: CringeLevel,
  vibeDetector: VibeDetector,
  uselessFact: UselessFact,
  bombTimer: BombTimer,
  chaosGenerator: ChaosGenerator,
  memeMaster: MemeMaster,
  desiBurn: DesiBurn,
  luckyChaos: LuckyChaos,
  reflexMaster: ReflexMaster,
  nonsenseFactory: NonsenseFactory,
  moodReader: MoodReader,
  bakchodiLevel: BakchodiLevel,
  dareMaster: DareMaster,
  typingChaos: TypingChaos,
  emojiTale: EmojiTale,
  vibeScanner: VibeScanner,
  complimentChaos: ComplimentChaos,
  pressureTest: PressureTest,
  quizChaos: QuizChaos,
  chaosSurvival: ChaosSurvival,
  desiMaster: DesiMaster
}

const RushActivity = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { activityType } = useParams()
  // Set initial loading based on whether activityType exists
  const [loading, setLoading] = useState(!activityType || !ACTIVITY_COMPONENTS[activityType])
  const [activityData, setActivityData] = useState(null)
  const [showSkipButton, setShowSkipButton] = useState(true)
  const [activityStatus, setActivityStatus] = useState(null) // 'completed', 'skipped', or null
  const [rushStats, setRushStats] = useState(null) // { completed_count, total_activities, progress }

  // Fetch rush stats
  const fetchRushStats = async () => {
    try {
      const response = await api.get('/rush/stats')
      if (response.data.success) {
        setRushStats(response.data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch rush stats:', error)
    }
  }

  // Check activity status
  const checkActivityStatus = async () => {
    if (!activityType) return
    try {
      // We'll check if activity is completed by checking stats
      // For now, we'll check when component loads
      const response = await api.get('/rush/stats')
      if (response.data.success) {
        // We need to check if this specific activity is completed
        // For simplicity, we'll assume it's not completed initially
        // The status will be updated when user completes/skips
        setActivityStatus(null)
      }
    } catch (error) {
      console.error('Failed to check activity status:', error)
    }
  }

  // Handle redirect for games without direct rush components
  useEffect(() => {
    if (activityType && !ACTIVITY_COMPONENTS[activityType]) {
      // Redirect to game page for games without direct rush components (camelCase)
      navigate(`/games/${activityType}`, { replace: true })
    }
  }, [activityType, navigate])

  useEffect(() => {
    fetchRushStats()
    if (!activityType) {
      // If no activity type, get next rush activity
      fetchNextActivity()
    } else if (ACTIVITY_COMPONENTS[activityType]) {
      // If activityType exists and is valid, mark as visited and set loading to false
      setLoading(false)
      checkActivityStatus()
      // Mark activity as visited when component loads
      api.post('/rush/complete', {
        activity_type: activityType,
        status: 'seen'
      }).catch(err => console.error('Failed to mark as seen:', err))
    } else {
      // Invalid activity type
      setLoading(false)
    }
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

  const handleSkip = async () => {
    try {
      await api.post('/rush/complete', {
        activity_type: activityType,
        status: 'skipped'
      })
      
      setActivityStatus('skipped')
      fetchRushStats() // Update stats
      
      // Move to next activity
      setTimeout(() => {
        fetchNextActivity()
      }, 500)
    } catch (error) {
      console.error('Failed to skip activity:', error)
    }
  }

  const handleNext = async () => {
    // Just move to next activity (activity already completed)
    fetchNextActivity()
  }

  const handleComplete = async () => {
    try {
      await api.post('/rush/complete', {
        activity_type: activityType,
        status: 'completed'
      })
      
      setActivityStatus('completed')
      fetchRushStats() // Update stats
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

  // If activity type doesn't have a direct component, redirect to game page
  if (!activityType) {
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

  // If component exists, use it; otherwise show loading (redirect handled in useEffect)
  if (!ACTIVITY_COMPONENTS[activityType]) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-spin">🎯</div>
          <p className="text-2xl font-bold">Game load ho raha hai...</p>
        </div>
      </div>
    )
  }

  const ActivityComponent = ACTIVITY_COMPONENTS[activityType]

  return (
    <div className="relative">
      {/* Rush Stats - Top Left */}
      {rushStats && (
        <div className="fixed top-4 left-4 z-50 bg-white bg-opacity-90 rounded-full px-4 py-2 shadow-lg">
          <span className="text-lg font-bold text-gray-800">
            {rushStats.progress || `${rushStats.completed_count || 0}/${rushStats.total_activities || 10}`}
          </span>
        </div>
      )}
      
      {/* Skip/Next Button - Top Right */}
      {showSkipButton && activityType && (
        <div className="fixed top-4 right-4 z-50">
          {activityStatus === 'completed' ? (
            <FloatingButton
              onClick={handleNext}
              className="bg-green-500 text-white hover:bg-green-600"
            >
              ➡️ Next
            </FloatingButton>
          ) : (
            <FloatingButton
              onClick={handleSkip}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              ⏭️ Skip
            </FloatingButton>
          )}
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

