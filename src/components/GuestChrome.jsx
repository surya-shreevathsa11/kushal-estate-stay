import { useEffect, useState } from 'react'
import { Logo } from '../components/Logo'
import { SignInModal } from '../components/SignInModal'
import { useGuestAuth } from '../hooks/useGuestAuth'

/**
 * Shared chrome for cart / bookings pages (includes Google sign-in modal).
 */
export function GuestChrome({ title, lede, children, className = '', current = '' }) {
  const { isSignedIn, signOut } = useGuestAuth()
  const [signInOpen, setSignInOpen] = useState(false)

  useEffect(() => {
    const openSignIn = () => setSignInOpen(true)
    window.addEventListener('open-guest-signin', openSignIn)
    return () => window.removeEventListener('open-guest-signin', openSignIn)
  }, [])

  return (
    <div className={['page-shell', 'guest-page', className].filter(Boolean).join(' ')}>
      <div className="shell guest-page-inner">
        <header className="guest-topbar">
          <a href="#top" className="guest-brand" aria-label="Kushal Estate Stay home">
            <Logo />
          </a>
          <nav className="guest-topbar-links" aria-label="Guest">
            <a href="#stay">Stay</a>
            <a href="#cart" aria-current={current === 'cart' ? 'page' : undefined}>
              Cart
            </a>
            <a
              href="#my-bookings"
              aria-current={current === 'bookings' ? 'page' : undefined}
            >
              Bookings
            </a>
            {isSignedIn ? (
              <button type="button" className="guest-text-btn" onClick={() => signOut()}>
                Sign out
              </button>
            ) : (
              <button
                type="button"
                className="guest-text-btn"
                onClick={() => setSignInOpen(true)}
              >
                Sign in
              </button>
            )}
          </nav>
        </header>

        <div className="guest-page-head">
          <p className="guest-eyebrow">Guest</p>
          <h1>{title}</h1>
          {lede ? <p className="lede guest-lede">{lede}</p> : null}
        </div>

        {children}
      </div>

      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
    </div>
  )
}
