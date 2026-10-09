import { createPortal } from 'react-dom'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { useAvailability } from '../hooks/useAvailability'
import { useCart } from '../hooks/useCart'
import { useGsapStagger } from '../hooks/useGsapStagger'
import { useGuestAuth } from '../hooks/useGuestAuth'
import {
  addCartItem,
  getGuestToken,
  requestGuestQuote,
  requestPublicQuote,
} from '../services/api.js'
import { STATIC_ROOMS } from '../utils/catalog'

function formatCapacity(room) {
  const min = room.capacityMin ?? room.capacity?.minAdults ?? room.minGuests ?? 1
  const max =
    room.capacityMax ??
    room.capacity?.maxTotal ??
    room.capacity?.maxAdults ??
    room.maxGuests ??
    room.capacity
  if (min != null && max != null && Number(min) !== Number(max)) {
    return `${min}-${max} guests`
  }
  if (max != null) return `Up to ${max} guests`
  return 'Capacity TBC'
}

function roomKey(room) {
  return room.roomId ?? room.id ?? room.sku ?? room.name
}

function roomIdentity(room) {
  return String(room?.roomId ?? room?.id ?? room?.sku ?? '')
}

function roomPhotos(room) {
  const images = room?.images && typeof room.images === 'object' ? room.images : {}
  const banner = images.banner || room?.banner || room?.image || ''
  const gallery = Array.isArray(images.gallery) ? images.gallery : []
  return [...new Set([banner, ...gallery].filter(Boolean))]
}

function presentRoom(room) {
  const id = roomIdentity(room)
  if (id !== 'kushal-room-3' && id !== 'room-3') return room
  return {
    ...room,
    capacityMin: 1,
    capacityMax: 2,
    capacity: {
      ...(room.capacity && typeof room.capacity === 'object' ? room.capacity : {}),
      minAdults: 1,
      maxAdults: 2,
      maxChildren: 0,
      maxTotal: 2,
    },
    summary: 'Quiet individual room for two - simple, restful, close to the river.',
    description: 'Quiet individual room for two - simple, restful, close to the river.',
  }
}

function roomCapacityBounds(room) {
  const max = Math.max(
    1,
    Number(
      room.capacityMax ??
        room.capacity?.maxTotal ??
        room.capacity?.maxAdults ??
        room.maxGuests ??
        4,
    ) || 4,
  )
  const min = Math.min(
    max,
    Math.max(1, Number(room.capacityMin ?? room.capacity?.minAdults ?? 1) || 1),
  )
  return { min, max }
}

async function fetchStayQuote(payload, token) {
  if (token) {
    try {
      return await requestGuestQuote(payload, token)
    } catch {
      return requestPublicQuote(payload)
    }
  }
  return requestPublicQuote(payload)
}

function unwrapQuote(data) {
  if (data && typeof data === 'object' && data.data != null && typeof data.data === 'object') {
    return data.data
  }
  return data
}

function isQuoteUnavailable(quote) {
  if (!quote || typeof quote !== 'object') return false
  if (quote.available === false || quote.isAvailable === false) return true
  const s = String(quote.status ?? quote.availability ?? '').toLowerCase()
  return s === 'unavailable' || s === 'sold_out' || s === 'sold out' || s === 'full'
}

