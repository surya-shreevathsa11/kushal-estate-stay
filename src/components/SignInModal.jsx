import { createPortal } from 'react-dom'
import { useEffect, useId, useRef, useState } from 'react'
import { useGuestAuth } from '../hooks/useGuestAuth'
import { getGoogleClientId } from '../services/api.js'
import { loadGoogleIdentityScript } from '../utils/googleIdentity'

function GoogleMark() {
  return (
    <svg
      className="signin-google-mark"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

/**
 * Google Identity Services guest sign-in (Vara POST /api/guest-auth/google).
 * UI is always ready; activate with VITE_GOOGLE_CLIENT_ID when keys arrive.
 */
export function SignInModal({ open, onClose }) {
  const titleId = useId()
  const leadId = useId()
  const { signInWithGoogle, busy, error, clearError } = useGuestAuth()
  const [configHint, setConfigHint] = useState('')
  const [gisReady, setGisReady] = useState(false)
  const [loadingGis, setLoadingGis] = useState(false)
  const [localError, setLocalError] = useState('')
  const panelRef = useRef(null)
  const slotRef = useRef(null)
  const gisHostRef = useRef(null)
  const onCloseRef = useRef(onClose)
  const signInRef = useRef(signInWithGoogle)
  const clearErrorRef = useRef(clearError)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    signInRef.current = signInWithGoogle
  }, [signInWithGoogle])

  useEffect(() => {
    clearErrorRef.current = clearError
  }, [clearError])

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector('.modal-close')?.focus?.()
    }, 0)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return undefined

    let cancelled = false
    let resizeObserver
    const gisHost = gisHostRef.current

    const renderGisButton = (google, clientId, width) => {
      if (!gisHost) return
      gisHost.innerHTML = ''
      google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          const credential = response?.credential
          if (!credential) {
            setLocalError('Google did not return a sign-in credential. Please try again.')
            return
          }
          setLocalError('')
          const ok = await signInRef.current(credential)
          if (ok) onCloseRef.current()
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      })
      google.accounts.id.renderButton(gisHost, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: Math.max(240, Math.min(Math.floor(width), 400)),
      })
    }

    ;(async () => {
      clearErrorRef.current()
      setGisReady(false)
      setConfigHint('')
      setLocalError('')

      const clientId = getGoogleClientId()
      if (!clientId) {
        return
      }

      if (!cancelled) setLoadingGis(true)

      try {
        const google = await loadGoogleIdentityScript()
        if (cancelled) return

        const measureAndRender = () => {
          const width = slotRef.current?.clientWidth || 320
          renderGisButton(google, clientId, width)
        }

        measureAndRender()
        if (!cancelled) setGisReady(true)

        if (typeof ResizeObserver !== 'undefined' && slotRef.current) {
          resizeObserver = new ResizeObserver(() => {
            if (!cancelled) measureAndRender()
          })
          resizeObserver.observe(slotRef.current)
        }
      } catch (err) {
        if (!cancelled) {
          setGisReady(false)
          setLocalError(err?.message || 'Could not load Google sign-in.')
        }
      } finally {
        if (!cancelled) setLoadingGis(false)
      }
    })()

    return () => {
      cancelled = true
      resizeObserver?.disconnect()
      if (gisHost) gisHost.innerHTML = ''
    }
  }, [open])

  if (!open) return null

  const clientConfigured = Boolean(getGoogleClientId())
  const statusMessage = error || localError
  const showBusy = busy || loadingGis

  const onFallbackClick = () => {
    if (busy) return
    setLocalError('')
    if (!clientConfigured) {
      setConfigHint(
        'Google sign-in is ready in the UI. Add VITE_GOOGLE_CLIENT_ID to your .env to activate it.',
      )
      return
    }
    const clickable = gisHostRef.current?.querySelector(
      'div[role="button"], div[tabindex="0"]',
    )
    if (clickable && typeof clickable.click === 'function') {
      clickable.click()
      return
    }
    setLocalError('Google sign-in is still loading. Please wait a moment and try again.')
  }

  return createPortal(
    <div
      className="modal-root signin-modal-root"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={panelRef}
        className="modal-panel signin-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={leadId}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id={titleId}>Sign in to book</h2>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close sign in"
          >
            ×
          </button>
        </div>

        <p id={leadId} className="modal-lead">
          Continue with Google to check availability, manage your cart, and view
          your bookings - one account, no passwords to remember.
        </p>

        <ul className="signin-benefits" aria-label="What you can do after signing in">
          <li>Check live room availability</li>
          <li>Save stays to your cart</li>
          <li>View and manage bookings</li>
        </ul>

        <div className="signin-google">
          {showBusy ? (
            <p className="signin-status" role="status">
              {busy ? 'Signing you in…' : 'Preparing Google sign-in…'}
            </p>
          ) : null}

          <div
            ref={slotRef}
            className={`signin-google-slot${gisReady && !busy ? ' is-live' : ''}${
              busy ? ' is-busy' : ''
            }`}
          >
            <button
              type="button"
              className="signin-google-fallback"
              onClick={onFallbackClick}
              disabled={busy}
              aria-hidden={gisReady && !busy ? true : undefined}
              tabIndex={gisReady && !busy ? -1 : 0}
            >
              <GoogleMark />
              <span>Continue with Google</span>
            </button>
            <div
              ref={gisHostRef}
              className="signin-google-gis"
              hidden={!gisReady || busy}
              aria-hidden={!gisReady || busy}
            />
          </div>

          {configHint ? (
            <p className="signin-hint" role="status">
              {configHint}
            </p>
          ) : null}

          {statusMessage ? (
            <p className="form-status err signin-error" role="alert">
              {statusMessage}
            </p>
          ) : null}

          <p className="signin-privacy">
            We only use Google to verify your account for booking. You can sign
            out anytime from the menu.
          </p>

          <div className="modal-actions signin-actions">
            <button type="button" className="modal-text-btn" onClick={onClose}>
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
