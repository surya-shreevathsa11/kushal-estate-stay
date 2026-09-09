import Navbar from '../sections/Navbar'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Stay from '../sections/Stay'
import Gallery from '../sections/Gallery'
import Reviews from '../sections/Reviews'
import Booking from '../sections/Booking'
import Footer from '../sections/Footer'
import { useSmoothScroll } from '../hooks/useSmoothScroll'

export default function HomePage() {
  useSmoothScroll()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Stay />
        <Gallery />
        <Reviews />
        <Booking />
      </main>
      <Footer />
    </>
  )
}
