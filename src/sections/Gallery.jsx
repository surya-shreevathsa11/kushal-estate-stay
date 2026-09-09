import { GALLERY_ITEMS } from '../utils/catalog'
import { useReveal } from '../hooks/useReveal'

export default function Gallery() {
  const ref = useReveal()
  const loop = [...GALLERY_ITEMS, ...GALLERY_ITEMS]

  return (
    <section className="gallery" id="gallery">
      <div className="shell">
        <div className="section-head reveal" ref={ref}>
          <p className="eyebrow">Gallery</p>
          <div className="rule" />
          <h2>Light on water, wood, and path.</h2>
          <p className="lede">
            Photography will replace these frames. For now, a moving strip of the
            estate’s colour — sand, burgundy, and river ink.
          </p>
        </div>
      </div>

      <div className="gallery-track" aria-label="Gallery preview">
        {loop.map((item, index) => (
          <figure className="gallery-frame" key={`${item.id}-${index}`}>
            <div className="swatch" style={{ backgroundImage: item.tone }} />
            <figcaption>{item.label}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
