/** @typedef {{ title: string, description: string, canonical: string, ogUrl: string, ogTitle: string, ogDescription: string, ogImageAlt: string }} SeoPayload */

const SITE_ORIGIN = 'https://www.kushalestatestay.com'
const BUSINESS_NAME = 'Kushal Estate Stay'
const OG_IMAGE = `${SITE_ORIGIN}/kushalestatestay-share.jpeg`
const BUSINESS_EMAIL = 'lokeshvinu1984@gmail.com'
const BUSINESS_PHONE = '+919481976321'

const BUSINESS_DESCRIPTION =
  'Kushal Estate Stay on the Harangi backwaters in Coorg. Coffee in the air, calm in the soul. Book A-frame cabins, private rooms, or a dorm for your group.'

/** Shared caption for OG / structured data (primary property image). */
const PRIMARY_IMAGE_CAPTION =
  'Kushal Estate Stay riverside homestay on the Harangi backwaters in Coorg, Karnataka'

const LODGING_JSON_LD_ID = 'kushal-estate-jsonld-lodging-business'
const FAQ_JSON_LD_ID = 'kushal-estate-jsonld-faq-page'
const WEBSITE_JSON_LD_ID = 'kushal-estate-jsonld-website'
const IMAGE_OBJECT_JSON_LD_ID = 'kushal-estate-jsonld-image-object'
const BREADCRUMB_JSON_LD_ID = 'kushal-estate-jsonld-breadcrumb-list'

/** @type {Record<string, unknown>} */
const LODGING_BUSINESS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: BUSINESS_NAME,
  description: BUSINESS_DESCRIPTION,
  url: `${SITE_ORIGIN}/`,
  image: [OG_IMAGE],
  telephone: BUSINESS_PHONE,
  email: BUSINESS_EMAIL,
  priceRange: '₹₹',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Near Harangi Backwaters',
    addressLocality: 'Suntikoppa',
    addressRegion: 'Karnataka',
    postalCode: '571237',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 12.49245,
    longitude: 75.8225676,
  },
  areaServed: {
    '@type': 'AdministrativeArea',
    name: 'Kodagu',
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Karnataka',
      containedInPlace: {
        '@type': 'Country',
        name: 'India',
      },
    },
  },
}

/** @type {Record<string, unknown>} */
const FAQ_PAGE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where is Kushal Estate Stay located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kushal Estate Stay is near the Harangi backwaters in Suntikoppa, Kodagu (Coorg), Karnataka, India (PIN 571237).',
      },
    },
    {
      '@type': 'Question',
      name: 'What type of stay is Kushal Estate Stay?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Kushal Estate Stay is a riverside homestay on the Harangi backwaters in Coorg with A-frame cabins, private rooms, and a dorm for groups.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I book a stay at Kushal Estate Stay?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'On this website, choose a stay, set your dates, add it to your cart, sign in with Google when asked, request to book, and complete Razorpay payment after the estate approves. You can also reach the property on WhatsApp at +91 94819 76321.',
      },
    },
  ],
}

/** @type {Record<string, unknown>} */
const WEB_SITE_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: BUSINESS_NAME,
  url: `${SITE_ORIGIN}/`,
  description: BUSINESS_DESCRIPTION,
  inLanguage: 'en-IN',
  publisher: {
    '@type': 'Organization',
    name: BUSINESS_NAME,
    url: `${SITE_ORIGIN}/`,
    logo: OG_IMAGE,
    email: BUSINESS_EMAIL,
    telephone: BUSINESS_PHONE,
  },
}

/** @type {Record<string, unknown>} */
const PROPERTY_IMAGE_OBJECT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'ImageObject',
  url: OG_IMAGE,
  contentUrl: OG_IMAGE,
  encodingFormat: 'image/jpeg',
  name: `${BUSINESS_NAME} primary property photograph`,
  caption: PRIMARY_IMAGE_CAPTION,
  copyrightHolder: {
    '@type': 'Organization',
    name: BUSINESS_NAME,
    url: `${SITE_ORIGIN}/`,
  },
}

/**
 * @param {{ isCart: boolean, isMyBookings: boolean }} routes
 * @returns {Record<string, unknown>}
 */
function getBreadcrumbJsonLd({ isCart, isMyBookings }) {
  if (isMyBookings) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_ORIGIN}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'My bookings',
          item: `${SITE_ORIGIN}/#my-bookings`,
        },
      ],
    }
  }
  if (isCart) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_ORIGIN}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Cart and checkout',
          item: `${SITE_ORIGIN}/#cart`,
        },
      ],
    }
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: BUSINESS_NAME,
        item: `${SITE_ORIGIN}/`,
      },
    ],
  }
}

