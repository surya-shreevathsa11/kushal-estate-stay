import { useCallback, useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { GuestChrome } from '../components/GuestChrome'
import { useGuestAuth } from '../hooks/useGuestAuth'
import { getGuestBookings, getGuestToken } from '../services/api.js'

function bookingKey(booking, index) {
  return booking.id || booking.bookingId || `booking-${index}`
}

function formatRange(booking) {
  const checkIn = booking.checkIn || booking.check_in
  const checkOut = booking.checkOut || booking.check_out
  if (checkIn && checkOut) return `${checkIn} → ${checkOut}`
  if (checkIn) return checkIn
  return 'Dates pending'
}

export default function MyBookingsPage() {
  const { isSignedIn } = useGuestAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState('')

  const load = useCallback(async () => {
    const token = getGuestToken()
    if (!token) {
      setBookings([])
      return
    }
    setLoading(true)
    setNote('')
    try {
      const data = await getGuestBookings(token)
      const list = Array.isArray(data)
        ? data
        : data && Array.isArray(data.bookings)
          ? data.bookings
          : data && Array.isArray(data.data)
            ? data.data
            : []
      setBookings(list)
      if (!list.length) {
        setNote('No bookings yet. Add a stay from the Stay section to get started.')
      }
    } catch (err) {
      setBookings([])
      setNote(
        err?.message ||
          'Bookings are not available for this property yet. Try again after the estate is live on Vara.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

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

  return (
    <GuestChrome
      title="My bookings"
      lede="Your confirmed and pending stays with Kushal Estate Stay, loaded from your guest account."
    >
      {!isSignedIn ? (
        <div className="guest-panel guest-panel--prompt">
          <p className="guest-panel-title">Sign in to see bookings</p>
          <p>
            Use Google to open your guest history — past stays, upcoming dates, and
            status updates in one place.
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
              {loading
                ? 'Loading…'
                : `${bookings.length} ${bookings.length === 1 ? 'booking' : 'bookings'}`}
            </p>
            <button type="button" className="guest-text-btn" onClick={() => void load()}>
              Refresh
            </button>
          </div>

          {!loading && bookings.length === 0 ? (
            <div className="guest-empty">
              <p>{note || 'No bookings yet.'}</p>
              <Button as="a" href="#stay" variant="primary">
                Book a stay
              </Button>
            </div>
          ) : (
            <ul className="guest-list">
              {bookings.map((booking, index) => (
                <li className="guest-card" key={bookingKey(booking, index)}>
                  <div className="guest-card-body">
                    <p className="guest-card-index">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <p className="guest-card-status">
                      {booking.status || booking.state || 'Booking'}
                    </p>
                    <h2 className="guest-card-title">
                      {booking.name ||
                        booking.roomName ||
                        booking.roomId ||
                        'Kushal Estate Stay'}
                    </h2>
                    <p className="guest-card-meta">{formatRange(booking)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {note && bookings.length > 0 ? (
            <p className="guest-note" role="status">
              {note}
            </p>
          ) : null}

          <div className="guest-actions guest-actions--footer">
            <Button as="a" href="#cart" variant="ghost">
              View cart
            </Button>
            <Button as="a" href="#top" variant="primary">
              Back to home
            </Button>
          </div>
        </div>
      )}
    </GuestChrome>
  )
}
