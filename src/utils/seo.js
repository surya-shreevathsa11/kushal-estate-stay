const SITE = {
  homeTitle: 'Kushal Estate Stay - Harangi river backwaters',
  homeDescription:
    'Kushal Estate Stay - a private homestay on the backwaters of the Harangi river. A-frame cabins, rooms, and a dorm for gatherings.',
  cartTitle: 'Cart - Kushal Estate Stay',
  bookingsTitle: 'My bookings - Kushal Estate Stay',
}

export function applyRouteSeo({ isCart = false, isMyBookings = false } = {}) {
  if (typeof document === 'undefined') return
  if (isCart) document.title = SITE.cartTitle
  else if (isMyBookings) document.title = SITE.bookingsTitle
  else document.title = SITE.homeTitle
}
