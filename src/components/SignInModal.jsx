import { createPortal } from 'react-dom'
import { useEffect, useRef, useState } from 'react'
import { useGuestAuth } from '../hooks/useGuestAuth'
import { getGoogleClientId } from '../services/api.js'
import { loadGoogleIdentityScript } from '../utils/googleIdentity'

/**
 * Google Identity Services guest sign-in (Vara POST /api/guest-auth/google).
 */
export function SignInModal({ open, onClose }) {
  const { signInWithGoogle, busy, error, clearError } = useGuestAuth()
  const [configError, setConfigError] = useState('')
  const [loadingGis, setLoadingGis] = useState(false)
  const buttonRef = useRef(null)
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
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) return undefined

    let cancelled = false
    const clientId = getGoogleClientId()

    ;(async () => {
      clearErrorRef.current()

      if (!clientId) {
        if (!cancelled) {
          setConfigError(
            'Google sign-in is not configured. Set VITE_GOOGLE_CLIENT_ID in your environment.',
          )
          setLoadingGis(false)
        }
        return
      }

      if (!cancelled) {
        setConfigError('')
        setLoadingGis(true)
      }

      try {
        const google = await loadGoogleIdentityScript()
        if (cancelled || !buttonRef.current) return

        google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            const credential = response?.credential
            if (!credential) return
            const ok = await signInRef.current(credential)
            if (ok) onCloseRef.current()
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        })

        buttonRef.current.innerHTML = ''
        google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: 320,
        })
      } catch (err) {
        if (!cancelled) {
          setConfigError(err?.message || 'Could not load Google sign-in.')
        }
      } finally {
        if (!cancelled) setLoadingGis(false)
      }
    })()

    const buttonEl = buttonRef.current

    return () => {
      cancelled = true
      if (buttonEl) buttonEl.innerHTML = ''
    }
  }, [open])

  if (!open) return null

  const statusMessage = error || configError
  const showBusy = busy || loadingGis

  return createPortal(
    <div
      className="modal-root"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="signin-title">Sign in to book</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <p className="modal-lead">
          Continue with Google to check availability, manage your cart, and view
          bookings.
        </p>
        <div className="signin-google">
          {showBusy && !configError ? (
            <p className="form-status" role="status">
              {busy ? 'Signing in…' : 'Loading Google sign-in…'}
            </p>
          ) : null}
          <div
            ref={buttonRef}
            className="signin-google-btn"
            hidden={Boolean(configError) || busy}
            aria-hidden={Boolean(configError) || busy}
          />
          {statusMessage ? (
            <p className="form-status err" role="status">
              {statusMessage}
            </p>
          ) : null}
          <div className="modal-actions">
            <button type="button" className="modal-text-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
