import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ChaosProvider } from './context/ChaosContext'
import { UIChaosProvider } from './context/UIChaosContext'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Dashboard from './pages/Dashboard'
import ChatRoom from './pages/ChatRoom'
import Jokes from './pages/Jokes'
import Wordle from './pages/Wordle'
import Tambola from './pages/Tambola'
import Games from './pages/Games'
import BakchodiChallenge from './pages/games/BakchodiChallenge'
import Debate from './pages/games/Debate'
import MemeBattle from './pages/games/MemeBattle'
import WheelSpin from './pages/games/WheelSpin'
import FuturePrediction from './pages/games/FuturePrediction'
import TapGame from './pages/games/TapGame'
import RunawayButton from './pages/games/RunawayButton'
import DareMachine from './pages/games/DareMachine'
import RoastMe from './pages/games/RoastMe'
import RoomChaos from './pages/games/RoomChaos'
// NEW 30 GAMES
import GyaanGuru from './pages/games/GyaanGuru'
import BakwaasBattle from './pages/games/BakwaasBattle'
import EmojiMashup from './pages/games/EmojiMashup'
import MoodSwinger from './pages/games/MoodSwinger'
import PoetryChaos from './pages/games/PoetryChaos'
import AukaatMeter from './pages/games/AukaatMeter'
import JhandMeter from './pages/games/JhandMeter'
import DesiSpeedRush from './pages/games/DesiSpeedRush'
import CringeLevel from './pages/games/CringeLevel'
import VibeDetector from './pages/games/VibeDetector'
import UselessFact from './pages/games/UselessFact'
import BombTimer from './pages/games/BombTimer'
import ChaosGenerator from './pages/games/ChaosGenerator'
import MemeMaster from './pages/games/MemeMaster'
import DesiBurn from './pages/games/DesiBurn'
import LuckyChaos from './pages/games/LuckyChaos'
import ReflexMaster from './pages/games/ReflexMaster'
import NonsenseFactory from './pages/games/NonsenseFactory'
import MoodReader from './pages/games/MoodReader'
import BakchodiLevel from './pages/games/BakchodiLevel'
import DareMaster from './pages/games/DareMaster'
import TypingChaos from './pages/games/TypingChaos'
import EmojiTale from './pages/games/EmojiTale'
import VibeScanner from './pages/games/VibeScanner'
import ComplimentChaos from './pages/games/ComplimentChaos'
import PressureTest from './pages/games/PressureTest'
import QuizChaos from './pages/games/QuizChaos'
import ChaosSurvival from './pages/games/ChaosSurvival'
import DesiMaster from './pages/games/DesiMaster'
import RushActivity from './pages/RushActivity'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'