function RoomGallery({ room, open, onClose }) {
  const photos = roomPhotos(room)
  const [index, setIndex] = useState(0)
  const title = room?.name || room?.roomName || 'Stay'

  useEffect(() => {
    if (open) setIndex(0)
  }, [open, room])

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIndex((i) => (photos.length ? (i + 1) % photos.length : 0))
      if (e.key === 'ArrowLeft') {
        setIndex((i) => (photos.length ? (i - 1 + photos.length) % photos.length : 0))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, photos.length])

  if (!open || !room || !photos.length) return null

  const go = (delta) => {
    setIndex((i) => (i + delta + photos.length) % photos.length)
  }

  return createPortal(
    <div
      className="room-gallery-root"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="room-gallery"
        role="dialog"
        aria-modal="true"
        aria-label={`${title} photos`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <header className="room-gallery-bar">
          <div>
            <p className="room-gallery-kicker">Photos</p>
            <h2>{title}</h2>
          </div>
          <button type="button" className="room-gallery-close" onClick={onClose} aria-label="Close photos">
            ×
          </button>
        </header>
        <div className="room-gallery-stage">
          <img src={photos[index]} alt={`${title}, photo ${index + 1} of ${photos.length}`} />
          {photos.length > 1 ? (
            <>
              <button type="button" className="room-gallery-nav room-gallery-nav--prev" onClick={() => go(-1)} aria-label="Previous photo">
                ‹
              </button>
              <button type="button" className="room-gallery-nav room-gallery-nav--next" onClick={() => go(1)} aria-label="Next photo">
                ›
              </button>
            </>
          ) : null}
          <p className="room-gallery-count">
            {index + 1} / {photos.length}
          </p>
        </div>
        {photos.length > 1 ? (
          <div className="room-gallery-thumbs" role="tablist" aria-label="Room photos">
            {photos.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={i === index ? 'is-active' : undefined}
                onClick={() => setIndex(i)}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}

function StayBookingModal({ room, open, onClose }) {
  const { isSignedIn } = useGuestAuth()
  const { refresh } = useCart()
  const { min, max } = roomCapacityBounds(room || {})
  const roomId = room ? String(room.roomId ?? room.id ?? room.sku ?? '') : ''

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(String(Math.min(Math.max(min, 2), max)))
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')
  const [banner, setBanner] = useState('')
  const [bannerTone, setBannerTone] = useState('available')

  const guestsNum = Number(guests) || min
  const guestOptions = useMemo(() => {
    const opts = []
    for (let g = min; g <= max; g += 1) opts.push(g)
    return opts
  }, [min, max])

  useEffect(() => {
    if (!open || !room) return
    setGuests(String(Math.min(Math.max(min, 2), max)))
    setCheckIn('')
    setCheckOut('')
    setMessage('')
    setBanner('')
    setStatus('idle')
  }, [open, room, min, max])

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
    let cancelled = false
    if (!open || !isSignedIn || !roomId || !checkIn || !checkOut || checkIn >= checkOut) {
      setBanner('')
      return undefined
    }
    const token = getGuestToken()
    if (!token) return undefined

    const t = window.setTimeout(() => {
      void (async () => {
        setBannerTone('loading')
        setBanner('Checking availability for these dates…')
        try {
          const raw = await requestGuestQuote(
            {
              roomId,
              checkIn,
              checkOut,
              adults: guestsNum,
              children: 0,
            },
            token,
          )
          if (cancelled) return
          const quote = unwrapQuote(raw)
          if (isQuoteUnavailable(quote)) {
            setBannerTone('unavailable')
            setBanner('Not available for these dates. Try other dates or another stay type.')
          } else {
            setBannerTone('available')
            setBanner(
              quote?.message ||
                'These dates look available. You can add this stay to your cart.',
            )
          }
        } catch (err) {
          if (cancelled) return
          setBannerTone('unavailable')
          setBanner(err?.message || 'Could not check availability yet.')
        }
      })()
    }, 400)

    return () => {
      cancelled = true
      window.clearTimeout(t)
    }
  }, [open, isSignedIn, roomId, checkIn, checkOut, guestsNum])

  const checkAvailabilityAndAdd = async () => {
    setMessage('')
    if (!isSignedIn) {
      setStatus('error')
      setMessage('Sign in to add this stay to your cart.')
      window.dispatchEvent(new Event('open-guest-signin'))
      return
    }
    if (!checkIn || !checkOut) {
      setStatus('error')
      setMessage('Choose check-in and check-out dates.')
      return
    }
    if (checkIn >= checkOut) {
      setStatus('error')
      setMessage('Check-out must be after check-in.')
      return
    }

    const token = getGuestToken()
    if (!token) {
      setStatus('error')
      setMessage('Session missing. Please sign in again.')
      return
    }

    const stayPayload = {
      roomId,
      checkIn,
      checkOut,
      adults: guestsNum,
      children: 0,
    }

    setStatus('loading')
    try {
      await fetchStayQuote(stayPayload, token)
      await addCartItem(stayPayload, token)
      await refresh()
      window.dispatchEvent(new Event('cart-updated'))
      onClose()
    } catch (err) {
      setStatus('error')
      setMessage(
        err?.message ||
          'This stay is not available for the selected dates, or the request could not be completed. When the Vara property is live, booking will confirm here.',
      )
    } finally {
      setStatus('idle')
    }
  }

  if (!open || !room) return null

  const title = room.name || room.roomName || 'Stay'

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
        aria-labelledby="stay-booking-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="stay-booking-title">{title}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <p className="modal-lead">
          Choose dates and guests. We check availability with the estate before
          adding this stay to your cart.
        </p>
        <div className="booking-date-row">
          <label className="field">
            <span>Check-in</span>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </label>
          <label className="field">
            <span>Check-out</span>
            <input
              type="date"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </label>
        </div>
        <label className="field">
          <span>Guests</span>
          <select value={guests} onChange={(e) => setGuests(e.target.value)}>
            {guestOptions.map((n) => (
              <option key={n} value={String(n)}>
                {n}
              </option>
            ))}
          </select>
        </label>
        {banner ? (
          <p className={`availability-banner availability-banner--${bannerTone}`} role="status">
            {banner}
          </p>
        ) : null}
        <div className="modal-actions">
          <Button
            type="button"
            variant="primary"
            disabled={status === 'loading'}
            onClick={checkAvailabilityAndAdd}
          >
            {status === 'loading' ? 'Checking & adding…' : 'Check availability & add to cart'}
          </Button>
          <button type="button" className="modal-text-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
        {message ? (
          <p className={`form-status ${status === 'error' ? 'err' : 'ok'}`} role="status">
            {message}
          </p>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}

export default function Stay() {
  const headRef = useGsapStagger(':scope > *')
  const gridRef = useGsapStagger('.stay-card')
  const { rooms, source, loading } = useAvailability()
  const { isSignedIn } = useGuestAuth()
  const [bookingRoom, setBookingRoom] = useState(null)
  const [bookingKey, setBookingKey] = useState(0)
  const [galleryRoom, setGalleryRoom] = useState(null)
  const pendingRoomRef = useRef(null)

  const list = useMemo(() => {
    const raw = source === 'api' && rooms?.length ? rooms : STATIC_ROOMS
    return raw.map(presentRoom)
  }, [rooms, source])

  const openBooking = useCallback((room) => {
    setBookingKey((k) => k + 1)
    setBookingRoom(room)
  }, [])

  const onBookClick = useCallback(
    (room) => {
      if (!isSignedIn) {
        pendingRoomRef.current = room
        window.dispatchEvent(new Event('open-guest-signin'))
        return
      }
      openBooking(room)
    },
    [isSignedIn, openBooking],
  )

  useEffect(() => {
    const onAuthChanged = () => {
      const pending = pendingRoomRef.current
      if (!getGuestToken() || !pending) return
      pendingRoomRef.current = null
      openBooking(pending)
    }
    window.addEventListener('guest-auth-changed', onAuthChanged)
    return () => window.removeEventListener('guest-auth-changed', onAuthChanged)
  }, [openBooking])

  return (
    <section className="stay" id="stay">
      <div className="shell">
        <div className="section-head" ref={headRef}>
          <p className="eyebrow">Stay</p>
          <div className="rule" style={{ background: 'var(--color-sand)' }} />
          <h2>Choose your room.</h2>
          <p className="lede">
            At Kushal Estate Stay on the Harangi backwaters in Coorg, book an
            A-frame cabin by the water, a private room, or a dorm for the whole
            group. Pick your stay, set the dates, and add it to your cart.
          </p>
        </div>

        {loading ? <p className="stay-loading">Loading rooms…</p> : null}

        <div className="stay-grid" ref={gridRef}>
          {list.map((room, index) => {
            const typeLabel = room.type || room.sku || 'Stay'
            const photos = roomPhotos(room)
            const banner = photos[0]
            return (
              <article className="stay-card" key={roomKey(room) || index}>
                <button
                  type="button"
                  className="stay-card-media"
                  onClick={() => photos.length && setGalleryRoom(room)}
                  disabled={!photos.length}
                  aria-label={
                    photos.length
                      ? `View photos of ${room.name || room.roomName || 'this stay'}`
                      : undefined
                  }
                >
                  {banner ? (
                    <img className="stay-card-photo" src={banner} alt="" />
                  ) : null}
                  <span className="stay-card-index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </button>
                <div className="stay-card-body">
                  <p className="stay-card-type">{typeLabel}</p>
                  <h3>{room.name || room.roomName || `Room ${index + 1}`}</h3>
                  <p className="stay-card-copy">
                    {room.summary || room.description || 'Details coming soon.'}
                  </p>
                  <dl className="stay-card-facts">
                    <div>
                      <dt>Guests</dt>
                      <dd>{formatCapacity(room)}</dd>
                    </div>
                  </dl>
                  <Button
                    type="button"
                    variant="ghost"
                    className="stay-book-btn"
                    onClick={() => onBookClick(room)}
                  >
                    Check availability
                  </Button>
                </div>
              </article>
            )
          })}
        </div>
      </div>

      <RoomGallery room={galleryRoom} open={Boolean(galleryRoom)} onClose={() => setGalleryRoom(null)} />

      <StayBookingModal
        key={bookingKey}
        room={bookingRoom}
        open={Boolean(bookingRoom)}
        onClose={() => {
          setBookingRoom(null)
          pendingRoomRef.current = null
        }}
      />
    </section>
  )
}
