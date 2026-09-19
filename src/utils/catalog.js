/**
 * Static room catalog until Vara rooms API is live.
 * Each entry is one bookable unit (matches inventory: 2 A-frames, 1 dorm, 4 rooms).
 */
export const STATIC_ROOMS = [
  {
    id: 'a-frame-1',
    roomId: 'kushal-a-frame-1',
    sku: 'kushal-a-frame',
    type: 'A-frame cabin',
    name: 'Porch A-frame Cabin',
    capacityMin: 1,
    capacityMax: 4,
    capacity: { minAdults: 1, maxAdults: 4, maxChildren: 0, maxTotal: 4 },
    summary:
      'Private peaked A-frame cabin by the Harangi water in Coorg, for up to four guests.',
  },
  {
    id: 'a-frame-2',
    roomId: 'kushal-a-frame-2',
    sku: 'kushal-a-frame',
    type: 'A-frame cabin',
    name: 'Deck A-frame Cabin',
    capacityMin: 1,
    capacityMax: 4,
    capacity: { minAdults: 1, maxAdults: 4, maxChildren: 0, maxTotal: 4 },
    summary:
      'Private peaked A-frame cabin by the Harangi water in Coorg, for up to four guests.',
  },
  {
    id: 'dorm-1',
    roomId: 'kushal-dorm-1',
    sku: 'kushal-dorm',
    type: 'Dormitory',
    name: 'Dormitory',
    capacityMin: 8,
    capacityMax: 16,
    capacity: { minAdults: 8, maxAdults: 16, maxChildren: 0, maxTotal: 16 },
    summary:
      'Shared dorm for groups - book from eight guests at minimum, up to sixteen at full house.',
  },
  {
    id: 'room-1',
    roomId: 'kushal-room-1',
    sku: 'kushal-room',
    type: 'Individual room',
    name: 'Individual room 1',
    capacityMin: 1,
    capacityMax: 4,
    capacity: { minAdults: 1, maxAdults: 4, maxChildren: 0, maxTotal: 4 },
    summary:
      'Quiet individual room for up to four - simple, restful, close to the river.',
  },
  {
    id: 'room-2',
    roomId: 'kushal-room-2',
    sku: 'kushal-room',
    type: 'Individual room',
    name: 'Individual room 2',
    capacityMin: 1,
    capacityMax: 4,
    capacity: { minAdults: 1, maxAdults: 4, maxChildren: 0, maxTotal: 4 },
    summary:
      'Quiet individual room for up to four - simple, restful, close to the river.',
  },
  {
    id: 'room-3',
    roomId: 'kushal-room-3',
    sku: 'kushal-room',
    type: 'Individual room',
    name: 'Individual room 3',
    capacityMin: 1,
    capacityMax: 4,
    capacity: { minAdults: 1, maxAdults: 4, maxChildren: 0, maxTotal: 4 },
    summary:
      'Quiet individual room for up to four - simple, restful, close to the river.',
  },
  {
    id: 'room-4',
    roomId: 'kushal-room-4',
    sku: 'kushal-room',
    type: 'Individual room',
    name: 'Individual room 4',
    capacityMin: 1,
    capacityMax: 4,
    capacity: { minAdults: 1, maxAdults: 4, maxChildren: 0, maxTotal: 4 },
    summary:
      'Quiet individual room for up to four - simple, restful, close to the river.',
  },
]

/** Inventory summary for marketing copy (not the bookable list). */
export const ROOM_INVENTORY_SUMMARY = [
  { label: 'A-frame cabins', units: 2, capacity: 'Up to 4 guests each' },
  { label: 'Dormitory', units: 1, capacity: '8-16 guests' },
  { label: 'Individual rooms', units: 4, capacity: 'Up to 4 guests each' },
]

export const GALLERY_ITEMS = [
  { id: 1, label: 'Morning mist', tone: '#2F6F74' },
  { id: 2, label: 'Backwater edge', tone: '#121A17' },
  { id: 3, label: 'A-frame porch', tone: '#1A2E2A' },
  { id: 4, label: 'River light', tone: '#3D8A90' },
  { id: 5, label: 'Evening table', tone: '#0B1210' },
  { id: 6, label: 'Path to water', tone: '#C24A32' },
]

export const REVIEWS = [
  {
    id: 1,
    quote:
      'It is really nice, surrounded by coffee and pepper plantation, with water flowing in the backyard. They serve really good food and the homestay is well maintained. A peaceful and refreshing stay for us.',
    name: 'Sachith.V. Reddy',
    detail: 'Guest review',
  },
  {
    id: 2,
    quote:
      'The place sits about 150 metres inside an 18-acre betel nut and pepper estate beside the backwaters. It is very well maintained, and the campfire was ready when we arrived. Mr. Lokesh was an amazing host who took our last-minute requests with a smile. Do not miss the early morning walk to the small private pond. Mist on the water was pure bliss.',
    name: 'Naveen B L',
    detail: 'Guest review',
  },
  {
    id: 3,
    quote:
      'Great location and an even better atmosphere. All basic amenities are available here. Perfect for a laid-back weekend, and the food is simply awesome with different varieties on different days.',
    name: 'GiRish PaaNdi',
    detail: 'Guest review',
  },
  {
    id: 4,
    quote:
      'Nice experience after a long time. We spent a really good time in Coorg, and this place made our trip easy to plan. We enjoyed the stay. Thanks Girish for your help and coordination. Hope to see you again.',
    name: 'sharath babu',
    detail: 'Guest review',
  },
  {
    id: 5,
    quote:
      'It was an amazing experience, from the place to the host and the food. A great spot to celebrate the new year. The host was cooperative and helpful throughout.',
    name: 'blue bird',
    detail: 'Guest review',
  },
]
