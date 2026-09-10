import { Logo } from '../components/Logo'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="footer-brand">Kushal Estate Stay</p>
          <p className="footer-brand-copy">
            A private homestay on the backwaters of the Harangi river,
            Karnataka. Content and contact details will be updated by the owners.
          </p>
        </div>
        <div>
          <h3>Contact</h3>
          <ul>
            <li>
              <a href="mailto:hello@kushalestatestay.example">
                hello@kushalestatestay.example
              </a>
            </li>
            <li>
              <a href="tel:+910000000000">+91 00000 00000</a>
            </li>
            <li>Harangi river backwaters</li>
          </ul>
        </div>
        <div>
          <h3>Explore</h3>
          <ul>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#stay">Stay / Book</a>
            </li>
            <li>
              <a href="#gallery">Gallery</a>
            </li>
            <li>
              <a href="#reviews">Reviews</a>
            </li>
            <li>
              <a href="#location">Location</a>
            </li>
            <li>
              <a href="#my-bookings">My bookings</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="shell footer-bottom">
        <Logo wordmark />
        <p>© {new Date().getFullYear()} Kushal Estate Stay</p>
      </div>
    </footer>
  )
}
