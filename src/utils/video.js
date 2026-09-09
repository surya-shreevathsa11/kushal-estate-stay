export const HERO_VIDEO = {
  src: '/drone-hero.mp4',
  poster: '/drone-hero-poster.jpg',
}

export function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
