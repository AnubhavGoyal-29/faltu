import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import FloatingButton from '../components/FloatingButton'
import JokeCard from '../components/JokeCard'
import { triggerConfetti } from '../utils/confettiBlast'

const Jokes = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [joke, setJoke] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGetJoke = async () => {
    setLoading(true)
    setJoke(null)
    triggerConfetti()
    
    try {
      const response = await api.get('/jokes/random')
      setJoke(response.data.joke)
    } catch (error) {
      console.error('Failed to get joke:', error)
      setJoke("Why did the API break? Because it couldn't handle the chaos! 😂")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <FloatingButton
            onClick={() => navigate('/dashboard')}
            className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
          >
            ← Back
          </FloatingButton>
          <h1 className="text-4xl font-black text-white drop-shadow-2xl animate-pulse-crazy">
            😂 Bakchod Jokes Generator
          </h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <FloatingButton
            onClick={handleGetJoke}
            disabled={loading}
            chaos={true}
            className="bg-white text-orange-600 text-2xl px-12 py-6 shadow-2xl animate-glow"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <span className="animate-spin-slow">🌀</span>
                Loading...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <span>🎭</span>
                Bakchod Joke Generate Karo
                <span className="animate-bounce-silly">😂</span>
              </span>
            )}
          </FloatingButton>
        </div>

        {joke && (
          <div className="animate-bounce-silly">
            <JokeCard joke={joke} loading={loading} />
          </div>
        )}

        {!joke && !loading && (
          <div className="text-center text-white text-xl mt-20 animate-float">
            <p className="text-4xl mb-4">🎪</p>
            <p>Upar button click karo bakchod joke ke liye!</p>
            <p className="text-sm mt-2 opacity-80">Warning: Jokes bahut faltu aur naughty ho sakte hain 😂</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default Jokes

