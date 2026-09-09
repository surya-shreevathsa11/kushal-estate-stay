# Kushal Estate Stay

Marketing and booking frontend for **Kushal Estate Stay** — a homestay on the backwaters of the Harangi river (Karnataka).

## Stack

- React 19 + Vite
- Plain CSS (design tokens: Golden Sand `#F1E194`, Deep Burgundy `#5B0E14`, River Ink `#1C1412`)
- Typography: Cormorant Garamond + Source Sans 3 (aligned with [vistas.estate](https://vistas.estate/))
- Motion: Lenis smooth scroll, CSS reveal / hero entrance (GSAP available for later polish)
- Hash routes: home, `#cart`, `#my-bookings`

## Develop

```bash
cp .env.example .env
npm install
npm run dev
```

Place the drone hero file at `public/drone-hero.mp4`. Until then, the hero uses an atmospheric fallback.

Replace `src/assets/logo.svg` and gallery placeholders when final brand assets arrive.

## Content (editable later)

| Stay type | Inventory | Capacity |
|-----------|-----------|----------|
| A-frame cabins | 3 | max 4 each |
| Dormitory | 1 | min 8 · max 16 |
| Individual rooms | 4 | max 4 each |

Static catalog: `src/utils/catalog.js`.

## Backend (Sathwik)

This repo is **frontend only**. Booking, auth, cart, and payments talk to the **Vara** API — same contract as other Vara property sites.

### Env

See `.env.example`:

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | API host (empty + Vite proxy → `localhost:3000`) |
| `VITE_PROPERTY_SLUG` | Default `kushal-estate-stay` |
| `VITE_GOOGLE_CLIENT_ID` | Guest Google sign-in |
| `VITE_RAZORPAY_KEY_ID` | Checkout |

### Endpoints expected

- `GET /api/public/properties/{slug}/rooms`
- `POST /api/public/properties/{slug}/quote`
- `POST /api/guest-auth/request-pin` · `verify-pin` · `google`
- `GET/POST/DELETE /api/guest/bookings/cart` (+ `/items`)
- `GET /api/guest/bookings`
- `POST /api/guest/payments/order` · `verify`

Client: `src/services/api.js` + `src/services/varaGuestAuth.ts`.

### Suggested Vara room SKUs

- `kushal-a-frame` (×3)
- `kushal-dorm` (×1)
- `kushal-room` (×4)

Until the property is live, rooms fall back to the static catalog and the booking form shows a graceful offline message.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local Vite server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npm run lint` | ESLint |

## License

Private client project unless otherwise agreed.
