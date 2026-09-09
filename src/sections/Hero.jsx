import { useEffect, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { HERO_VIDEO, prefersReducedMotion } from '../utils/video'

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

  return (
    <section className="hero" id="top" aria-label="Introduction">
      <div className="hero-media" aria-hidden={!videoOk}>
        {videoOk ? (
          <video
            ref={videoRef}
            src={HERO_VIDEO.src}
            poster={HERO_VIDEO.poster}
            muted
            loop
            playsInline
            autoPlay
            preload="metadata"
            onError={() => setVideoOk(false)}
          />
        ) : (
          <div className="hero-fallback" role="img" aria-label="Harangi backwaters atmosphere" />
        )}
        <div className="hero-veil" />
      </div>

      <div className="hero-content">
        <div className="hero-copy" ref={copyRef}>
          <p className="eyebrow" style={{ color: 'var(--color-sand)' }}>
            Homestay
          </p>
          <h1 className="hero-brand">Kushal Estate Stay</h1>
          <p className="hero-line">
            A place to linger on the backwaters of the Harangi river — cabins,
            rooms, and quiet water light.
          </p>
          <div className="hero-actions">
            <Button as="a" href="#booking" variant="primary">
              Check availability
            </Button>
            <Button as="a" href="#about" variant="ghost">
              About the land
            </Button>
          </div>
          <p className="hero-locale">Harangi river · Karnataka</p>
        </div>
      </div>
    </section>
  )
}
