import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import { useCart } from '../hooks/useCart'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#stay', label: 'Stay' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#reviews', label: 'Reviews' },
  { href: '#booking', label: 'Book' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { count } = useCart()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header className={`site-nav${scrolled ? ' is-scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#top" aria-label="Kushal Estate Stay — home" onClick={close}>
            <Logo />
          </a>
          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <a href="#cart">Cart{count ? ` (${count})` : ''}</a>
          </nav>
          <Button as="a" href="#booking" className="nav-cta" variant="primary">
            Enquire
          </Button>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </header>
      <div
        id="mobile-nav"
        className={`nav-drawer${open ? ' is-open' : ''}`}
        hidden={!open}
      >
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={close}>
            {link.label}
          </a>
        ))}
        <a href="#cart" onClick={close}>
          Cart{count ? ` (${count})` : ''}
        </a>
        <Button as="a" href="#booking" variant="ghost" onClick={close}>
          Enquire
        </Button>
      </div>
    </>
  )
}
