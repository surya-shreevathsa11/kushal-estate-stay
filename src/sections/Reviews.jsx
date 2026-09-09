import { REVIEWS } from '../utils/catalog'
import { useGsapStagger } from '../hooks/useGsapStagger'

export default function Reviews() {
  const headRef = useGsapStagger(':scope > *')
  const railRef = useGsapStagger('.review-card')

  return (
    <section className="reviews" id="reviews">
      <div className="shell">
        <div className="section-head" ref={headRef}>
          <p className="eyebrow">Reviews</p>
          <div className="rule" />
          <h2>Words from recent stays.</h2>
          <p className="lede">
            Placeholder guest notes — replace with real reviews when you have
            them.
          </p>
        </div>

        <div className="reviews-rail" ref={railRef}>
          {REVIEWS.map((review) => (
            <blockquote className="review-card" key={review.id}>
              <p className="review-quote">“{review.quote}”</p>
              <footer className="review-meta">
                <strong>{review.name}</strong>
                {review.detail}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
