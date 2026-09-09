import { Button } from '../components/Button'
import { Logo } from '../components/Logo'
import { useCart } from '../hooks/useCart'
import { useGuestAuth } from '../hooks/useGuestAuth'

export default function CartPage() {
  const { items, count, refresh } = useCart()
  const { isSignedIn } = useGuestAuth()

  return (
    <div className="page-shell">
      <div className="shell">
        <a href="#top" className="logo-lockup" style={{ textDecoration: 'none' }}>
          <Logo />
        </a>
        <h1>Your cart</h1>
        <p className="lede">
          Cart checkout will connect to Vara + Razorpay when the property is
          live. This page is ready for Sathwik to wire payments.
        </p>

        <div className="empty-state">
          {!isSignedIn ? (
            <p>
              Sign-in (email PIN / Google) will unlock the guest cart. Guest auth
              hooks are already in place.
            </p>
          ) : count === 0 ? (
            <p>Your cart is empty. Choose a stay from the home page when booking opens.</p>
          ) : (
            <ul>
              {items.map((item, index) => (
                <li key={item.id || index}>
                  {item.name || item.roomName || 'Stay item'} -{' '}
                  {item.checkIn || 'dates TBC'}
                </li>
              ))}
            </ul>
          )}
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Button as="a" href="#top" variant="primary">
              Back to home
            </Button>
            <Button type="button" variant="ink" onClick={() => refresh()}>
              Refresh cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
