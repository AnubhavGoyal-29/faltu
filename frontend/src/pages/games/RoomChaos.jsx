import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import FloatingButton from '../../components/FloatingButton'

const RoomChaos = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

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

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          <div className="text-6xl mb-6">🌪️</div>
          <h2 className="text-3xl font-black text-gray-800 mb-4">
            Coming Soon!
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Group fun mode with AI polls, tasks, and debates!
          </p>
          <p className="text-lg text-gray-500">
            Abhi development mein hai... jald hi aayega! 🚀
          </p>
        </div>
      </main>
    </div>
  )
}

export default RoomChaos

