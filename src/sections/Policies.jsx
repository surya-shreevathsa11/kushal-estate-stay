import { useState } from 'react'
import { useGsapStagger } from '../hooks/useGsapStagger'

/** Same estate terms as BB Estate Stay — shared copy for the public policies section. */
export const POLICY_SECTIONS = [
  {
    title: 'Check-in & Check-out',
    bullets: [
      <>
        Check-in from <strong>2:00 PM</strong>. Check-out by <strong>10:00 AM</strong>.
      </>,
    ],
  },
  {
    title: 'Booking & Payment',
    bullets: [
      <>
        Booking is confirmed with <strong>50%</strong> advance.
      </>,
      <>
        <strong>₹1,500</strong> per extra guest beyond your confirmed booking.
      </>,
      <>Only registered guests may stay.</>,
    ],
  },
  {
    title: 'Cancellation Policy',
    bullets: [
      <>
        If you cancel <strong>15+ days</strong> before check-in you receive a full refund;{' '}
        <strong>no refund</strong> after that.
      </>,
      <>Cancellations go through admin.</>,
    ],
  },
  {
    title: 'House rules & guest care',
    bullets: [
      <>You&apos;re responsible for any damage during your stay.</>,
      <>We&apos;re not liable for accidents, injury, or lost items.</>,
      <>Smoking is not permitted inside rooms or indoor areas.</>,
      <>Alcohol is permitted during your stay.</>,
      <>
        Quiet hours begin at <strong>10 PM</strong>.
      </>,
      <>Pets are not permitted on the estate.</>,
      <>
        Only children under <strong>5</strong> are considered as kids.
      </>,
    ],
  },
]

/** Flat checklist used in the cart “Request to book” terms step. */
export const CHECKOUT_TERMS_BULLETS = [
  '100% refund for cancellations made 15+ days before check-in. No refund after.',
  'Cancellation requests must be made through admin.',
  '₹1500 charged per additional guest beyond confirmed booking.',
  'Only registered guests are allowed on the property.',
  'Guests are responsible for any damages caused during their stay.',
  'Management is not liable for accidents, injuries, or loss of belongings.',
  'Check-in from 2:00 PM. Check-out by 10:00 AM.',
  'Smoking is not permitted inside rooms or indoor areas.',
  'Alcohol is permitted during your stay.',
  'No loud music or parties after 10 PM.',
  'Pets are not permitted on the estate.',
  'Children aged 5 and below are considered kids.',
]

export default function Policies() {
  const headRef = useGsapStagger(':scope > *')
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="policies" id="policies">
      <div className="shell policies-inner">
        <div className="section-head policies-head" ref={headRef}>
          <p className="chapter-label">Policies · 06</p>
          <h2>Terms &amp; conditions.</h2>
          <p className="lede">
            Clear house rules for a quiet stay on the Harangi — the same estate
            standards we ask every guest to honour.
          </p>
          <div className="rule" aria-hidden="true" />
        </div>

        <div className="policy-list">
          {POLICY_SECTIONS.map((section, index) => {
            const isOpen = openIndex === index
            const panelId = `policy-panel-${index}`
            const toggleId = `policy-toggle-${index}`
            return (
              <article
                key={section.title}
                className={`policy-item${isOpen ? ' is-open' : ''}`}
              >
                <button
                  type="button"
                  id={toggleId}
                  className="policy-item-toggle"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span className="policy-item-title">{section.title}</span>
                  <span className="policy-item-chevron" aria-hidden="true" />
                </button>
                <div
                  id={panelId}
                  className="policy-item-panel"
                  role="region"
                  aria-labelledby={toggleId}
                  aria-hidden={!isOpen}
                >
                  <ul className="policy-body-list">
                    {section.bullets.map((node, i) => (
                      <li key={i}>{node}</li>
                    ))}
                  </ul>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
