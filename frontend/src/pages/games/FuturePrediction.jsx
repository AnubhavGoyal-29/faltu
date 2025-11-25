import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const FuturePrediction = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [mood, setMood] = useState('')
  const [favSnack, setFavSnack] = useState('')
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)

  const getPrediction = async () => {
    if (!name.trim() || !mood.trim() || !favSnack.trim()) {
      alert('Sab fields fill karo bhai!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/future/predict', {
        name,
        mood,
        fav_snack: favSnack
      })
      if (response.data.success) {
        setPrediction(response.data.prediction)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Prediction error:', error)
      alert('Prediction nahi hui!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <FloatingButton
            onClick={() => navigate('/games')}
            className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
          >
            ← Back
          </FloatingButton>
          <h1 className="text-4xl font-black text-white drop-shadow-2xl">
            🔮 AI Predicts Your Future
          </h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto">
        {!prediction ? (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl space-y-6">
            <h2 className="text-2xl font-black text-gray-800 text-center">
              Kuch Questions Answer Karo:
            </h2>
            
            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2">
                Apna Naam:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tumhara naam kya hai?"
                className="w-full px-4 py-3 rounded-lg border-4 border-purple-500 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2">
                Aaj Ka Mood:
              </label>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="Happy, Sad, Excited, etc."
                className="w-full px-4 py-3 rounded-lg border-4 border-purple-500 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
              />
            </div>

            <div>
              <label className="block text-lg font-bold text-gray-700 mb-2">
                Favorite Snack:
              </label>
              <input
                type="text"
                value={favSnack}
                onChange={(e) => setFavSnack(e.target.value)}
                placeholder="Samosa, Chips, etc."
                className="w-full px-4 py-3 rounded-lg border-4 border-purple-500 text-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
              />
            </div>

            <FloatingButton
              onClick={getPrediction}
              disabled={loading || !name.trim() || !mood.trim() || !favSnack.trim()}
              className="w-full bg-purple-600 text-white py-4 text-lg"
            >
              {loading ? 'Predicting...' : 'Predict My Future! 🔮'}
            </FloatingButton>
          </div>
        ) : (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
            <div className="text-6xl mb-4">🔮</div>
            <h2 className="text-3xl font-black text-gray-800 mb-6">
              Tumhara Future:
            </h2>
            <div className="bg-purple-100 rounded-2xl p-6 mb-6">
              <p className="text-2xl font-bold text-purple-800">
                {prediction.prediction}
              </p>
            </div>
            <FloatingButton
              onClick={() => {
                setName('')
                setMood('')
                setFavSnack('')
                setPrediction(null)
              }}
              className="bg-purple-600 text-white py-4 px-8 text-lg"
            >
              Phir Se Predict Karo! 🔄
            </FloatingButton>
          </div>
        )}
      </main>
    </div>
  )
}

export default FuturePrediction

