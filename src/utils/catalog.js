/**
 * Static room catalog until Vara rooms API is live.
 * Each entry is one bookable unit (matches inventory: 3 A-frames, 1 dorm, 4 rooms).
 */
export const STATIC_ROOMS = [
  {
    id: 'a-frame-1',
    roomId: 'kushal-a-frame-1',
    sku: 'kushal-a-frame',
    type: 'A-frame cabin',
    name: 'A-frame cabin 1',
    capacityMin: 1,
    capacityMax: 4,
    capacity: { minAdults: 1, maxAdults: 4, maxChildren: 0, maxTotal: 4 },
    summary:
      'Peaked A-frame cabin toward the water - private stay for up to four guests.',
  },
  {
    id: 'a-frame-2',
    roomId: 'kushal-a-frame-2',
    sku: 'kushal-a-frame',
    type: 'A-frame cabin',
    name: 'A-frame cabin 2',
    capacityMin: 1,
    capacityMax: 4,
    capacity: { minAdults: 1, maxAdults: 4, maxChildren: 0, maxTotal: 4 },
    summary:
      'Peaked A-frame cabin toward the water - private stay for up to four guests.',
  },
  {
    id: 'a-frame-3',
    roomId: 'kushal-a-frame-3',
    sku: 'kushal-a-frame',
    type: 'A-frame cabin',
    name: 'A-frame cabin 3',
    capacityMin: 1,
    capacityMax: 4,
    capacity: { minAdults: 1, maxAdults: 4, maxChildren: 0, maxTotal: 4 },
    summary:
      'Peaked A-frame cabin toward the water - private stay for up to four guests.',
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
  { label: 'A-frame cabins', units: 3, capacity: 'Up to 4 guests each' },
  { label: 'Dormitory', units: 1, capacity: '8-16 guests' },
  { label: 'Individual rooms', units: 4, capacity: 'Up to 4 guests each' },
]

export const GALLERY_ITEMS = [
  { id: 1, label: 'Morning mist', tone: '#5B0E14' },
  { id: 2, label: 'Backwater edge', tone: '#1C1412' },
  { id: 3, label: 'A-frame porch', tone: '#5B0E14' },
  { id: 4, label: 'River light', tone: '#1C1412' },
  { id: 5, label: 'Evening table', tone: '#5B0E14' },
  { id: 6, label: 'Path to water', tone: '#1C1412' },
]

export const REVIEWS = [
  {
    id: 1,
    quote: 'We woke to mist on the Harangi and a stillness that made the city feel far away.',
    name: 'Ananya R.',
    detail: 'Weekend · A-frame',
  },
  {
    id: 2,
    quote: 'The dorm held our whole group without feeling crowded - evenings by the water were the highlight.',
    name: 'Vikram & friends',
    detail: 'Group stay · Dorm',
  },
  {
    id: 3,
    quote: 'Quiet rooms, kind hosts, and a landscape that asks you to slow down. We will return.',
    name: 'Meera S.',
    detail: 'Family · Individual room',
  },
]
