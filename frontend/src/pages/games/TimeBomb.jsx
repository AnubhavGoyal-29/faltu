import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const TimeBomb = () => {
  const navigate = useNavigate()
  const [bomb, setBomb] = useState(null)
  const [defused, setDefused] = useState(false)
  const [startTime, setStartTime] = useState(null)
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (bomb && !defused && startTime) {
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime
        const remaining = Math.max(0, bomb.bomb_time - elapsed)
        setTimeLeft(remaining)
        if (remaining <= 0) {
          clearInterval(timer)
        }
      }, 100)
      return () => clearInterval(timer)
    }
  }, [bomb, defused, startTime])

  const startBomb = async () => {
    try {
      const response = await api.post('/games/timeBomb/start')
      if (response.data.success) {
        setBomb(response.data.bomb)
        setStartTime(Date.now())
        setDefused(false)
        setTimeLeft(response.data.bomb.bomb_time)
      }
    } catch (error) {
      console.error('Start bomb error:', error)
    }
  }

  const defuseBomb = async () => {
    if (!bomb || defused) return
    const defuseTime = Date.now() - startTime
    try {
      const response = await api.post('/games/timeBomb/defuse', {
        bomb_id: bomb.bomb_id,
        defuse_time: defuseTime
      })
      if (response.data.success) {
        setDefused(true)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Defuse error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          ⏰ Time Bomb
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!bomb && (
            <FloatingButton onClick={startBomb} className="bg-red-600 text-white py-4 px-8 text-xl">
              Start Time Bomb! 🚀
            </FloatingButton>
          )}

          {bomb && !defused && (
            <div className="space-y-6">
              <div className="text-6xl font-black text-red-600 mb-4">
                {(timeLeft / 1000).toFixed(1)}s
              </div>
              <FloatingButton
                onClick={defuseBomb}
                className="bg-red-600 text-white px-16 py-12 text-4xl animate-pulse"
              >
                DEFUSE! 💣
              </FloatingButton>
            </div>
          )}

          {defused && (
            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4">
                <p className="font-bold text-green-800 text-2xl">Bomb Defused! 🎉</p>
                <p className="text-green-800 font-bold mt-4">Points Earned!</p>
              </div>
              <FloatingButton onClick={startBomb} className="bg-red-600 text-white py-4 px-8 text-xl">
                Try Again! 🔄
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default TimeBomb

