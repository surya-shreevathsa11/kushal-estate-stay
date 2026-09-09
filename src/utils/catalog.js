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
  { id: 1, label: 'Morning mist', tone: 'linear-gradient(145deg,#5B0E14,#1C1412 70%)' },
  { id: 2, label: 'Backwater edge', tone: 'linear-gradient(160deg,#3d1a1c,#F1E19455 90%)' },
  { id: 3, label: 'A-frame porch', tone: 'linear-gradient(120deg,#2a0a0e,#8a6a2a 85%)' },
  { id: 4, label: 'River light', tone: 'linear-gradient(200deg,#1C1412,#5B0E14 40%,#F1E19466)' },
  { id: 5, label: 'Evening table', tone: 'linear-gradient(135deg,#5B0E14 20%,#4a3820)' },
  { id: 6, label: 'Path to water', tone: 'linear-gradient(170deg,#241010,#F1E19444)' },
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
