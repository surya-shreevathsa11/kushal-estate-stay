/**
 * Homestay map pin — Waterside Homestay / Kushal Estate Stay.
 * Place: https://www.google.com/maps/place/water+side+Home+stay/@12.49501,75.8194882
 */
export const HOMESTAY_LOCATION = {
  label: 'Kushal Estate Stay',
  region: 'Harangi river backwaters · Karnataka',
  note: 'Waterside Homestay on the Harangi backwaters.',
  lat: 12.49245,
  lng: 75.8225676,
  query: 'water side Home stay',
  mapsUrl:
    'https://www.google.com/maps/place/water+side+Home+stay/@12.49501,75.8194882,1285m/data=!3m1!1e3!4m9!3m8!1s0x3ba507e00b222ab5:0x4311802c9b52bfba!5m2!4m1!1i2!8m2!3d12.49245!4d75.8225676!16s%2Fg%2F11g0sst3p4?entry=ttu&g_ep=EgoyMDI2MDkxNi4wIKXMDSoASAFQAw%3D%3D',
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
