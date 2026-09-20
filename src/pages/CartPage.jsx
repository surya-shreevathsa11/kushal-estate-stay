import { createPortal } from 'react-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { GuestChrome } from '../components/GuestChrome'
import { useCart } from '../hooks/useCart'
import { useGuestAuth } from '../hooks/useGuestAuth'
import {
  createBookingRequest,
  getGuestToken,
  removeCartItem,
} from '../services/api.js'
import { formatInr } from '../utils/bookings'
import { CHECKOUT_TERMS_BULLETS } from '../sections/Policies'

function formatCartDay(value) {
  if (value == null || value === '') return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) {
    const s = String(value)
    return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : s
  }
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function nightsBetween(checkIn, checkOut) {
  const a = new Date(checkIn)
  const b = new Date(checkOut)
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return null
  const nights = Math.round((b.getTime() - a.getTime()) / 86400000)
  return nights > 0 ? nights : null
}

function formatItemDates(item) {
  const checkIn = item.checkIn || item.check_in || item.startDate
  const checkOut = item.checkOut || item.check_out || item.endDate
  const from = formatCartDay(checkIn)
  const to = formatCartDay(checkOut)
  if (from && to) {
    const nights = nightsBetween(checkIn, checkOut)
    const range = `${from} – ${to}`
    if (nights == null) return range
    return `${range} · ${nights} night${nights === 1 ? '' : 's'}`
  }
  if (from) return `From ${from}`
  return 'Dates to confirm'
}

function itemKey(item, index) {
  return item.id || item.itemId || item.cartItemId || `cart-${index}`
}

function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim())
}

function isValidPhone(s) {
  const digits = String(s).replace(/\D/g, '')
  return digits.length >= 10
}

