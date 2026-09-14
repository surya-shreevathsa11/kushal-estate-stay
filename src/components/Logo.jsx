import logo from '../assets/logo.png'

/** Exact brand mark — no recolor, no baked-in wordmark text. */
export function Logo({ wordmark = false, inverted = false }) {
  return (
    <span
      className={`logo-lockup${inverted ? ' logo-lockup--inverted' : ''}`}
      aria-label="Kushal Estate Stay"
    >
      <img className="logo-mark" src={logo} alt="" width={120} height={120} />
      {wordmark ? <span className="logo-word">Kushal Estate Stay</span> : null}
    </span>
  )
}
