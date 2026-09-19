/**
 * Homestay map pin for Kushal Estate Stay on the Harangi backwaters.
 * Coords from the confirmed Google Maps place (name update applied for).
 */
export const HOMESTAY_LOCATION = {
  label: 'Kushal Estate Stay',
  region: 'Harangi river backwaters · Karnataka',
  note: 'Kushal Estate Stay on the Harangi backwaters.',
  lat: 12.49245,
  lng: 75.8225676,
  query: 'Kushal Estate Stay, Harangi, Coorg, Karnataka',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=12.49245%2C75.8225676',
}

export function getGoogleMapsUrl() {
  const { mapsUrl, lat, lng, query } = HOMESTAY_LOCATION
  if (mapsUrl) return mapsUrl
  if (typeof lat === 'number' && typeof lng === 'number') {
    return `https://www.google.com/maps/search/?api=1&query=${lat}%2C${lng}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function getGoogleMapsEmbedUrl() {
  const { lat, lng, query } = HOMESTAY_LOCATION
  const q =
    typeof lat === 'number' && typeof lng === 'number' ? `${lat},${lng}` : query
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`
}
