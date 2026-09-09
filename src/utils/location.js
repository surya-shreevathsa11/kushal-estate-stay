/**
 * Homestay map pin — update when the exact location is confirmed.
 * Prefer lat/lng when available; `query` is the Google Maps search fallback.
 */
export const HOMESTAY_LOCATION = {
  label: 'Kushal Estate Stay',
  region: 'Harangi river backwaters · Karnataka',
  note: 'Exact pin will be updated when the estate location is confirmed.',
  // Placeholder near Harangi reservoir until owners provide the final pin
  lat: 12.492,
  lng: 75.906,
  query: 'Harangi Backwaters, Karnataka',
}

export function getGoogleMapsUrl() {
  const { lat, lng, query } = HOMESTAY_LOCATION
  if (typeof lat === 'number' && typeof lng === 'number') {
    return `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function getGoogleMapsEmbedUrl() {
  const { lat, lng, query } = HOMESTAY_LOCATION
  const q =
    typeof lat === 'number' && typeof lng === 'number' ? `${lat},${lng}` : query
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=14&output=embed`
}
