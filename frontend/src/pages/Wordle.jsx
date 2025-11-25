import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import FloatingButton from '../components/FloatingButton'
import { triggerConfettiBurst } from '../utils/confettiBlast'

const Wordle = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [guesses, setGuesses] = useState([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [gameLost, setGameLost] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hint, setHint] = useState('')
  const [correctWord, setCorrectWord] = useState('')

  const maxAttempts = 6

  const handleGuess = async () => {
    if (currentGuess.length !== 5) {
      alert('Word 5 letters ka hona chahiye!')
      return
    }

    if (attempts >= maxAttempts || gameWon || gameLost) {
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/wordle/guess', { guess: currentGuess })
      
      if (response.data.success) {
        const newGuess = {
          word: currentGuess.toUpperCase(),
          result: response.data.result
        }
        
        setGuesses([...guesses, newGuess])
        setAttempts(attempts + 1)
        setCurrentGuess('')

        if (response.data.correct) {
          setGameWon(true)
          setCorrectWord(response.data.correctWord || '')
          triggerConfettiBurst()
          alert(response.data.message)
        } else if (attempts + 1 >= maxAttempts) {
          setGameLost(true)
          // Get correct word when game is lost
          try {
            const dailyResponse = await api.get('/wordle/daily?reveal=true')
            setCorrectWord(dailyResponse.data.correctWord || '')
          } catch (err) {
            console.error('Failed to get correct word:', err)
          }
        }
      }
    } catch (error) {
      console.error('Guess error:', error)
      alert('Guess submit nahi hua!')
    } finally {
      setLoading(false)
    }
  }

  const getLetterColor = (letter, status) => {
    if (status === 'correct') return 'bg-green-500'
    if (status === 'present') return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const getHint = async () => {
    try {
      const response = await api.get(`/wordle/hint?attempts=${attempts}`)
      setHint(response.data.hint)
    } catch (error) {
      console.error('Hint error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <FloatingButton
            onClick={() => navigate('/dashboard')}
            className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
          >
            ← Back
          </FloatingButton>
          <h1 className="text-4xl font-black text-white drop-shadow-2xl animate-pulse-crazy">
            🎯 Hinglish Wordle
          </h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto space-y-6">
        {/* Game Board */}
        <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
          <div className="space-y-2">
            {[...Array(maxAttempts)].map((_, rowIndex) => {
              const guess = guesses[rowIndex]
              return (
                <div key={rowIndex} className="flex gap-2 justify-center">
                  {[...Array(5)].map((_, colIndex) => {
                    const letter = guess?.word[colIndex] || ''
                    const status = guess?.result[colIndex]?.status || 'empty'
                    return (
                      <div
                        key={colIndex}
                        className={`
                          w-16 h-16 rounded-lg flex items-center justify-center
                          text-2xl font-black text-white
                          ${status === 'empty' ? 'bg-gray-200' : getLetterColor(letter, status)}
                          transition-all duration-300
                        `}
                      >
                        {letter}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>

        {/* Input */}
        {!gameWon && !gameLost && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
            <div className="flex gap-4 items-center">
              <input
                type="text"
                value={currentGuess}
                onChange={(e) => {
                  const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 5)
                  setCurrentGuess(val)
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                maxLength={5}
                className="flex-1 px-4 py-3 text-2xl font-black text-center border-4 border-purple-500 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-300"
                placeholder="5 letters"
                disabled={loading}
              />
              <FloatingButton
                onClick={handleGuess}
                disabled={loading || currentGuess.length !== 5}
                className="px-8 py-3 bg-purple-600 text-white"
              >
                {loading ? '...' : 'Guess!'}
              </FloatingButton>
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={getHint}
                className="text-purple-600 underline hover:no-underline"
              >
                Hint Chahiye? 🎯
              </button>
              {hint && (
                <p className="mt-2 text-gray-700 font-bold">{hint}</p>
              )}
            </div>
          </div>
        )}

        {/* Game Over */}
        {(gameWon || gameLost) && (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
            <h2 className="text-3xl font-black mb-4">
              {gameWon ? '🎉 Jeet Gaye!' : '😢 Haar Gaye!'}
            </h2>
            <p className="text-xl mb-4">
              {gameWon ? 'Sahi word guess kiya!' : '6 attempts khatam ho gaye!'}
            </p>
            {gameLost && correctWord && (
              <div className="mb-4 p-4 bg-red-100 rounded-lg border-2 border-red-400">
                <p className="text-sm text-gray-600 mb-2 font-bold">Sahi word tha:</p>
                <p className="text-4xl font-black text-red-600 animate-pulse">{correctWord}</p>
              </div>
            )}
            {gameWon && correctWord && (
              <div className="mb-4 p-4 bg-green-100 rounded-lg border-2 border-green-400">
                <p className="text-sm text-gray-600 mb-2 font-bold">Sahi word:</p>
                <p className="text-4xl font-black text-green-600">{correctWord}</p>
              </div>
            )}
            <FloatingButton
              onClick={() => {
                setGuesses([])
                setAttempts(0)
                setGameWon(false)
                setGameLost(false)
                setCurrentGuess('')
                setHint('')
                setCorrectWord('')
              }}
              className="bg-green-600 text-white"
            >
              Phir Se Khelo! 🔄
            </FloatingButton>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white bg-opacity-80 rounded-2xl p-4 text-sm">
          <p className="font-bold mb-2">Kaise Khelo:</p>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            <li>5 letters ka word guess karo</li>
            <li>🟩 Green = Sahi letter, sahi jagah</li>
            <li>🟨 Yellow = Sahi letter, galat jagah</li>
            <li>⬜ Gray = Letter word mein nahi hai</li>
            <li>6 attempts mein word guess karo!</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default Wordle

