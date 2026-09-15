import { useCallback, useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { GuestChrome } from '../components/GuestChrome'
import { useCart } from '../hooks/useCart'
import { useGuestAuth } from '../hooks/useGuestAuth'
import { getGuestToken, removeCartItem } from '../services/api.js'

function formatItemDates(item) {
  const checkIn = item.checkIn || item.check_in
  const checkOut = item.checkOut || item.check_out
  if (checkIn && checkOut) return `${checkIn} → ${checkOut}`
  if (checkIn) return `From ${checkIn}`
  return 'Dates to confirm'
}

function itemKey(item, index) {
  return item.id || item.itemId || item.cartItemId || `cart-${index}`
}

export default function CartPage() {
  const { items, count, refresh } = useCart()
  const { isSignedIn } = useGuestAuth()
  const [removing, setRemoving] = useState(null)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

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

  return (
    <GuestChrome
      title="Your cart"
      lede="Review stays before checkout. Payments connect to Razorpay when the property goes live."
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

          {count === 0 ? (
            <div className="guest-empty">
              <p>Your cart is empty.</p>
              <p className="guest-empty-hint">
                Choose a room from Stay, pick dates, and add it here.
              </p>
              <Button as="a" href="#stay" variant="primary">
                Choose a stay
              </Button>
            </div>
          ) : (
            <ul className="guest-list">
              {items.map((item, index) => (
                <li className="guest-card" key={itemKey(item, index)}>
                  <div className="guest-card-body">
                    <p className="guest-card-index">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h2 className="guest-card-title">
                      {item.name || item.roomName || item.roomId || 'Stay'}
                    </h2>
                    <p className="guest-card-meta">{formatItemDates(item)}</p>
                    {(item.adults != null || item.guests != null) && (
                      <p className="guest-card-meta">
                        {item.adults ?? item.guests} guests
                      </p>
                    )}
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
          )}

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
              <p className="guest-checkout-note">
                Checkout unlocks when Razorpay is connected for this property.
              </p>
            </div>
          ) : null}
        </div>
      )}
    </GuestChrome>
  )
}
