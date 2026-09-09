import { useCallback, useEffect, useState } from 'react'
import { REVIEWS } from '../utils/catalog'
import { useGsapStagger } from '../hooks/useGsapStagger'
import { prefersReducedMotion } from '../utils/video.js'

export default function Reviews() {
  const headRef = useGsapStagger(':scope > *')
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const review = REVIEWS[active]

  const go = useCallback((delta) => {
    setActive((index) => (index + delta + REVIEWS.length) % REVIEWS.length)
  }, [])

  useEffect(() => {
    if (paused || prefersReducedMotion()) return undefined
    const timer = window.setInterval(() => {
      setActive((index) => (index + 1) % REVIEWS.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [paused, active])

  return (
    <section className="reviews" id="reviews">
      <div className="shell">
        <div className="section-head" ref={headRef}>
          <p className="eyebrow">Reviews</p>
          <div className="rule" style={{ background: 'var(--color-sand)' }} />
          <h2>Words from recent stays.</h2>
          <p className="lede">
            Quiet mornings, long evenings, and the river in between - a few notes
            from guests who stayed with us.
          </p>
        </div>

        <div
          className="reviews-stage"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setPaused(false)
            }
          }}
        >
          <blockquote className="reviews-feature" key={review.id}>
            <span className="reviews-mark" aria-hidden="true">
              “
            </span>
            <p className="review-quote">{review.quote}</p>
            <footer className="review-meta">
              <strong>{review.name}</strong>
              <span>{review.detail}</span>
            </footer>
          </blockquote>

          <div className="reviews-controls">
            <button
              type="button"
              className="reviews-arrow"
              onClick={() => go(-1)}
              aria-label="Previous review"
            >
              ←
            </button>
            <div className="reviews-dots" role="tablist" aria-label="Guest reviews">
              {REVIEWS.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Show review by ${item.name}`}
                  className={`reviews-dot${index === active ? ' is-active' : ''}`}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
            <button
              type="button"
              className="reviews-arrow"
              onClick={() => go(1)}
              aria-label="Next review"
            >
              →
            </button>
          </div>

          <div className="reviews-rail" role="list">
            {REVIEWS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="listitem"
                className={`review-card${index === active ? ' is-active' : ''}`}
                onClick={() => setActive(index)}
                aria-pressed={index === active}
              >
                <span className="review-card-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="review-card-name">{item.name}</span>
                <span className="review-card-detail">{item.detail}</span>
                <span className="review-card-preview">“{item.quote}”</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
