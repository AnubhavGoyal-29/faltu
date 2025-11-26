import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const BombTimer = () => {
  const navigate = useNavigate()
  const [bomb, setBomb] = useState(null)
  const [defused, setDefused] = useState(false)
  const [startTime, setStartTime] = useState(null)

  const startBomb = async () => {
    try {
      const response = await api.post('/games/bombTimer/start')
      if (response.data.success) {
        setBomb(response.data.bomb)
        setStartTime(Date.now())
        setDefused(false)
      }
    } catch (error) {
      console.error('Start bomb error:', error)
    }
  }

  const defuseBomb = async () => {
    if (!bomb || defused) return
    const defuseTime = Date.now() - startTime
    try {
      const response = await api.post('/games/bombTimer/defuse', {
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
          💣 Bomb Timer
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!bomb ? (
            <FloatingButton onClick={startBomb} className="bg-red-600 text-white py-4 px-8 text-xl">
              Start Bomb Timer! 🚀
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              {!defused ? (
                <>
                  <div className="text-6xl font-black text-red-600">💣</div>
                  <FloatingButton onClick={defuseBomb} className="bg-red-600 text-white py-8 px-16 text-3xl">
                    DEFUSE NOW! ⏰
                  </FloatingButton>
                </>
              ) : (
                <div className="bg-green-100 rounded-2xl p-6">
                  <p className="text-2xl font-bold text-green-800">Bomb Defused! 🎉</p>
                  <FloatingButton onClick={startBomb} className="bg-red-600 text-white py-4 px-8 text-xl mt-4">
                    Play Again! 🔄
                  </FloatingButton>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default BombTimer

