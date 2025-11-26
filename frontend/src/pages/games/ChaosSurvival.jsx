import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const ChaosSurvival = () => {
  const navigate = useNavigate()
  const [survival, setSurvival] = useState(null)
  const [currentEvent, setCurrentEvent] = useState(null)
  const [eventsSurvived, setEventsSurvived] = useState(0)
  const [loading, setLoading] = useState(false)

  const startSurvival = async () => {
    try {
      const response = await api.post('/games/chaosSurvival/start')
      if (response.data.success) {
        setSurvival(response.data.survival)
        setEventsSurvived(0)
        getNextEvent()
      }
    } catch (error) {
      console.error('Start survival error:', error)
    }
  }

  const getNextEvent = async () => {
    setLoading(true)
    try {
      const response = await api.post('/games/chaosSurvival/survive', {
        survival_id: survival.survival_id,
        event_response: { eventNumber: eventsSurvived + 1 }
      })
      if (response.data.success) {
        setCurrentEvent(response.data.result)
      }
    } catch (error) {
      console.error('Get event error:', error)
    } finally {
      setLoading(false)
    }
  }

  const surviveEvent = async () => {
    setEventsSurvived(eventsSurvived + 1)
    if (eventsSurvived >= 3) {
      completeSurvival()
    } else {
      getNextEvent()
    }
  }

  const completeSurvival = async () => {
    try {
      const response = await api.post('/games/chaosSurvival/complete', {
        survival_id: survival.survival_id
      })
      if (response.data.success) {
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Complete survival error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-slate-700 to-zinc-700 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <FloatingButton onClick={() => navigate('/games')} className="bg-white bg-opacity-30 text-white text-sm px-4 py-2">
          ← Back
        </FloatingButton>
        <h1 className="text-4xl font-black text-white drop-shadow-2xl text-center mt-4">
          🌪️ Chaos Survival
        </h1>
      </header>

      <main className="max-w-4xl mx-auto">
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
          {!survival ? (
            <FloatingButton onClick={startSurvival} className="bg-gray-700 text-white py-4 px-8 text-xl">
              Start Chaos Survival! 🚀
            </FloatingButton>
          ) : (
            <div className="space-y-4">
              <p className="text-xl font-bold">Events Survived: {eventsSurvived}/4</p>
              {currentEvent && (
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-lg">{currentEvent.event}</p>
                </div>
              )}
              <FloatingButton onClick={surviveEvent} disabled={loading} className="bg-green-600 text-white py-4 px-8 text-xl">
                Survive! 💪
              </FloatingButton>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default ChaosSurvival

