export const HERO_VIDEO = {
  src: '/drone-hero.mp4',
  poster: '/og-poster.svg',
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
