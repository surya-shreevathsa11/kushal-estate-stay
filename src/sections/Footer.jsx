import { Logo } from '../components/Logo'
import varaLogo from '../assets/vara-logo.png'

const WHATSAPP_HREF = 'https://wa.me/919481976321'
const VARA_INSTAGRAM_HREF =
  'https://www.instagram.com/vara.labs?stkn=OHJkNWVxZjUzdDRq&utm_source=qr'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="footer-brand">Kushal Estate Stay</p>
          <p className="footer-brand-copy">
            Kushal Estate Stay is a riverside homestay on the Harangi backwaters
            in Coorg, Karnataka. Book A-frame cabins, private rooms, or a dorm
            for your group.
          </p>
        </div>
        <div>
          <h3>Contact</h3>
          <ul>
            <li>
              <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">
                WhatsApp +91 94819 76321
              </a>
            </li>
            <li>Harangi backwaters · Coorg, Karnataka</li>
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
        <Logo />
        <a
          href={VARA_INSTAGRAM_HREF}
          className="footer-vara"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="VARA on Instagram"
        >
          <img
            src={varaLogo}
            alt="VARA Labs circular logo mark"
            className="footer-vara-mark"
            width="48"
            height="48"
          />
        </a>
        <p>© {new Date().getFullYear()} Kushal Estate Stay</p>
      </div>

      <a
        href={WHATSAPP_HREF}
        className="whatsapp-fab"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Kushal Estate Stay on WhatsApp"
      >
        <svg className="whatsapp-fab-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
          />
        </svg>
      </a>
    </footer>
  )
}
