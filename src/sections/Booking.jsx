import { useState } from 'react'
import { Button } from '../components/Button'
import { useBooking } from '../hooks/useBooking'
import { useReveal } from '../hooks/useReveal'
import { STATIC_ROOMS } from '../utils/catalog'

const initial = {
  name: '',
  email: '',
  checkIn: '',
  checkOut: '',
  guests: '2',
  roomType: STATIC_ROOMS[0].sku,
  notes: '',
}

export default function Booking() {
  const ref = useReveal()
  const { status, message, submitEnquiry } = useBooking()
  const [form, setForm] = useState(initial)

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    await submitEnquiry({
      guestName: form.name,
      email: form.email,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      guests: Number(form.guests) || 1,
      roomSku: form.roomType,
      notes: form.notes,
      source: 'kushal-estate-stay-web',
    })
  }

  return (
    <section className="booking" id="booking">
      <div className="shell booking-layout">
        <div className="reveal" ref={ref}>
          <div className="section-head">
            <p className="eyebrow">Booking</p>
            <div className="rule" />
            <h2>Come and walk the land.</h2>
          </div>
          <p className="lede">
            Share dates and how you wish to stay. When the Vara API is live,
            this form requests a quote automatically. Until then, we still
            collect your enquiry and point you to direct contact.
          </p>
        </div>

        <form className="booking-form reveal reveal-delay-1" onSubmit={onSubmit}>
          <div className="booking-row two">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                required
                autoComplete="name"
                value={form.name}
                onChange={onChange}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="booking-row two">
            <div className="field">
              <label htmlFor="checkIn">Check-in</label>
              <input
                id="checkIn"
                name="checkIn"
                type="date"
                required
                value={form.checkIn}
                onChange={onChange}
              />
            </div>
            <div className="field">
              <label htmlFor="checkOut">Check-out</label>
              <input
                id="checkOut"
                name="checkOut"
                type="date"
                required
                value={form.checkOut}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="booking-row two">
            <div className="field">
              <label htmlFor="guests">Guests</label>
              <input
                id="guests"
                name="guests"
                type="number"
                min="1"
                max="16"
                required
                value={form.guests}
                onChange={onChange}
              />
            </div>
            <div className="field">
              <label htmlFor="roomType">Stay type</label>
              <select
                id="roomType"
                name="roomType"
                value={form.roomType}
                onChange={onChange}
              >
                {STATIC_ROOMS.map((room) => (
                  <option key={room.sku} value={room.sku}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              placeholder="Occasion, arrival time, dietary needs…"
              value={form.notes}
              onChange={onChange}
            />
          </div>

          {message ? (
            <p
              className={`form-status ${status === 'success' ? 'ok' : 'err'}`}
              role="status"
            >
              {message}
            </p>
          ) : (
            <p className="form-note">
              Payments and cart checkout will be enabled once Sathwik connects
              the Vara property.
            </p>
          )}

          <Button type="submit" variant="ink" disabled={status === 'loading'}>
            {status === 'loading' ? 'Sending…' : 'Request availability'}
          </Button>
        </form>
      </div>
    </section>
  )
}
