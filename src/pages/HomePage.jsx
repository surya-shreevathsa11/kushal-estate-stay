import { useEffect } from 'react'
import Navbar from '../sections/Navbar'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Stay from '../sections/Stay'
import Gallery from '../sections/Gallery'
import Reviews from '../sections/Reviews'
import Location from '../sections/Location'
import Policies from '../sections/Policies'
import Footer from '../sections/Footer'
import ChapterRail from '../components/ChapterRail'
import { useSmoothScroll } from '../hooks/useSmoothScroll'

function scrollToHashSection() {
  const id = window.location.hash.replace(/^#/, '')
  if (!id || id === 'cart' || id === 'my-bookings') return
  const el = document.getElementById(id)
  if (!el) return
  requestAnimationFrame(() => {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

export default function HomePage() {
  useSmoothScroll()

  useEffect(() => {
    scrollToHashSection()
    const onHashChange = () => scrollToHashSection()
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return (
    <>
      <Navbar />
      <ChapterRail />
      <main>
        <Hero />
        <About />
        <Stay />
        <Gallery />
        <Reviews />
        <Location />
        <Policies />
      </main>
      <Footer />
    </>
  )
}
