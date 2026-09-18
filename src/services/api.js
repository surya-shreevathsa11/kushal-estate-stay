import {
  PROPERTY_SLUG,
  apiFetch,
  guestAuthorizedFetch,
} from './varaGuestAuth.ts'

export function getRooms() {
  return apiFetch(`/api/public/properties/${PROPERTY_SLUG}/rooms`)
}

export function getSiteGallery() {
  return apiFetch(`/api/public/properties/${PROPERTY_SLUG}/site-gallery`)
}

export function getEvents() {
  return apiFetch(`/api/public/properties/${PROPERTY_SLUG}/events`)
}

export function requestPublicQuote(payload) {
  return apiFetch(`/api/public/properties/${PROPERTY_SLUG}/quote`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function requestGuestPin(payload) {
  return apiFetch('/api/guest-auth/request-pin', {
    method: 'POST',
    body: JSON.stringify({ propertySlug: PROPERTY_SLUG, ...payload }),
  })
}

export function verifyGuestPin(payload) {
  return apiFetch('/api/guest-auth/verify-pin', {
    method: 'POST',
    body: JSON.stringify({ propertySlug: PROPERTY_SLUG, ...payload }),
  })
}

export function requestGuestQuote(payload, token) {
  return guestAuthorizedFetch('/api/guest/bookings/quote', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getGuestRooms(token) {
  return guestAuthorizedFetch('/api/guest/bookings/rooms', token, {
    method: 'GET',
  })
}

export function getCart(token) {
  return guestAuthorizedFetch('/api/guest/bookings/cart', token, {
    method: 'GET',
  })
}

export function getGuestBookings(token) {
  return guestAuthorizedFetch('/api/guest/bookings', token, {
    method: 'GET',
  })
}

export function createBookingRequest(payload, token) {
  return guestAuthorizedFetch('/api/guest/bookings/requests', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function addCartItem(payload, token) {
  return guestAuthorizedFetch('/api/guest/bookings/cart/items', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function removeCartItem(payload, token) {
  return guestAuthorizedFetch('/api/guest/bookings/cart/items', token, {
    method: 'DELETE',
    body: JSON.stringify(payload),
  })
}

export function createGuestPaymentOrder(payload, token) {
  return guestAuthorizedFetch('/api/guest/payments/order', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function verifyGuestPayment(payload, token) {
  return guestAuthorizedFetch('/api/guest/payments/verify', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getGuestEventBookings(token) {
  return guestAuthorizedFetch('/api/guest/event-bookings', token, {
    method: 'GET',
  })
}

export function createEventBooking(payload, token) {
  return guestAuthorizedFetch('/api/guest/event-bookings', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function verifyEventPayment(payload, token) {
  return guestAuthorizedFetch('/api/guest/event-payments/verify', token, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export {
  ApiError,
  API_BASE_URL,
  PROPERTY_SLUG,
  GUEST_TOKEN_KEY,
  GUEST_PROFILE_KEY,
  getGuestToken,
  setGuestToken,
  clearGuestToken,
  getGuestProfile,
  setGuestProfile,
  clearGuestProfile,
  extractGuestAuthToken,
  extractGuestProfile,
  decodeGoogleCredentialProfile,
  exchangeGoogleCredential,
  getGoogleClientId,
} from './varaGuestAuth.ts'
