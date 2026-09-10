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
            <dd>Karnataka</dd>
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
          <h2>We began with the water.</h2>
        </div>

        <div className="about-copy">
          <p className="lede">
            Kushal Estate Stay sits on the backwaters of the Harangi — still water,
            hillside green, and evenings that refuse to hurry.
          </p>
          <p>
            The estate is made for unhurried stays: A-frame cabins toward the view,
            quiet individual rooms, and a dorm when the whole group wants to arrive
            together. Architecture stays low and regional; the river keeps the last
            word.
          </p>
          <p className="aphorism">
            If it doesn’t belong to the landscape, we don’t force it.
          </p>
        </div>
      </div>
    </section>
  )
}
