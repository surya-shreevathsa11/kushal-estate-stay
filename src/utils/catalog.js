/** Static room catalog until Vara rooms API is live for this property. */
export const STATIC_ROOMS = [
  {
    id: 'a-frame',
    sku: 'kushal-a-frame',
    name: 'A-frame cabin',
    count: 3,
    capacityMin: 1,
    capacityMax: 4,
    summary:
      'Three peaked A-frames set toward the water — each a private cabin for up to four.',
  },
  {
    id: 'dorm',
    sku: 'kushal-dorm',
    name: 'Dormitory',
    count: 1,
    capacityMin: 8,
    capacityMax: 16,
    summary:
      'One shared dorm for groups — from eight guests at minimum to sixteen at full house.',
  },
  {
    id: 'individual',
    sku: 'kushal-room',
    name: 'Individual room',
    count: 4,
    capacityMin: 1,
    capacityMax: 4,
    summary:
      'Four quiet rooms with space for up to four guests each — simple, restful, close to the river.',
  },
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
    quote: 'The dorm held our whole group without feeling crowded — evenings by the water were the highlight.',
    name: 'Vikram & friends',
    detail: 'Group stay · Dorm',
  },
  {
    id: 3,
    quote: ' Quiet rooms, kind hosts, and a landscape that asks you to slow down. We will return.',
    name: 'Meera S.',
    detail: 'Family · Individual room',
  },
]
