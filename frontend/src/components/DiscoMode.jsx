import { useEffect } from 'react'

const DiscoMode = ({ active }) => {
  useEffect(() => {
    if (active) {
      document.body.classList.add('disco-active')
      return () => {
        document.body.classList.remove('disco-active')
      }
    }
  }, [active])

  if (!active) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <div className="absolute inset-0 animate-disco opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 opacity-20 animate-pulse-crazy"></div>
    </div>
  )
}

export default DiscoMode

