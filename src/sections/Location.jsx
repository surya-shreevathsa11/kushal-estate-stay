import { Button } from '../components/Button'
import { useGsapStagger } from '../hooks/useGsapStagger'
import {
  HOMESTAY_LOCATION,
  getGoogleMapsEmbedUrl,
  getGoogleMapsUrl,
} from '../utils/location'

export default function Location() {
  const layoutRef = useGsapStagger(':scope > *')
  const mapsUrl = getGoogleMapsUrl()
  const embedUrl = getGoogleMapsEmbedUrl()

  return (
    <section className="location" id="location">
      <div className="shell location-layout" ref={layoutRef}>
        <div className="location-copy">
          <p className="eyebrow">Location</p>
          <div className="rule" />
          <h2>Find us by the water.</h2>
          <p className="lede">
            On the Harangi backwaters in Karnataka. Tap the map for directions -
            the exact pin will be set once the location is confirmed.
          </p>
          <p className="location-region">{HOMESTAY_LOCATION.region}</p>
          <Button
            as="a"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            className="location-cta"
          >
            Open in Google Maps
          </Button>
        </div>

        <div className="location-map">
          <iframe
            title="Kushal Estate Stay on Google Maps"
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <a
            className="location-map-hit"
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Kushal Estate Stay in Google Maps"
          >
            <span className="location-map-chip">Open map</span>
          </a>
        </div>
      </div>
    </section>
  )
}
