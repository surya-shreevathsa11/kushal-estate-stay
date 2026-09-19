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
          : data &&
              data.siteGallery &&
              Array.isArray(data.siteGallery.images)
            ? data.siteGallery.images
            : null
  if (!raw?.length) return null
  return raw.map((item, index) => ({
    id: item.id || item.key || `gallery-${index}`,
    label: item.label || item.title || item.caption || `Frame ${index + 1}`,
    tone: item.tone || item.color || (index % 2 === 0 ? '#5B0E14' : '#1C1412'),
    src: item.src || item.url || item.imageUrl || item.image || null,
  }))
}

function isTouchViewport() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(hover: none), (pointer: coarse)').matches ||
    'ontouchstart' in window ||
    (navigator.maxTouchPoints || 0) > 0
  )
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

    const touch = isTouchViewport()
    let normalizedScroll = false

    // Mobile browsers often break pinned scrub sections without JS-thread scrolling.
    if (touch) {
      ScrollTrigger.normalizeScroll(true)
      ScrollTrigger.config({ ignoreMobileResize: true })
      normalizedScroll = true
    }

    const ctx = gsap.context(() => {
      const getTravel = () => Math.max(0, track.scrollWidth - window.innerWidth)
      const getScroll = () => {
        const travel = getTravel()
        const frameCount =
          track.querySelectorAll('.gallery-frame').length || items.length || 1
        // Enough vertical distance that each frame is scrubbed through before unpin.
        const perFrame = Math.round(
          Math.max(window.innerHeight * 0.7, window.innerWidth * 0.55),
        )
        return Math.max(travel, perFrame * frameCount)
      }

      const tween = gsap.to(track, {
        x: () => -getTravel(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScroll()}`,
          pin: true,
          pinSpacing: true,
          scrub: touch ? 0.35 : 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          ...(touch ? { pinType: 'fixed' } : null),
        },
      })

      return () => tween.kill()
    }, section)

    const refresh = () => ScrollTrigger.refresh()
    const onResize = () => refresh()
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => refresh())
        : null
    ro?.observe(track)

    const onImgLoad = () => refresh()
    const imgs = track.querySelectorAll('img')
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', onImgLoad, { once: true })
    })

    requestAnimationFrame(() => {
      refresh()
      // Second pass after layout settles (mobile address bar / late images).
      window.setTimeout(refresh, 120)
    })

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      ro?.disconnect()
      imgs.forEach((img) => img.removeEventListener('load', onImgLoad))
      ctx.revert()
      if (normalizedScroll) {
        ScrollTrigger.normalizeScroll(false)
      }
    }
  }, [items])

  return (
    <section className="gallery" id="gallery" ref={sectionRef}>
      <div className="gallery-pin">
        <div className="gallery-head">
          <p className="chapter-label">Gallery · 03</p>
          <h2>Along the Harangi at Kushal Estate Stay.</h2>
          <p className="lede">
            Morning mist on the backwaters, A-frame porches, and the path down to
            the water in Coorg. A short look at how the stay sits on the river.
          </p>
          <p className="gallery-hint">Scroll to move along the frames</p>
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
