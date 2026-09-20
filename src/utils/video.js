import kushalEstateHero from '../assets/kushalestate.mp4'

/** Original estate hero reel — imported so Vite serves the file unchanged (no re-encode). */
export const HERO_VIDEO = {
  src: kushalEstateHero,
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
