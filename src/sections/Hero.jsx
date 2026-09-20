import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { HERO_VIDEO, prefersReducedMotion } from '../utils/video'
import { HOMESTAY_LOCATION } from '../utils/location'

export default function Hero() {
  const copyRef = useRef(null)
  const videoRef = useRef(null)
  const [videoOk, setVideoOk] = useState(true)

  useEffect(() => {
    const node = copyRef.current
    if (!node) return
    const id = requestAnimationFrame(() => node.classList.add('is-ready'))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || prefersReducedMotion()) {
      setVideoOk(false)
      return
    }
    const play = async () => {
      try {
        await video.play()
      } catch {
        setVideoOk(false)
      }
    }
    play()
  }, [])

  const coords = `${HOMESTAY_LOCATION.lat.toFixed(3)}° N · ${HOMESTAY_LOCATION.lng.toFixed(3)}° E`

  return (
    <section className="hero" id="top" aria-label="Introduction">
      <div className="hero-media" aria-hidden={!videoOk}>
        {videoOk ? (
          <video
            ref={videoRef}
            className="hero-video"
            src={HERO_VIDEO.src}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            onError={() => setVideoOk(false)}
          />
        ) : (
          <div className="hero-fallback" role="img" aria-label="Harangi backwaters atmosphere" />
        )}
        <div className="hero-veil" />
      </div>

      <div className="hero-content">
        <div className="hero-copy" ref={copyRef}>
          <p className="hero-coords">{coords}</p>
          <h1 className="hero-brand">Kushal Estate Stay</h1>
          <p className="hero-line">
            Coffee in the air, calm in the soul. A riverside homestay on the
            Harangi backwaters in Coorg.
          </p>
          <div className="hero-actions">
            <Button as="a" href="#stay" variant="primary">
              Check availability
            </Button>
            <Button as="a" href="#about" variant="ghost">
              About the stay
            </Button>
          </div>
          <div className="hero-waterline" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
