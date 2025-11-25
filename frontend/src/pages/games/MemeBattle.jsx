import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import FloatingButton from '../../components/FloatingButton'
import { triggerConfettiBurst } from '../../utils/confettiBlast'

const MemeBattle = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [imageUrl, setImageUrl] = useState('')
  const [caption, setCaption] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const getNewImage = async () => {
    setLoading(true)
    try {
      const response = await api.get('/games/meme/image')
      if (response.data.success) {
        setImageUrl(response.data.image_url)
        setCaption('')
        setResult(null)
      }
    } catch (error) {
      console.error('Get image error:', error)
    } finally {
      setLoading(false)
    }
  }

  const submitCaption = async () => {
    if (!caption.trim()) {
      alert('Caption to likho bhai!')
      return
    }

    setLoading(true)
    try {
      const response = await api.post('/games/meme/submit', { caption })
      if (response.data.success) {
        setResult(response.data.battle)
        triggerConfettiBurst()
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Submission failed!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 p-6">
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center">
          <FloatingButton
            onClick={() => navigate('/games')}
            className="bg-white bg-opacity-30 text-white text-sm px-4 py-2"
          >
            ← Back
          </FloatingButton>
          <h1 className="text-4xl font-black text-white drop-shadow-2xl">
            😂 Instant Meme Battle
          </h1>
          <div></div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto space-y-6">
        {!imageUrl ? (
          <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl text-center">
            <p className="text-xl mb-4">Ready to create a meme?</p>
            <FloatingButton
              onClick={getNewImage}
              disabled={loading}
              className="bg-yellow-600 text-white px-8 py-4 text-lg"
            >
              {loading ? 'Loading...' : 'Get Meme Image! 🎨'}
            </FloatingButton>
          </div>
        ) : (
          <>
            <div className="bg-white bg-opacity-90 rounded-3xl p-6 shadow-2xl">
              <h2 className="text-2xl font-black mb-4 text-gray-800">Meme Image:</h2>
              <img src={imageUrl} alt="Meme" className="w-full rounded-2xl mb-4" />
              
              {!result ? (
                <div className="space-y-4">
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Apna funny caption likho..."
                    className="w-full px-4 py-3 rounded-lg border-4 border-yellow-500 text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300"
                    rows="3"
                  />
                  <div className="flex gap-4">
                    <FloatingButton
                      onClick={submitCaption}
                      disabled={loading || !caption.trim()}
                      className="flex-1 bg-yellow-600 text-white py-4 text-lg"
                    >
                      {loading ? 'Submitting...' : 'Submit Meme! 🚀'}
                    </FloatingButton>
                    <FloatingButton
                      onClick={getNewImage}
                      disabled={loading}
                      className="bg-gray-500 text-white py-4 px-6"
                    >
                      New Image 🔄
                    </FloatingButton>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-green-100 rounded-lg p-4">
                    <p className="font-bold text-green-800 mb-2">Your Caption:</p>
                    <p className="text-gray-800">{caption}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-100 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">Humor</p>
                      <p className="text-2xl font-black text-blue-600">{result.humor_score}</p>
                    </div>
                    <div className="bg-purple-100 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">Creativity</p>
                      <p className="text-2xl font-black text-purple-600">{result.creativity_score}</p>
                    </div>
                    <div className="bg-pink-100 rounded-lg p-4 text-center">
                      <p className="text-sm text-gray-600">Nonsense</p>
                      <p className="text-2xl font-black text-pink-600">{result.nonsense_score}</p>
                    </div>
                  </div>
                  <div className="bg-yellow-100 rounded-lg p-4 text-center">
                    <p className="text-lg font-bold text-yellow-800">Total Score: {result.total_score} 🎯</p>
                  </div>
                  <FloatingButton
                    onClick={() => {
                      setImageUrl('')
                      setCaption('')
                      setResult(null)
                    }}
                    className="w-full bg-yellow-600 text-white py-4 text-lg"
                  >
                    New Meme! 🔄
                  </FloatingButton>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default MemeBattle

