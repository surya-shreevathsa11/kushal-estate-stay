import { useGsapStagger } from '../hooks/useGsapStagger'
import { HOMESTAY_LOCATION } from '../utils/location'

export default function About() {
  const ref = useGsapStagger(':scope > *')

  return (
    <section className="about" id="about">
      <div className="shell about-grid" ref={ref}>
        <dl className="about-meta" aria-label="Place details">
          <div className="about-meta-item">
            <dt>Chapter</dt>
            <dd>01 · Land</dd>
          </div>
          <div className="about-meta-item">
            <dt>River</dt>
            <dd>Harangi</dd>
          </div>
          <div className="about-meta-item">
            <dt>Region</dt>
            <dd>Coorg · Karnataka</dd>
          </div>
          <div className="about-meta-item">
            <dt>Coords</dt>
            <dd>
              {HOMESTAY_LOCATION.lat.toFixed(2)} / {HOMESTAY_LOCATION.lng.toFixed(2)}
            </dd>
          </div>
        </dl>

        <div className="about-statement">
          <p className="chapter-label">About</p>
          <h2>A Coorg stay by the Harangi.</h2>
        </div>

        <div className="about-copy">
          <p className="lede">
            Kushal Estate Stay is our riverside homestay at Waterside Homestay on
            the Harangi backwaters in Coorg (Kodagu), Karnataka. Mornings often
            start with coffee in the air and a quiet stretch of water outside.
          </p>
          <p>
            Come for a calm break from the city: A-frame cabins facing the view,
            private rooms for smaller stays, and a dorm when the whole group
            arrives together. Book the dates that fit, then settle into the
            river pace.
          </p>
          <p className="aphorism">Coffee in the air, calm in the soul.</p>
        </div>
      </div>
    </section>
  )
}