function RequestBookingModal({ open, onClose, onRequested, initialContact }) {
  const [step, setStep] = useState('contact')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!open) return undefined
    setStep('contact')
    setAccepted(false)
    setErr('')
    setBusy(false)
    setFullName(initialContact?.name || '')
    setEmail(initialContact?.email || '')
    setPhone(initialContact?.phone || '')
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open, initialContact])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape' && !busy) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, busy, onClose])

  const goToTerms = useCallback(() => {
    setErr('')
    if (!fullName.trim()) {
      setErr('Please enter your name.')
      return
    }
    if (!isValidEmail(email)) {
      setErr('Please enter a valid email address.')
      return
    }
    if (!isValidPhone(phone)) {
      setErr('Please enter a valid phone number (at least 10 digits).')
      return
    }
    setStep('terms')
  }, [fullName, email, phone])

  const submitRequest = useCallback(async () => {
    if (!accepted) return
    const token = getGuestToken()
    if (!token) {
      setErr('Please sign in again to continue.')
      return
    }
    setBusy(true)
    setErr('')
    try {
      await createBookingRequest(
        {
          name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
        },
        token,
      )
      onRequested?.()
      onClose()
    } catch (e) {
      setErr(e?.message || 'Could not submit your booking request.')
    } finally {
      setBusy(false)
    }
  }, [accepted, fullName, email, phone, onClose, onRequested])

  if (!open) return null

  const titleId = step === 'contact' ? 'checkout-contact-title' : 'checkout-terms-title'
  const titleText = step === 'contact' ? 'Your details' : 'Terms & conditions'

  const modal = (
    <div
      className="checkout-terms-modal-root"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !busy) onClose()
      }}
    >
      <div
        className="checkout-terms-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="checkout-terms-modal-header">
          <h2 id={titleId} className="checkout-terms-modal-title">
            {titleText}
          </h2>
          <button
            type="button"
            className="checkout-terms-modal-close"
            onClick={() => !busy && onClose()}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {step === 'contact' ? (
          <>
            <p className="checkout-step-hint">
              Step 1 of 2 — we&apos;ll send your stay request to the estate
            </p>
            <div className="checkout-contact-stack">
              <label className="checkout-form-field">
                <span>Full name</span>
                <input
                  type="text"
                  name="checkout-full-name"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={busy}
                />
              </label>
              <label className="checkout-form-field">
                <span>Email</span>
                <input
                  type="email"
                  name="checkout-email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={busy}
                />
              </label>
              <label className="checkout-form-field">
                <span>Phone</span>
                <input
                  type="tel"
                  name="checkout-phone"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={busy}
                />
              </label>
            </div>
            <div className="checkout-contact-actions">
              {err ? (
                <p className="checkout-form-message checkout-form-message--error">{err}</p>
              ) : null}
              <Button type="button" variant="primary" disabled={busy} onClick={goToTerms}>
                Continue
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="checkout-step-hint">
              Step 2 of 2 — payment happens only after the estate approves
            </p>
            <button
              type="button"
              className="checkout-terms-back"
              onClick={() => !busy && setStep('contact')}
            >
              ← Edit details
            </button>
            <div className="checkout-terms-modal-body">
              <p>By submitting this request, you agree to the following:</p>
              <ul className="checkout-terms-list">
                {CHECKOUT_TERMS_BULLETS.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="checkout-terms-modal-footer">
              <label className="checkout-terms-accept">
                <input
                  type="checkbox"
                  checked={accepted}
                  disabled={busy}
                  onChange={(e) => setAccepted(e.target.checked)}
                />
                <span>I accept the terms and conditions</span>
              </label>
              {err ? (
                <p className="checkout-form-message checkout-form-message--error">{err}</p>
              ) : null}
              <Button
                type="button"
                variant="primary"
                className="checkout-terms-submit"
                disabled={!accepted || busy}
                onClick={() => void submitRequest()}
              >
                {busy ? 'Submitting request…' : 'Submit request'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

export default function CartPage() {
  const { items, count, cart, refresh } = useCart()
  const { isSignedIn } = useGuestAuth()
  const [removing, setRemoving] = useState(null)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutKey, setCheckoutKey] = useState(0)
  const [requestSuccess, setRequestSuccess] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setNote('')
    try {
      await refresh()
    } catch {
      setNote('Could not refresh cart. Try again in a moment.')
    } finally {
      setLoading(false)
    }
  }, [refresh])

  useEffect(() => {
    if (!isSignedIn) return undefined
    let cancelled = false
    ;(async () => {
      if (cancelled) return
      await load()
    })()
    return () => {
      cancelled = true
    }
  }, [isSignedIn, load])

  const totalPrice = cart?.totalPrice
  const primaryPayable = cart?.upperPayableTotal ?? cart?.lowerPayableTotal
  const primaryPercent = cart?.upperPercent ?? cart?.lowerPercent
  const hasSummary = useMemo(
    () =>
      totalPrice != null ||
      primaryPayable != null ||
      primaryPercent != null,
    [totalPrice, primaryPayable, primaryPercent],
  )

  const onRemove = async (item, index) => {
    const token = getGuestToken()
    if (!token) {
      window.dispatchEvent(new Event('open-guest-signin'))
      return
    }
    const id = item.id || item.itemId || item.cartItemId
    if (!id) {
      setNote('This cart item cannot be removed yet.')
      return
    }
    setRemoving(itemKey(item, index))
    setNote('')
    setRequestSuccess(false)
    try {
      await removeCartItem({ itemId: id, id }, token)
      await refresh()
      window.dispatchEvent(new Event('cart-updated'))
    } catch (err) {
      setNote(err?.message || 'Could not remove that stay. Please try again.')
    } finally {
      setRemoving(null)
    }
  }

  const openCheckout = () => {
    setCheckoutKey((k) => k + 1)
    setCheckoutOpen(true)
    setRequestSuccess(false)
    setNote('')
  }

  const onRequested = async () => {
    setRequestSuccess(true)
    setNote('')
    await refresh()
    window.dispatchEvent(new Event('cart-updated'))
  }

  return (
    <GuestChrome
      className="guest-page--cart"
      current="cart"
      title="Your cart"
      lede="Review stays, then request to book. You pay with Razorpay only after the estate approves."
    >
      {!isSignedIn ? (
        <div className="guest-panel guest-panel--prompt">
          <p className="guest-panel-title">Sign in to unlock your cart</p>
          <p>
            Continue with Google to save dates, manage stays, and pick up where you
            left off on any device.
          </p>
          <div className="guest-actions">
            <Button
              type="button"
              variant="primary"
              onClick={() => window.dispatchEvent(new Event('open-guest-signin'))}
            >
              Continue with Google
            </Button>
            <Button as="a" href="#stay" variant="ghost">
              Browse stays
            </Button>
          </div>
        </div>
      ) : (
        <div className="guest-panel">
          <div className="guest-panel-toolbar">
            <p className="guest-count">
              {loading ? 'Refreshing…' : `${count} ${count === 1 ? 'stay' : 'stays'}`}
            </p>
            <button type="button" className="guest-text-btn" onClick={() => void load()}>
              Refresh
            </button>
          </div>

          {requestSuccess ? (
            <div className="cart-request-success" role="status">
              <p className="cart-request-success-title">Booking request submitted</p>
              <p>
                The estate will review your dates. When approved, complete payment from
                My bookings.
              </p>
              <div className="guest-actions">
                <Button as="a" href="#my-bookings" variant="primary">
                  View my bookings
                </Button>
                <Button as="a" href="#stay" variant="ghost">
                  Add another stay
                </Button>
              </div>
            </div>
          ) : null}

          {count === 0 && !requestSuccess ? (
            <div className="guest-empty">
              <p>Your cart is empty.</p>
              <p className="guest-empty-hint">
                Choose a room from Stay, pick dates, and add it here.
              </p>
              <Button as="a" href="#stay" variant="primary">
                Choose a stay
              </Button>
            </div>
          ) : null}

          {count > 0 ? (
            <ul className="guest-list">
              {items.map((item, index) => (
                <li className="guest-card" key={itemKey(item, index)}>
                  <div className="guest-card-body">
                    <p className="guest-card-index">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h2 className="guest-card-title">
                      {item.name ||
                        item.roomName ||
                        item.room?.roomName ||
                        item.roomId ||
                        'Stay'}
                    </h2>
                    <p className="guest-card-meta guest-card-meta--dates">
                      {formatItemDates(item)}
                    </p>
                    {(item.adults != null || item.guests != null) && (
                      <p className="guest-card-meta guest-card-meta--guests">
                        {item.adults ?? item.guests} guests
                      </p>
                    )}
                    {item.price != null || item.totalPrice != null ? (
                      <p className="guest-card-price">
                        {formatInr(item.price ?? item.totalPrice)}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    className="guest-card-remove"
                    disabled={removing === itemKey(item, index)}
                    onClick={() => void onRemove(item, index)}
                  >
                    {removing === itemKey(item, index) ? 'Removing…' : 'Remove'}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {count > 0 && hasSummary ? (
            <dl className="cart-summary">
              {totalPrice != null ? (
                <div>
                  <dt>Stay total</dt>
                  <dd>{formatInr(totalPrice)}</dd>
                </div>
              ) : null}
              {primaryPayable != null ? (
                <div className="cart-summary-payable">
                  <dt>
                    Payable after approval
                    {primaryPercent != null ? ` (${primaryPercent}%)` : ''}
                  </dt>
                  <dd>{formatInr(primaryPayable)}</dd>
                </div>
              ) : null}
            </dl>
          ) : null}

          {note ? (
            <p className="guest-note" role="status">
              {note}
            </p>
          ) : null}

          {count > 0 ? (
            <div className="guest-actions guest-actions--footer">
              <Button as="a" href="#stay" variant="ghost">
                Add another stay
              </Button>
              <Button type="button" variant="primary" onClick={openCheckout}>
                Request to book
              </Button>
              <p className="guest-checkout-note">
                No charge yet — you&apos;ll pay with Razorpay after the estate approves.
              </p>
            </div>
          ) : null}
        </div>
      )}

      <RequestBookingModal
        key={checkoutKey}
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onRequested={() => void onRequested()}
      />
    </GuestChrome>
  )
}
