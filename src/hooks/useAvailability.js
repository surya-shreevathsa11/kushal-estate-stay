import { useEffect, useState } from 'react'
import { getRooms } from '../services/api.js'
import { STATIC_ROOMS } from '../utils/catalog.js'

/**
 * Prefer live Vara rooms; fall back to static catalog when API is offline.
 */
export function useAvailability() {
  const [rooms, setRooms] = useState(STATIC_ROOMS)
  const [source, setSource] = useState('static')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await getRooms()
        const list =
          data && typeof data === 'object' && Array.isArray(data.rooms)
            ? data.rooms
            : Array.isArray(data)
              ? data
              : null
        if (!cancelled && list?.length) {
          setRooms(list)
          setSource('api')
        }
      } catch {
        if (!cancelled) {
          setRooms(STATIC_ROOMS)
          setSource('static')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { rooms, source, loading }
}
