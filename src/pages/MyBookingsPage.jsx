import { useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import { useGuestAuth } from '../hooks/useGuestAuth'
import { getGuestBookings, getGuestToken } from '../services/api.js'

export default function MyBookingsPage() {
  const { isSignedIn } = useGuestAuth()
  const [bookings, setBookings] = useState([])
  const [note, setNote] = useState('')

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const token = getGuestToken()
      if (!token) return
      try {
        const data = await getGuestBookings(token)
        const list = Array.isArray(data)
          ? data
          : data && Array.isArray(data.bookings)
            ? data.bookings
            : []
        if (!cancelled) setBookings(list)
      } catch {
        if (!cancelled) {
          setNote('Bookings API is not available yet for this property.')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isSignedIn])

  return (
    <div className="page-shell">
      <div className="shell">
        <a href="#top" className="logo-lockup" style={{ textDecoration: 'none' }}>
          <Logo />
        </a>
        <h1>My bookings</h1>
        <p className="lede">
          Guest booking history will load from Vara once authentication and the
          property slug are configured.
        </p>

        <div className="empty-state">
          {!isSignedIn ? (
            <p>Sign in as a guest to see your bookings.</p>
          ) : bookings.length === 0 ? (
            <p>{note || 'No bookings yet.'}</p>
          ) : (
            <ul>
              {bookings.map((b, i) => (
                <li key={b.id || i}>
                  {b.status || 'Booking'} · {b.checkIn || '-'} → {b.checkOut || '-'}
                </li>
              ))}
            </ul>
          )}
          <div style={{ marginTop: '1.25rem' }}>
            <Button as="a" href="#top" variant="primary">
              Back to home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
