import { useState, useRef, useEffect } from 'react'
import './App.css'

const PILLS = ['Returning client', 'New to FUEL', 'Just curious']
const SENSITIVITY = 0.4 // 0.5x speed: half of 0.8

function App() {
  const [selected, setSelected] = useState(null)
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
        <div className="nav-links">
          <a href="#about" className="nav-link">About</a>
          <a href="#services" className="nav-link">Services</a>
          <a href="#contact" className="nav-link">Contact</a>
          <button className="btn-cta-nav">Get Started</button>
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
        {/* Left column */}
        <div className="hero-left">
          <p className="eyebrow">We're back.</p>

          <div className="headline-block">
            <div className="headline-line" style={{ marginLeft: '0px' }}>FUEL.</div>
            <div className="headline-line" style={{ marginLeft: '40px' }}>Restarted.</div>
            <div className="headline-line" style={{ marginLeft: '80px' }}>Reimagined.</div>
          </div>

          <p className="subtext">
            After a long time away, we're back with fresh energy and a new vision.
          </p>

          <div className="cta-row">
            <button className="btn-filled">See What's New</button>
            <button className="btn-outlined">Our Story</button>
          </div>

          {/* Selection question */}
          <div className="selection-area">
            <p className="selection-question">What brings you here?</p>
            <div className="pill-row">
              {PILLS.map((pill) => (
                <button
                  key={pill}
                  className={`pill ${selected === pill ? 'pill--selected' : ''}`}
                  onClick={() => setSelected(selected === pill ? null : pill)}
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — blank */}
        <div className="hero-right" />
      </main>
    </div>
  )
}

export default App
