import { useCallback, useEffect, useState } from 'react'
import { Button } from '../components/Button'
import { GuestChrome } from '../components/GuestChrome'
import { useGuestAuth } from '../hooks/useGuestAuth'
import {
  ApiError,
  createGuestPaymentOrder,
  getGuestBookings,
  getGuestToken,
  verifyGuestPayment,
} from '../services/api.js'
import {
  formatBookingDate,
  formatBookingDateTime,
  formatBookingRange,
  formatInr,
  formatStatusLabel,
  getBookingExpiresAt,
  getBookingId,
  getBookingStatusMessage,
  getPaymentOrderPayload,
  isBookingPayable,
  isPaymentWindowExpired,
  normalizeBookingStatus,
  unwrapBookingsList,
} from '../utils/bookings'
import { openRazorpayCheckout } from '../utils/razorpay'

function StatusBadge({ status }) {
  const slug = normalizeBookingStatus(status) || 'unknown'
  return (
    <span className={`booking-status-badge booking-status-badge--${slug}`}>
      {formatStatusLabel(status)}
    </span>
  )
}

function DetailRow({ label, value }) {
  if (value == null || value === '' || value === '—') return null
  return (
    <div className="booking-detail-row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function paymentErrorMessage(err) {
  const status = err instanceof ApiError ? err.status : err?.status
  const msg = err?.message || ''
  if (status === 410) {
    return (
      msg ||
      'Your payment window has expired. Please add the stay to your cart again and submit a new booking request.'
    )
  }
  if (status === 400) {
    return (
      msg ||
      'This booking is not ready for payment yet. Wait for estate approval, or check whether it was declined.'
    )
  }
  return msg || 'Payment could not be started.'
}

function BookingCard({ booking, onPaid }) {
  const bookingId = getBookingId(booking)
  const guest = booking?.guest || {}
  const rooms = Array.isArray(booking?.rooms) ? booking.rooms : []
  const status = normalizeBookingStatus(booking?.status)
  const statusMessage = getBookingStatusMessage(booking)
  const expiresAt = getBookingExpiresAt(booking)
  const payable = isBookingPayable(booking)
  const expiredApproved = status === 'approved' && isPaymentWindowExpired(booking)
  const [payBusy, setPayBusy] = useState(false)
  const [payError, setPayError] = useState('')
  const [paySuccess, setPaySuccess] = useState('')

  const title =
    booking?.name ||
    booking?.roomName ||
    rooms[0]?.roomName ||
    rooms[0]?.roomId ||
    booking?.roomId ||
    'Kushal Estate Stay'

  const startPayment = useCallback(async () => {
    const token = getGuestToken()
    if (!token) {
      setPayError('Please sign in again to continue.')
      return
    }
    const orderPayload = getPaymentOrderPayload(booking)
    if (!orderPayload) {
      setPayError('Booking reference missing. Please refresh and try again.')
      return
    }

    setPayBusy(true)
    setPayError('')
    setPaySuccess('')
    try {
      const orderRaw = await createGuestPaymentOrder(orderPayload, token)
      const payment = await openRazorpayCheckout(orderRaw, {
        name: guest.name,
        email: guest.email,
        phone: guest.phone,
      })
      await verifyGuestPayment(
        {
          razorpay_order_id: payment.razorpay_order_id,
          razorpay_payment_id: payment.razorpay_payment_id,
          razorpay_signature: payment.razorpay_signature,
        },
        token,
      )
      setPaySuccess('Payment received. Your booking is confirmed.')
      onPaid?.()
    } catch (err) {
      if (err?.message === 'Payment cancelled.') {
        setPayError('Payment was cancelled. You can try again before the deadline.')
      } else {
        setPayError(paymentErrorMessage(err))
      }
    } finally {
      setPayBusy(false)
    }
  }, [booking, guest.email, guest.name, guest.phone, onPaid])

  return (
    <li className="booking-card">
      <header className="booking-card-header">
        <div className="booking-card-heading">
          <StatusBadge status={booking?.status} />
          <h2 className="booking-card-title">{title}</h2>
        </div>
        <p className="booking-card-meta">
          {bookingId ? <span>Ref. {String(bookingId).slice(-8)}</span> : null}
          {booking?.createdAt ? (
            <span>Requested {formatBookingDateTime(booking.createdAt)}</span>
          ) : null}
        </p>
      </header>

      <p className="booking-card-range">{formatBookingRange(booking)}</p>

      {statusMessage ? (
        <p
          className={`booking-status-message booking-status-message--${status}${
            expiredApproved ? ' booking-status-message--expired' : ''
          }`}
          role="status"
        >
          {statusMessage}
        </p>
      ) : null}

      {status === 'approved' && expiresAt && !expiredApproved ? (
        <p className="booking-deadline">
          Pay by <strong>{formatBookingDateTime(expiresAt)}</strong>
        </p>
      ) : null}

      {(payable || expiredApproved || status === 'requested' || status === 'rejected') && (
        <div className="booking-pay-actions">
          {payable ? (
            <Button
              type="button"
              variant="primary"
              disabled={payBusy}
              onClick={() => void startPayment()}
            >
              {payBusy ? 'Opening payment…' : 'Complete payment'}
            </Button>
          ) : null}
          {status === 'requested' ? (
            <p className="booking-pay-hint">
              Payment unlocks after the estate approves this request.
            </p>
          ) : null}
          {status === 'rejected' ? (
            <p className="booking-pay-hint">This request was declined and cannot be paid.</p>
          ) : null}
          {expiredApproved ? (
            <p className="booking-pay-hint">
              Payment window closed.{' '}
              <a href="#cart">Return to cart</a> to submit a new request.
            </p>
          ) : null}
          {payError ? (
            <p className="checkout-form-message checkout-form-message--error" role="alert">
              {payError}
            </p>
          ) : null}
          {paySuccess ? (
            <p className="checkout-form-message checkout-form-message--ok" role="status">
              {paySuccess}
            </p>
          ) : null}
        </div>
      )}

      <dl className="booking-detail-grid">
        <DetailRow label="Guest" value={guest.name} />
        <DetailRow label="Email" value={guest.email} />
        <DetailRow label="Phone" value={guest.phone} />
        {rooms.map((room, index) => (
          <DetailRow
            key={`${room.roomId || room.roomName || 'room'}-${index}`}
            label={room.roomName || room.roomId || `Room ${index + 1}`}
            value={`${formatBookingDate(room.checkIn)} → ${formatBookingDate(room.checkOut)}${
              room.adults != null ? ` · ${room.adults} guests` : ''
            }`}
          />
        ))}
        <DetailRow label="Stay total" value={formatInr(booking?.totalAmount)} />
        <DetailRow
          label="Amount due"
          value={formatInr(booking?.expectedPrepaidAmount ?? booking?.amountDue)}
        />
        <DetailRow label="Amount paid" value={formatInr(booking?.amountPaid)} />
        {(status === 'approved' || status === 'confirmed') && expiresAt ? (
          <DetailRow label="Payment deadline" value={formatBookingDateTime(expiresAt)} />
        ) : null}
        {status === 'rejected' && booking?.rejectionReason ? (
          <DetailRow label="Reason" value={booking.rejectionReason} />
        ) : null}
      </dl>
    </li>
  )
}

export default function MyBookingsPage() {
  const { isSignedIn } = useGuestAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState('')

  const load = useCallback(async ({ silent = false } = {}) => {
    const token = getGuestToken()
    if (!token) {
      setBookings([])
      return
    }
    if (!silent) setLoading(true)
    setNote('')
    try {
      const data = await getGuestBookings(token)
      const list = unwrapBookingsList(data)
      setBookings(list)
      if (!list.length) {
        setNote('No bookings yet. Request a stay from your cart to get started.')
      }
    } catch (err) {
      setBookings([])
      setNote(
        err?.message ||
          'Bookings are not available for this property yet. Try again after the estate is live on Vara.',
      )
    } finally {
      if (!silent) setLoading(false)
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
      lede="Track requests, pay after approval with Razorpay, and keep confirmed stays in one place."
    >
      {!isSignedIn ? (
        <div className="guest-panel guest-panel--prompt">
          <p className="guest-panel-title">Sign in to see bookings</p>
          <p>
            Use Google to open your guest history — pending requests, payments, and
            confirmed stays.
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
            <ul className="booking-card-list">
              {bookings.map((booking, index) => (
                <BookingCard
                  key={getBookingId(booking) || `booking-${index}`}
                  booking={booking}
                  onPaid={() => void load({ silent: true })}
                />
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
