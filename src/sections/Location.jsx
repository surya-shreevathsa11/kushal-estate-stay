import { Button } from '../components/Button'
import {
  HOMESTAY_LOCATION,
  getGoogleMapsEmbedUrl,
  getGoogleMapsUrl,
} from '../utils/location'

export default function Location() {
  const mapsUrl = getGoogleMapsUrl()
  const embedUrl = getGoogleMapsEmbedUrl()

  return (
    <section className="location" id="location">
      <div className="location-map" aria-hidden="false">
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
        />
      </div>

      <div className="location-rail">
        <p className="chapter-label">Location · 05</p>
        <h2>Find us by the water.</h2>
        <p className="lede">
          On the Harangi backwaters in Karnataka. Open the map for directions to
          Kushal Estate Stay.
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
    </section>
  )
}
