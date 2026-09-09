import logo from '../assets/logo.svg'

export function Logo({ wordmark = true, inverted = false }) {
  return (
    <span className="logo-lockup" style={inverted ? { color: 'var(--color-sand)' } : undefined}>
      <img className="logo-mark" src={logo} alt="" width={38} height={38} />
      {wordmark ? <span className="logo-word">Kushal Estate Stay</span> : null}
    </span>
  )
}
