import { useGsapStagger } from '../hooks/useGsapStagger'

export default function About() {
  const ref = useGsapStagger(':scope > *')

  return (
    <section className="about" id="about">
      <div className="shell about-grid" ref={ref}>
        <div className="about-panel" aria-hidden="true">
          <p className="about-panel-caption">
            Where the river slows, the stay begins.
          </p>
        </div>
        <div className="about-copy">
          <div className="section-head">
            <p className="eyebrow">About</p>
            <div className="rule" />
            <h2>We began with the water.</h2>
          </div>
          <p className="lede">
            Kushal Estate Stay sits on the backwaters of the Harangi - a stretch
            of still water, hillside green, and long evenings. Placeholder copy
            for now; the story of the land will be refined with the family.
          </p>
          <p>
            The estate is made for unhurried stays: A-frame cabins toward the
            view, quiet individual rooms, and a dorm when the whole group wants
            to arrive together. Architecture stays low and regional; the river
            keeps the last word.
          </p>
          <p className="aphorism">
            “If it doesn’t belong to the landscape, we don’t force it.”
          </p>
        </div>
      </div>
    </section>
  )
}
