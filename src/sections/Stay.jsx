import { STATIC_ROOMS } from '../utils/catalog'
import { useGsapStagger } from '../hooks/useGsapStagger'
import { useAvailability } from '../hooks/useAvailability'

function formatCapacity(room) {
  const min = room.capacityMin ?? room.minGuests
  const max = room.capacityMax ?? room.maxGuests ?? room.capacity
  if (min != null && max != null && min !== max) {
    return `${min}–${max} guests`
  }
  if (max != null) return `Up to ${max} guests`
  return 'Capacity TBC'
}

export default function Stay() {
  const headRef = useGsapStagger(':scope > *')
  const listRef = useGsapStagger('.stay-item')
  const { rooms, source } = useAvailability()

  const list =
    source === 'api' && rooms?.length
      ? rooms
      : STATIC_ROOMS

  return (
    <section className="stay" id="stay">
      <div className="shell">
        <div className="section-head" ref={headRef}>
          <p className="eyebrow">Stay</p>
          <div className="rule" style={{ background: 'var(--color-sand)' }} />
          <h2>Rooms shaped around gathering.</h2>
          <p className="lede">
            Three ways to stay — cabins for couples and small families, rooms for
            quiet nights, and a dorm when the party is large.
          </p>
        </div>

        <div className="stay-list" ref={listRef}>
          {list.map((room) => (
            <article className="stay-item" key={room.id || room.sku || room.name}>
              <div className="stay-count" aria-hidden="true">
                {String(room.count ?? 1).padStart(2, '0')}
              </div>
              <div>
                <h3>{room.name}</h3>
                <p>{room.summary || room.description || 'Details coming soon.'}</p>
              </div>
              <p className="stay-meta">{formatCapacity(room)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
