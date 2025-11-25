import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ChaosProvider } from './context/ChaosContext'
import { UIChaosProvider } from './context/UIChaosContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ChatRoom from './pages/ChatRoom'
import Jokes from './pages/Jokes'
import Wordle from './pages/Wordle'
import Tambola from './pages/Tambola'
import Games from './pages/Games'
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
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </UIChaosProvider>
        </ChaosProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

