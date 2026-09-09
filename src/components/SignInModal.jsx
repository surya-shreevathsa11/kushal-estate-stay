import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { Button } from './Button'
import { useGuestAuth } from '../hooks/useGuestAuth'

/**
 * Email PIN guest sign-in (Vara guest-auth). Google can be wired later via VITE_GOOGLE_CLIENT_ID.
 */
export function SignInModal({ open, onClose }) {
  const { requestPin, verifyPin, busy, error } = useGuestAuth()
  const [step, setStep] = useState('requestPin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [localMsg, setLocalMsg] = useState('')

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
    if (!open) {
      setStep('requestPin')
      setPin('')
      setLocalMsg('')
    }
  }, [open])

  if (!open) return null

  const onSubmit = async (e) => {
    e.preventDefault()
    setLocalMsg('')
    if (step === 'requestPin') {
      const ok = await requestPin({ email, name })
      if (ok) {
        setStep('verifyPin')
        setLocalMsg('We sent a PIN to your email. Enter it below.')
      }
      return
    }
    const ok = await verifyPin({ email, pin, name })
    if (ok) {
      window.dispatchEvent(new Event('guest-auth-changed'))
      onClose()
    }
  }

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
          Verify your email with a one-time PIN to check availability and add stays
          to your cart.
        </p>
        <form className="signin-form" onSubmit={onSubmit}>
          <label className="field">
            <span>Full name</span>
            <input
              required
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          {step === 'verifyPin' ? (
            <label className="field">
              <span>PIN</span>
              <input
                required
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={8}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </label>
          ) : null}
          {(error || localMsg) && (
            <p className={`form-status ${error ? 'err' : 'ok'}`} role="status">
              {error || localMsg}
            </p>
          )}
          <div className="modal-actions">
            <Button type="submit" variant="primary" disabled={busy}>
              {busy
                ? 'Please wait…'
                : step === 'requestPin'
                  ? 'Send PIN'
                  : 'Verify & continue'}
            </Button>
            <button type="button" className="modal-text-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  )
}
