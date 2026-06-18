import { useRef, useEffect } from 'react'
import './App.css'

const SENSITIVITY = 0.8

function App() {
  const videoRef = useRef(null)
  const prevX = useRef(null)
  const targetTime = useRef(0)
  const isSeeking = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    function seekTo(t) {
      isSeeking.current = true
      video.currentTime = t
    }

    function onSeeked() {
      isSeeking.current = false
      // If target moved while we were seeking, seek again
      if (Math.abs(video.currentTime - targetTime.current) > 0.01) {
        seekTo(targetTime.current)
      }
    }

    function onMouseMove(e) {
      if (prevX.current === null) { prevX.current = e.clientX; return }
      const delta = e.clientX - prevX.current
      prevX.current = e.clientX
      if (!video.duration) return
      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration
      targetTime.current = Math.min(Math.max(targetTime.current + offset, 0), video.duration)
      if (!isSeeking.current) seekTo(targetTime.current)
    }

    video.addEventListener('seeked', onSeeked)
    window.addEventListener('mousemove', onMouseMove)
    return () => {
      video.removeEventListener('seeked', onSeeked)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div className="page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-wordmark">
          <span className="wordmark-re">re</span>
          <span className="wordmark-fuel">FUEL</span>
        </div>
      </nav>

      {/* Hero */}
      <main className="hero">
        <video
          ref={videoRef}
          className="hero-video"
          src="/hero.mp4"
          muted
          playsInline
          preload="auto"
        />
      </main>
    </div>
  )
}

export default App
