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
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </UIChaosProvider>
        </ChaosProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

