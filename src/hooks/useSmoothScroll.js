import { useEffect } from 'react'
import Lenis from 'lenis'
import { prefersReducedMotion } from '../utils/video.js'

export function useSmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    })

    let frame = 0
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [])
}
