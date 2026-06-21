import { useRef, useEffect, useState } from 'react'
import './App.css'

const SENSITIVITY = 0.8

function App() {
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '' })
  const [submitted, setSubmitted] = useState(false)
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

      {/* Single page — everything in the hero */}
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
        <div className="hero-content">
          {/* Left — headline + CTA */}
          <div className="hero-left">
            <h1 className="hero-headline">Fueling the Edge.<br />Localizing the<br />Frontier.</h1>
            <p className="hero-sub">Rethinking architecture. Reclaiming compute.</p>
            <button className="btn-waitlist" onClick={() => setModal(true)}>Join the Waitlist</button>
          </div>
          {/* Right — thesis */}
          <div className="hero-right">
            <p className="thesis-label">The Thesis</p>
            <p className="thesis-body">
              Frontier AI is currently trapped in the cloud. It remains expensive, inaccessible, and fundamentally non-private for emerging markets, rural communities, and secure environments. Meanwhile, standard small models lack the reasoning depth to be truly useful. The current paradigm is broken.
            </p>
          </div>
        </div>
      </main>

      {modal && (
        <div className="modal-backdrop" onClick={() => { setModal(false); setSubmitted(false) }}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            {submitted ? (
              <div className="modal-success">
                <p className="modal-success-icon">✓</p>
                <h2>You're on the list.</h2>
                <p>We'll reach out when it's your turn.</p>
                <button className="modal-close" onClick={() => { setModal(false); setSubmitted(false) }}>Close</button>
              </div>
            ) : (
              <>
                <button className="modal-x" onClick={() => setModal(false)}>✕</button>
                <p className="modal-eyebrow">Early Access</p>
                <h2 className="modal-title">Join the Waitlist</h2>
                <p className="modal-sub">Be the first to access reFUEL when we launch.</p>
                <form className="modal-form" onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>
                  <input
                    className="modal-input"
                    type="text"
                    placeholder="Your name"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                  <input
                    className="modal-input"
                    type="email"
                    placeholder="Your email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                  <button className="modal-submit" type="submit">Request Access</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
