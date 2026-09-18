const SITE_ORIGIN = 'https://www.kushalestatestay.com'
const OG_IMAGE = `${SITE_ORIGIN}/kushalestatestay-share.jpeg`

const SITE = {
  homeTitle: 'Kushal Estate Stay | Harangi Backwaters — Karnataka, India',
  homeDescription:
    'Kushal Estate Stay on the Harangi backwaters in Karnataka—A-frame cabins, quiet rooms, and a dorm for gatherings. Slow stays between night water and hillside green.',
  cartTitle: 'Cart - Kushal Estate Stay',
  bookingsTitle: 'My bookings - Kushal Estate Stay',
  ogImage: OG_IMAGE,
  ogImageAlt:
    'Kushal Estate Stay—homestay on the Harangi river backwaters in Karnataka',
}

function setMeta(attr, key, value) {
  if (!value) return
  let el = document.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

export function applyRouteSeo({ isCart = false, isMyBookings = false } = {}) {
  if (typeof document === 'undefined') return

  let title = SITE.homeTitle
  let description = SITE.homeDescription
  if (isCart) {
    title = SITE.cartTitle
    description =
      'Review your stays at Kushal Estate Stay, then request to book. Pay after the estate approves.'
  } else if (isMyBookings) {
    title = SITE.bookingsTitle
    description =
      'Track booking requests, complete Razorpay payment after approval, and view confirmed stays.'
  }

  document.title = title
  setMeta('name', 'description', description)
  setMeta('property', 'og:title', title)
  setMeta('property', 'og:description', description)
  setMeta('property', 'og:image', SITE.ogImage)
  setMeta('property', 'og:image:alt', SITE.ogImageAlt)
  setMeta('property', 'og:url', `${SITE_ORIGIN}/`)
  setMeta('name', 'twitter:title', title)
  setMeta('name', 'twitter:description', description)
  setMeta('name', 'twitter:image', SITE.ogImage)
  setMeta('name', 'twitter:card', 'summary_large_image')
}
