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
  { href: '#location', label: 'Location' },
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
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
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
      <header className={`site-nav${scrolled || open ? ' is-scrolled' : ''}${open ? ' is-menu-open' : ''}`}>
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
            <Button as="a" href="#stay" className="nav-cta" variant="primary">
              Book
            </Button>
          </nav>
          <button
            type="button"
            className={`nav-toggle${open ? ' is-open' : ''}`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </header>

      <button
        type="button"
        className={`nav-backdrop${open ? ' is-open' : ''}`}
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
        onClick={close}
      />

      <div
        id="mobile-nav"
        className={`nav-drawer${open ? ' is-open' : ''}`}
        hidden={!open}
      >
        <div className="nav-drawer-scroll">
          <p className="nav-drawer-label">Explore</p>
          <nav className="nav-drawer-links" aria-label="Mobile">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href} onClick={close}>
                {link.label}
              </a>
            ))}
          </nav>

          <div className="nav-drawer-divider" />

          <div className="nav-drawer-meta">
            <a href="#cart" className="nav-drawer-action" onClick={close}>
              <span className="nav-drawer-action-label">Cart</span>
              {count > 0 ? (
                <span className="nav-drawer-badge">{count}</span>
              ) : (
                <span className="nav-drawer-action-hint">View stays</span>
              )}
            </a>
            {isSignedIn ? (
              <button
                type="button"
                className="nav-drawer-action"
                onClick={() => {
                  signOut()
                  close()
                }}
              >
                <span className="nav-drawer-action-label">Sign out</span>
                <span className="nav-drawer-action-hint">Guest session</span>
              </button>
            ) : (
              <button
                type="button"
                className="nav-drawer-action nav-drawer-action--accent"
                onClick={() => {
                  setSignInOpen(true)
                  close()
                }}
              >
                <span className="nav-drawer-action-label">Sign in</span>
                <span className="nav-drawer-action-hint">Continue with Google</span>
              </button>
            )}
          </div>
        </div>

        <div className="nav-drawer-footer">
          <Button as="a" href="#stay" variant="primary" className="nav-drawer-book" onClick={close}>
            Book a stay
          </Button>
        </div>
      </div>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </>
  )
}
