import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GALLERY_ITEMS } from '../utils/catalog'
import { prefersReducedMotion } from '../utils/video'

gsap.registerPlugin(ScrollTrigger)

export default function Gallery() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return undefined

    if (prefersReducedMotion() || window.matchMedia('(max-width: 768px)').matches) {
      section.classList.add('is-static')
      return undefined
    }

    const ctx = gsap.context(() => {
      const getScroll = () => Math.max(0, track.scrollWidth - window.innerWidth)

      const tween = gsap.to(track, {
        x: () => -getScroll(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScroll()}`,
          pin: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      return () => tween.kill()
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section className="gallery" id="gallery" ref={sectionRef}>
      <div className="gallery-pin">
        <div className="gallery-head">
          <p className="chapter-label">Gallery · 03</p>
          <h2>Light on water, wood, and path.</h2>
          <p className="lede">
            Photography will replace these frames. For now, a waterline of the
            estate’s night tones.
          </p>
          <p className="gallery-hint">Scroll to drift along the waterline</p>
        </div>

        <div className="gallery-viewport">
          <div className="gallery-track" ref={trackRef} aria-label="Gallery preview">
            {GALLERY_ITEMS.map((item, index) => (
              <figure className="gallery-frame" key={item.id}>
                <div className="swatch" style={{ backgroundColor: item.tone }} />
                <figcaption>
                  <span>{item.label}</span>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
