import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { GALLERY_ITEMS } from '../utils/catalog'
import { getSiteGallery } from '../services/api.js'
import { prefersReducedMotion } from '../utils/video'

gsap.registerPlugin(ScrollTrigger)

function normalizeGallery(data) {
  const raw = Array.isArray(data)
    ? data
    : data && Array.isArray(data.items)
      ? data.items
      : data && Array.isArray(data.gallery)
        ? data.gallery
        : data && Array.isArray(data.images)
          ? data.images
          : null
  if (!raw?.length) return null
  return raw.map((item, index) => ({
    id: item.id || item.key || `gallery-${index}`,
    label: item.label || item.title || item.caption || `Frame ${index + 1}`,
    tone: item.tone || item.color || (index % 2 === 0 ? '#5B0E14' : '#1C1412'),
    src: item.src || item.url || item.imageUrl || item.image || null,
  }))
}

export default function Gallery() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [items, setItems] = useState(GALLERY_ITEMS)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await getSiteGallery()
        const next = normalizeGallery(data)
        if (!cancelled && next?.length) setItems(next)
      } catch {
        /* keep static frames */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return undefined

    if (prefersReducedMotion()) {
      section.classList.add('is-static')
      return undefined
    }

    section.classList.remove('is-static')

    const ctx = gsap.context(() => {
      const getTravel = () => Math.max(0, track.scrollWidth - window.innerWidth)
      const getScroll = () => Math.max(window.innerWidth * 0.75, getTravel())

      const tween = gsap.to(track, {
        x: () => -getTravel(),
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

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)
    requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
  }, [items])

  return (
    <section className="gallery" id="gallery" ref={sectionRef}>
      <div className="gallery-pin">
        <div className="gallery-head">
          <p className="chapter-label">Gallery · 03</p>
          <h2>Light on water, wood, and path.</h2>
          <p className="lede">
            Frames from the estate waterline - live gallery when Vara provides
            images, tonal placeholders until then.
          </p>
          <p className="gallery-hint">Scroll to drift along the waterline</p>
        </div>

        <div className="gallery-viewport">
          <div className="gallery-track" ref={trackRef} aria-label="Gallery preview">
            {items.map((item) => (
              <figure className="gallery-frame" key={item.id}>
                {item.src ? (
                  <img className="swatch" src={item.src} alt={item.label} loading="lazy" />
                ) : (
                  <div className="swatch" style={{ backgroundColor: item.tone }} />
                )}
                <figcaption>
                  <span>{item.label}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
