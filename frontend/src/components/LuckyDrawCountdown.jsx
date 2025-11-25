import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext'
import { triggerConfettiBurst } from '../utils/confettiBlast'

const bakchodMessages = [
  "Kya baat hai! Koi jeet gaya!",
  "OMG! Kisi ko mil gaya!",
  "Breaking: Koi lucky nikla!",
  "Dekho dekho! Winner aaya!",
  "Chaos! Koi jeet gaya!",
  "Faltu winner mil gaya!",
  "Random winner selected!",
  "Kisi ko tag karo - wo jeet gaya!",
  "Lucky draw winner announced!",
  "Koi bakchod jeet gaya!"
]

const prankMessages = [
  "Arre yaar! Koi winner nahi nikla! 😂",
  "Sabko pagal banaya! Koi jeeta nahi! 🎭",
  "Just kidding! Koi nahi jeeta! 😜",
  "Tum sab pagal ho! Koi winner nahi hai! 🤡",
  "Gotcha! Sabko fool banaya! 🎪",
  "Haha! Koi nahi jeeta! Next time pakka! 😄"
]

const naughtyJokes = [
  "Ek ladki ne apne boyfriend se kaha: 'Tumhare paas kya hai?' Boyfriend: 'Mere paas iPhone hai, car hai, ghar hai...' Ladki: 'Toh phir tumhare paas kya nahi hai?' Boyfriend: 'Tumhare jaisi girlfriend nahi hai!' 😂",
  "Teacher: 'Beta, tumhare papa ka naam kya hai?' Student: 'Papa ka naam Papa hai!' Teacher: 'Tumhare dada ka naam?' Student: 'Dada ka naam Dada hai!' Teacher: 'Tum pagal ho?' Student: 'Nahi ma'am, meri mummy pagal hai!' 🤣",
  "Ek aadmi ne apni biwi se pucha: 'Tum mujhe kyun shaadi kiya?' Biwi: 'Tumhare paas paisa tha!' Aadmi: 'Ab kya?' Biwi: 'Ab tumhare paas paisa nahi hai!' 😅",
  "Doctor: 'Aapko kya problem hai?' Patient: 'Mujhe lagta hai main pagal ho gaya hoon!' Doctor: 'Kyun?' Patient: 'Kyunki mujhe lagta hai main pagal ho gaya hoon!' Doctor: 'Haan, aap pagal ho!' 😂",
  "Ek ladke ne apni girlfriend se kaha: 'Tum bahut khoobsurat ho!' Girlfriend: 'Thank you!' Ladka: 'Par tumhare paas dimag nahi hai!' Girlfriend: 'Tumhare paas bhi toh nahi hai!' 😄"
]

const LuckyDrawCountdown = ({ onClose }) => {
  const { token } = useAuth()
  const [timeLeft, setTimeLeft] = useState(10)
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!token) return

    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const socketUrl = baseUrl.replace('/api', '').replace(/\/$/, '')

    const newSocket = io(socketUrl, {
      auth: { token }
    })

    newSocket.on('minute_lucky_draw', (data) => {
      setResult({
        type: 'winner',
        winner: data.winner,
        message: data.message,
        reward_points: data.reward_points
      })
      setShowResult(true)
      triggerConfettiBurst()
    })

    newSocket.on('minute_lucky_draw_message', (data) => {
      // Randomly decide: prank or joke
      const random = Math.random()
      if (random < 0.5) {
        // Prank - no winner
        setResult({
          type: 'prank',
          message: prankMessages[Math.floor(Math.random() * prankMessages.length)]
        })
      } else {
        // Joke
        setResult({
          type: 'joke',
          message: naughtyJokes[Math.floor(Math.random() * naughtyJokes.length)]
        })
      }
      setShowResult(true)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [token])

  useEffect(() => {
    if (timeLeft <= 0) {
      // Wait for result from socket
      setTimeout(() => {
        if (!showResult) {
          // No result received - show prank
          setResult({
            type: 'prank',
            message: prankMessages[Math.floor(Math.random() * prankMessages.length)]
          })
          setShowResult(true)
        }
      }, 1000)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, showResult])

  if (showResult && result) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center">
        <div className="text-center p-8 max-w-2xl">
          {result.type === 'winner' && (
            <>
              <div className="text-8xl mb-4 animate-bounce">🎉</div>
              <h2 className="text-5xl font-black text-yellow-400 mb-4 animate-pulse">
                WINNER!
              </h2>
              {result.winner?.profile_photo && (
                <img 
                  src={result.winner.profile_photo} 
                  alt={result.winner.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-yellow-400"
                />
              )}
              <p className="text-3xl font-bold text-white mb-2">
                {result.winner?.name}
              </p>
              <p className="text-2xl text-yellow-300 mb-4">
                {result.message}
              </p>
              <p className="text-xl text-green-400 font-bold">
                {result.reward_points} Points Mil Gaye! 🎊
              </p>
            </>
          )}

          {result.type === 'prank' && (
            <>
              <div className="text-8xl mb-4 animate-spin">🤡</div>
              <h2 className="text-5xl font-black text-red-400 mb-4 animate-pulse">
                PRANKED!
              </h2>
              <p className="text-2xl text-white mb-4">
                {result.message}
              </p>
              <p className="text-xl text-gray-400">
                Next time pakka koi jeetega! 😄
              </p>
            </>
          )}

          {result.type === 'joke' && (
            <>
              <div className="text-8xl mb-4">😂</div>
              <h2 className="text-4xl font-black text-purple-400 mb-4">
                Bakchod Joke Time!
              </h2>
              <p className="text-xl text-white mb-4 leading-relaxed">
                {result.message}
              </p>
            </>
          )}

          <button
            onClick={onClose}
            className="mt-8 px-8 py-4 bg-purple-600 text-white text-xl font-bold rounded-full hover:bg-purple-700 transition-all animate-pulse"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center">
      <div className="text-center">
        <div className="text-9xl mb-8 animate-pulse">🎰</div>
        <h1 className="text-7xl font-black text-yellow-400 mb-4 animate-bounce">
          LUCKY DRAW
        </h1>
        <div className="text-8xl font-black text-white mb-8 animate-pulse">
          {timeLeft}
        </div>
        <p className="text-2xl text-gray-300 animate-pulse">
          {timeLeft > 5 ? 'Wait Karo...' : 'Abhi Abhi...'}
        </p>
        {timeLeft <= 3 && (
          <div className="mt-8 text-6xl animate-spin">
            🎲
          </div>
        )}
      </div>
    </div>
  )
}

export default LuckyDrawCountdown

