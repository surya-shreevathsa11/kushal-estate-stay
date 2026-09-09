import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import { SignInModal } from '../components/SignInModal'
import { useCart } from '../hooks/useCart'
import { useGuestAuth } from '../hooks/useGuestAuth'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#stay', label: 'Stay' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#reviews', label: 'Reviews' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [signInOpen, setSignInOpen] = useState(false)
  const { count, refresh } = useCart()
  const { isSignedIn, signOut } = useGuestAuth()

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

  useEffect(() => {
    const openSignIn = () => setSignInOpen(true)
    const onAuth = () => {
      refresh()
    }
    const onCart = () => refresh()
    window.addEventListener('open-guest-signin', openSignIn)
    window.addEventListener('guest-auth-changed', onAuth)
    window.addEventListener('cart-updated', onCart)
    return () => {
      window.removeEventListener('open-guest-signin', openSignIn)
      window.removeEventListener('guest-auth-changed', onAuth)
      window.removeEventListener('cart-updated', onCart)
    }
  }, [refresh])

  const close = () => setOpen(false)

  return (
    <>
      <header className={`site-nav${scrolled ? ' is-scrolled' : ''}`}>
        <div className="nav-inner">
          <a href="#top" aria-label="Kushal Estate Stay - home" onClick={close}>
            <Logo />
          </a>
          <nav className="nav-links" aria-label="Primary">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
            <a href="#cart">Cart{count ? ` (${count})` : ''}</a>
            {isSignedIn ? (
              <button type="button" className="nav-text-btn" onClick={() => signOut()}>
                Sign out
              </button>
            ) : (
              <button
                type="button"
                className="nav-text-btn"
                onClick={() => setSignInOpen(true)}
              >
                Sign in
              </button>
            )}
          </nav>
          <Button as="a" href="#stay" className="nav-cta" variant="primary">
            Book
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
        {isSignedIn ? (
          <button
            type="button"
            onClick={() => {
              signOut()
              close()
            }}
          >
            Sign out
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setSignInOpen(true)
              close()
            }}
          >
            Sign in
          </button>
        )}
        <Button as="a" href="#stay" variant="ghost" onClick={close}>
          Book
        </Button>
      </div>
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  )
}
