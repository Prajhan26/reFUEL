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

    function setRate() {
      if (video.playbackRate !== 0.6) video.playbackRate = 0.6
    }
    video.addEventListener('loadedmetadata', setRate)
    video.addEventListener('play', setRate)
    video.addEventListener('seeked', onSeeked)
    window.addEventListener('mousemove', onMouseMove)
    setRate()
    return () => {
      video.removeEventListener('loadedmetadata', setRate)
      video.removeEventListener('play', setRate)
      video.removeEventListener('seeked', onSeeked)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <div className="page">
      {/* Navbar */}
      <nav className="navbar">
        <svg className="nav-logo" viewBox="0 0 320 80" xmlns="http://www.w3.org/2000/svg">
          <text x="0"  y="62" fontFamily="Georgia, 'Times New Roman', serif" fontSize="72" fill="#3a5240" letterSpacing="2">F</text>
          <line x1="68" y1="8" x2="68" y2="72" stroke="#3a5240" strokeWidth="2.5"/>
          <text x="80" y="62" fontFamily="Georgia, 'Times New Roman', serif" fontSize="72" fill="#3a5240" letterSpacing="2">U</text>
          <line x1="158" y1="8" x2="158" y2="72" stroke="#3a5240" strokeWidth="2.5"/>
          <text x="170" y="62" fontFamily="Georgia, 'Times New Roman', serif" fontSize="72" fill="#3a5240" letterSpacing="2">E</text>
          <line x1="240" y1="8" x2="240" y2="72" stroke="#3a5240" strokeWidth="2.5"/>
          <text x="252" y="62" fontFamily="Georgia, 'Times New Roman', serif" fontSize="72" fill="#3a5240" letterSpacing="2">L</text>
        </svg>
      </nav>

      {/* Hero */}
      <main className="hero">
        <video
          ref={videoRef}
          className="hero-video"
          src="/hero.mp4"
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
        />
        <div className="hero-text">
          <h1 className="hero-headline">Democratizing Frontier AI for the Edge.</h1>
          <p className="hero-sub">Rethinking architecture. Reclaiming compute.</p>
        </div>
      </main>
    </div>
  )
}

export default App
