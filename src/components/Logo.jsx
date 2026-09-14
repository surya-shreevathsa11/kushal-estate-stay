import logo from '../assets/logo.svg'

/**
 * Icon-only brand mark (illustration without wordmark text).
 * `wordmark` optionally renders the site name beside the mark.
 */
export function Logo({ wordmark = true, inverted = false }) {
  return (
    <span
      className={`logo-lockup${inverted ? ' logo-lockup--inverted' : ''}`}
      aria-label="Kushal Estate Stay"
    >
      <img className="logo-mark" src={logo} alt="" width={160} height={68} />
      {wordmark ? <span className="logo-word">Kushal Estate Stay</span> : null}
    </span>
  )
}
