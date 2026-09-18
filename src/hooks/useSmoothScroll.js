import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../utils/video.js'

gsap.registerPlugin(ScrollTrigger)

function isTouchViewport() {
  if (typeof window === 'undefined') return true
  return (
    window.matchMedia('(hover: none), (pointer: coarse)').matches ||
    'ontouchstart' in window ||
    (navigator.maxTouchPoints || 0) > 0
  )
}

export function useSmoothScroll() {
  useEffect(() => {
    // Lenis + touch breaks GSAP pin/scrub (gallery) on mobile after deploy.
    if (prefersReducedMotion() || isTouchViewport()) return undefined

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const ticker = (time) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(ticker)
      lenis.destroy()
    }
  }, [])
}