const HOME = /** @type {SeoPayload} */ ({
  title: 'Kushal Estate Stay | Harangi Backwaters Homestay in Coorg, Karnataka',
  description:
    'Kushal Estate Stay on the Harangi backwaters in Coorg. Coffee in the air, calm in the soul. Book A-frame cabins, private rooms, or a dorm for your group.',
  canonical: `${SITE_ORIGIN}/`,
  ogUrl: `${SITE_ORIGIN}/`,
  ogTitle: 'Kushal Estate Stay | Harangi Backwaters Homestay in Coorg, Karnataka',
  ogDescription:
    'Kushal Estate Stay on the Harangi backwaters in Coorg. Coffee in the air, calm in the soul. Book A-frame cabins, private rooms, or a dorm for your group.',
  ogImageAlt: PRIMARY_IMAGE_CAPTION,
})

const MY_BOOKINGS = /** @type {SeoPayload} */ ({
  title: 'My bookings | Kushal Estate Stay | Coorg',
  description:
    'Track booking requests for Kushal Estate Stay on the Harangi backwaters in Coorg. Pay with Razorpay after approval and view confirmed stays.',
  canonical: `${SITE_ORIGIN}/`,
  ogUrl: `${SITE_ORIGIN}/`,
  ogTitle: 'My bookings | Kushal Estate Stay | Coorg',
  ogDescription:
    'Track booking requests for Kushal Estate Stay on the Harangi backwaters in Coorg. Pay with Razorpay after approval and view confirmed stays.',
  ogImageAlt: 'Kushal Estate Stay booking history for your Coorg stay',
})

const CART = /** @type {SeoPayload} */ ({
  title: 'Cart and checkout | Kushal Estate Stay | Coorg',
  description:
    'Review your cart at Kushal Estate Stay on the Harangi backwaters in Coorg. Request to book, then pay with Razorpay after the estate approves.',
  canonical: `${SITE_ORIGIN}/`,
  ogUrl: `${SITE_ORIGIN}/`,
  ogTitle: 'Cart and checkout | Kushal Estate Stay | Coorg',
  ogDescription:
    'Review your cart at Kushal Estate Stay on the Harangi backwaters in Coorg. Request to book, then pay with Razorpay after the estate approves.',
  ogImageAlt: 'Kushal Estate Stay booking checkout for your Coorg stay',
})

function setMetaAttribute(attrName, attrValue, content) {
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attrName, attrValue)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLinkCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]')
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * One JSON-LD `<script>` in `document.head` by stable id (homepage-only callers pass `false` to remove).
 * @param {string} elementId
 * @param {Record<string, unknown>} payload
 * @param {boolean} show
 */
function syncJsonLdInHead(elementId, payload, show) {
  const existing = document.getElementById(elementId)
  if (!show) {
    existing?.remove()
    return
  }
  const serialized = JSON.stringify(payload)
  if (existing) {
    existing.textContent = serialized
    return
  }
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = elementId
  script.textContent = serialized
  document.head.appendChild(script)
}

/**
 * Updates document-level SEO for the SPA route (home vs cart vs my bookings).
 * @param {{ isCart: boolean, isMyBookings?: boolean }} params
 */
export function applyRouteSeo({ isCart, isMyBookings = false }) {
  if (typeof document === 'undefined') return

  const p = isMyBookings ? MY_BOOKINGS : isCart ? CART : HOME
  const isHome = !isCart && !isMyBookings

  document.title = p.title

  setMetaAttribute('name', 'description', p.description)
  setLinkCanonical(p.canonical)

  setMetaAttribute('property', 'og:site_name', BUSINESS_NAME)
  setMetaAttribute('property', 'og:title', p.ogTitle)
  setMetaAttribute('property', 'og:description', p.ogDescription)
  setMetaAttribute('property', 'og:image', OG_IMAGE)
  setMetaAttribute('property', 'og:url', p.ogUrl)
  setMetaAttribute('property', 'og:type', 'website')
  setMetaAttribute('property', 'og:image:type', 'image/jpeg')
  setMetaAttribute('property', 'og:image:alt', p.ogImageAlt)

  setMetaAttribute('name', 'twitter:card', 'summary_large_image')
  setMetaAttribute('name', 'twitter:title', p.ogTitle)
  setMetaAttribute('name', 'twitter:description', p.ogDescription)
  setMetaAttribute('name', 'twitter:image', OG_IMAGE)

  syncJsonLdInHead(LODGING_JSON_LD_ID, LODGING_BUSINESS_JSON_LD, isHome)
  syncJsonLdInHead(FAQ_JSON_LD_ID, FAQ_PAGE_JSON_LD, isHome)
  syncJsonLdInHead(WEBSITE_JSON_LD_ID, WEB_SITE_JSON_LD, isHome)
  syncJsonLdInHead(IMAGE_OBJECT_JSON_LD_ID, PROPERTY_IMAGE_OBJECT_JSON_LD, isHome)
  syncJsonLdInHead(BREADCRUMB_JSON_LD_ID, getBreadcrumbJsonLd({ isCart, isMyBookings }), true)
}