function App() {
  return (
    <Router>
      <AuthProvider>
        <ChaosProvider>
          <UIChaosProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/admin" element={<Admin />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatRoom />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jokes"
                element={
                  <ProtectedRoute>
                    <Jokes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wordle"
                element={
                  <ProtectedRoute>
                    <Wordle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tambola"
                element={
                  <ProtectedRoute>
                    <Tambola />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games"
                element={
                  <ProtectedRoute>
                    <Games />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/bakchodi"
                element={
                  <ProtectedRoute>
                    <BakchodiChallenge />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/debate"
                element={
                  <ProtectedRoute>
                    <Debate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/meme"
                element={
                  <ProtectedRoute>
                    <MemeBattle />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/wheel"
                element={
                  <ProtectedRoute>
                    <WheelSpin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/future"
                element={
                  <ProtectedRoute>
                    <FuturePrediction />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/tap"
                element={
                  <ProtectedRoute>
                    <TapGame />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/runaway"
                element={
                  <ProtectedRoute>
                    <RunawayButton />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/dare"
                element={
                  <ProtectedRoute>
                    <DareMachine />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/roast"
                element={
                  <ProtectedRoute>
                    <RoastMe />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/games/chaos"
                element={
                  <ProtectedRoute>
                    <RoomChaos />
                  </ProtectedRoute>
                }
              />
              {/* NEW 30 GAMES ROUTES - All camelCase */}
              <Route path="/games/gyaanGuru" element={<ProtectedRoute><GyaanGuru /></ProtectedRoute>} />
              <Route path="/games/bakwaasBattle" element={<ProtectedRoute><BakwaasBattle /></ProtectedRoute>} />
              <Route path="/games/emojiMashup" element={<ProtectedRoute><EmojiMashup /></ProtectedRoute>} />
              <Route path="/games/moodSwinger" element={<ProtectedRoute><MoodSwinger /></ProtectedRoute>} />
              <Route path="/games/poetryChaos" element={<ProtectedRoute><PoetryChaos /></ProtectedRoute>} />
              <Route path="/games/aukaatMeter" element={<ProtectedRoute><AukaatMeter /></ProtectedRoute>} />
              <Route path="/games/jhandMeter" element={<ProtectedRoute><JhandMeter /></ProtectedRoute>} />
              <Route path="/games/desiSpeedRush" element={<ProtectedRoute><DesiSpeedRush /></ProtectedRoute>} />
              <Route path="/games/cringeLevel" element={<ProtectedRoute><CringeLevel /></ProtectedRoute>} />
              <Route path="/games/vibeDetector" element={<ProtectedRoute><VibeDetector /></ProtectedRoute>} />
              <Route path="/games/uselessFact" element={<ProtectedRoute><UselessFact /></ProtectedRoute>} />
              <Route path="/games/bombTimer" element={<ProtectedRoute><BombTimer /></ProtectedRoute>} />
              <Route path="/games/chaosGenerator" element={<ProtectedRoute><ChaosGenerator /></ProtectedRoute>} />
              <Route path="/games/memeMaster" element={<ProtectedRoute><MemeMaster /></ProtectedRoute>} />
              <Route path="/games/desiBurn" element={<ProtectedRoute><DesiBurn /></ProtectedRoute>} />
              <Route path="/games/luckyChaos" element={<ProtectedRoute><LuckyChaos /></ProtectedRoute>} />
              <Route path="/games/reflexMaster" element={<ProtectedRoute><ReflexMaster /></ProtectedRoute>} />
              <Route path="/games/nonsenseFactory" element={<ProtectedRoute><NonsenseFactory /></ProtectedRoute>} />
              <Route path="/games/moodReader" element={<ProtectedRoute><MoodReader /></ProtectedRoute>} />
              <Route path="/games/bakchodiLevel" element={<ProtectedRoute><BakchodiLevel /></ProtectedRoute>} />
              <Route path="/games/dareMaster" element={<ProtectedRoute><DareMaster /></ProtectedRoute>} />
              <Route path="/games/typingChaos" element={<ProtectedRoute><TypingChaos /></ProtectedRoute>} />
              <Route path="/games/emojiTale" element={<ProtectedRoute><EmojiTale /></ProtectedRoute>} />
              <Route path="/games/vibeScanner" element={<ProtectedRoute><VibeScanner /></ProtectedRoute>} />
              <Route path="/games/complimentChaos" element={<ProtectedRoute><ComplimentChaos /></ProtectedRoute>} />
              <Route path="/games/pressureTest" element={<ProtectedRoute><PressureTest /></ProtectedRoute>} />
              <Route path="/games/quizChaos" element={<ProtectedRoute><QuizChaos /></ProtectedRoute>} />
              <Route path="/games/chaosSurvival" element={<ProtectedRoute><ChaosSurvival /></ProtectedRoute>} />
              <Route path="/games/desiMaster" element={<ProtectedRoute><DesiMaster /></ProtectedRoute>} />
              <Route
                path="/rush"
                element={
                  <ProtectedRoute>
                    <RushActivity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rush/:activityType"
                element={
                  <ProtectedRoute>
                    <RushActivity />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </UIChaosProvider>
        </ChaosProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

