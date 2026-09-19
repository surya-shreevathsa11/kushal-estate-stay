// Usage: npm run seed:rooms  (reads MONGODB_URI, DB_NAME, PROPERTY_ID from .env)
/* global process */
import mongoose from 'mongoose'
import { STATIC_ROOMS } from '../src/utils/catalog.js'

const PRICE_PER_NIGHT = 3000

// Vara Room model only accepts "Room" | "Dormitory".
const VARA_TYPE = {
  'A-frame cabin': 'Dormitory',
  Dormitory: 'Dormitory',
  'Individual room': 'Room',
}

const { MONGODB_URI, PROPERTY_ID, DB_NAME } = process.env
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI environment variable')
if (!PROPERTY_ID) throw new Error('Missing PROPERTY_ID environment variable')
if (!DB_NAME) throw new Error('Missing DB_NAME environment variable')

const docs = STATIC_ROOMS.map((r) => ({
  roomId: r.roomId,
  propertyId: PROPERTY_ID,
  name: r.name,
  type: VARA_TYPE[r.type],
  description: r.summary,
  pricePerNight: PRICE_PER_NIGHT,
  capacity: r.capacity,
}))

const bad = docs.filter((d) => !d.type)
if (bad.length) throw new Error(`No Vara type mapped for: ${bad.map((d) => d.roomId)}`)

try {
  await mongoose.connect(MONGODB_URI, { dbName: DB_NAME })
  // Raw collection: the Room model lives in the Vara backend, not this repo.
  const result = await mongoose.connection.collection('rooms').bulkWrite(
    docs.map((doc) => ({
      updateOne: {
        filter: { roomId: doc.roomId, propertyId: doc.propertyId },
        update: { $set: doc },
        upsert: true,
      },
    })),
  )
  console.log('Rooms seeded successfully', result)
} catch (error) {
  console.error('Failed to seed rooms:', error)
  process.exitCode = 1
} finally {
  await mongoose.disconnect()
}
