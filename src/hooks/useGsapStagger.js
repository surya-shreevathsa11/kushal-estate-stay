import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../utils/video.js'

gsap.registerPlugin(ScrollTrigger)

/**
 * Animate direct children (or selector matches) on scroll.
 */
export function useGsapStagger(selector = ':scope > *') {
  const ref = useRef(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return undefined

    if (prefersReducedMotion()) {
      root.querySelectorAll(selector).forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      return undefined
    }

    const targets = root.querySelectorAll(selector)
    if (!targets.length) return undefined

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: root,
            start: 'top 78%',
            once: true,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [selector])

  return ref
}
