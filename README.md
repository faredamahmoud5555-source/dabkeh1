# DABKEH | دبكة: Lebanese restaurant website (Alexandria)

Black-and-white, bilingual (English / Arabic) restaurant site with a working cart that sends the **complete order**
to WhatsApp. Next.js App Router, JavaScript/JSX, CSS Modules, `lucide-react`. No backend, no database.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

Node.js 20.9+.

### IMPORTANT: opening the dev server from your phone

If you test `npm run dev` from a phone or another computer (`http://192.168.x.x:3000`), Next.js 16 **blocks the dev
JavaScript** for any host other than `localhost`. The page still renders, but React never starts, so **Add to Cart,
search, language switch and every other button do nothing** (plain links still work). That is the "buttons don't
work" symptom. Fix: add your address to `allowedDevOrigins` in `next.config.mjs` (the common home-network ranges
`192.168.*.*`, `10.*.*.*`, `172.*.*.*` are already listed) and **restart** `npm run dev`. It does not affect
`npm run build && npm start`, which works from any address.

## Routes

| Route | What |
| --- | --- |
| `/` | Home: hero with your photo, intro, featured dishes, find us, delivery |
| `/menu` | Bilingual menu: categories, search (both languages), Add to Cart |
| `/cart` | Cart + checkout + WhatsApp send + "did you send it?" confirmation |
| `/location` | Address, interactive Google map, GET DIRECTIONS |

The cart icon in the navbar is a real link to `/cart`. The quick-cart drawer (opened from the "View order" bar on
`/menu`) and `/cart` share one cart (`context/CartContext.jsx`).

## Things to fill in

| What | Where |
| --- | --- |
| WhatsApp numbers (currently `01098911548` and `01515495886`) | `config/restaurant.js` -> `whatsappNumbers` |
| Opening hours, delivery time (hidden until filled) | `config/restaurant.js` -> `delivery` |
| Instagram / Facebook links (hidden until filled) | `config/restaurant.js` -> `social` |
| Any dishes missing from the printed menu pages you photographed | `data/menu.js` |

## Language (English / Arabic)

- Switcher in the navbar (and inside the mobile menu). The choice is saved in `localStorage`; first visit follows the
  browser language. `<html lang dir>` flips to `ar` / `rtl` before the first paint.
- UI text: `data/translations.js` (`en` and `ar` keys must match). Brand text: `config/*.js` as `{ en, ar }`.
  Menu: `data/menu.js` as `{ en, ar }`. Use `const { t, pick, lang } = useLanguage()` in components.
- The cart lives in a separate context, so switching language keeps the cart.
- Prices look the same in both languages (`120 EGP`).
- The WhatsApp message is written in the language the customer is using.
- Arabic text: Amiri (headings) and Noto Sans Arabic (text), letter-spacing off so letters still join.

## Menu (`data/menu.js`)

The site contains **only the printed menu**: 52 dishes in 5 sections (Lebanese Mezze / Appetizers 11, Fatteh 6, Manakish
25, Breakfast 7, Drinks 3), with the English and Arabic names as printed. There are no sample dishes and no other
categories.

- **Prices:** `price` in `data/menu.js` is the price PRINTED on the menu. Customers see
  `printed price x menu.priceMultiplier` (`config/restaurant.js`, currently **1.14** = printed price + 14%), rounded to
  2 decimals (e.g. 120 -> 136.80 EGP). Set `priceMultiplier: 1` to show the printed prices. The cart, the totals and the
  WhatsApp message all use the multiplied price.
- **Descriptions:** the printed menu has none, so none are shown. Draft descriptions (not from the restaurant, unchecked)
  are in `data/menuDescriptions.js` and appear only if `menu.showDescriptions` is `true`.
- **Adding a dish:** add one line to `printedItems` (`id`, `category`, `name: { en, ar }`, printed `price`). `id` must be
  unique and stable (the cart saves ids). Add a section by adding a category to `categories`.

## Location (`config/location.js`)

The map uses the **exact pin from the owner's Google Maps link** (`https://maps.app.goo.gl/Sm3i6Lw9ubRCgb8f8`, which
resolves to `31.1967927, 29.9024443`). Those coordinates drive the embedded map and marker, the GET DIRECTIONS link
and the placeholder-free state; the share link is used by OPEN IN GOOGLE MAPS. To move the pin, change
`coordinates` and `googleMapsUrl`. If `coordinates` are removed, the map falls back to searching the written address.

## WhatsApp ordering

1. Add dishes -> `/cart` -> **PROCEED TO ORDER** -> name, phone, address, optional notes, choose WhatsApp number 1 or 2.
2. **SEND ORDER VIA WHATSAPP** builds the message from the real cart and form data and opens
   `https://wa.me/<chosen number>?text=<encodeURIComponent(message)>`. It never navigates inside the site.
3. The page then asks **"Did you send your order?"**. The cart is cleared only if the customer answers yes. The
   pending order is saved, so the question comes back after a reload.

Message code: `lib/whatsapp.js` (`buildOrderMessage`, `buildWhatsAppUrl`, `openWhatsApp`).

The floating WhatsApp button: with items in the cart (or a pending order) it goes to `/cart`; with an empty cart it
opens a small chooser with the two numbers (a greeting only, never an order). It is hidden on `/cart`.

### Limitation

A `wa.me` link only opens a chat with a prefilled message. **The site cannot know whether the customer pressed
Send or whether the restaurant received it.** "Yes, I sent it" relies on the customer's word. The order reference
(e.g. `DBK-261031-K7Q2`) is a label created in the browser: not stored anywhere, not verified, not a confirmation.

## Photos

`dabke-entrance.jpg` (hero), `dabke-chalkboard.jpg` (intro) and `dabke-storefront.jpg` (find us, location) are the owner's photos,
cropped only to remove the empty bars of the original screenshots (the storefront photo is only resized). They are displayed at their own proportions
(the hero frame has exactly the photo's 9:16 ratio), so nothing is stretched. No stock or generated images.

## Design system (quick reference)

- **Wordmark:** `components/home/Hero.jsx`: `DABKEH | دبكة` lockup, always laid out left-to-right (Latin, hairline, Arabic) in both
  languages. Its size comes from the width of its column (`--mark` in `Hero.module.css`), so it scales from 320px to 1920px.
- **Palette / type:** tokens at the top of `app/globals.css`. Instrument Serif (display), Hanken Grotesk (text), Amiri and
  Noto Sans Arabic (Arabic). Buttons (`.btn`, `.btn-outline`, `.on-dark`) and their hover, pressed and focus states live in
  `globals.css`; use them instead of re-styling buttons per component.
- **Menu:** dishes are grouped under category headings (`MenuBrowser`); only the category chips stay pinned.
- **Cart / checkout:** `OrderFlow` is used by both the drawer and `/cart`. On `/cart` the summary card (with the
  WhatsApp button) sits beside the list or form on desktop, and below it on phones.
- **Location:** `components/LocationView.jsx`. Map states: loading, loaded, "could not load" (after 9s), "tap to use the
  map" (touch screens only) and a placeholder when `config/location.js` has no address or coordinates.
- **Motion:** every animation is disabled by `prefers-reduced-motion`.

## Structure

```
app/            layout.js, template.js (page fade), globals.css, page.js, menu/, cart/, location/
components/     Navbar, LanguageSwitcher, FloatingActions, Footer, OrderFlow (cart+checkout), CartDrawer,
                CheckoutForm, MenuBrowser, MenuItem, CategoryFilter, LocationView, home/*
context/        CartContext.jsx, LanguageContext.jsx
config/         restaurant.js, location.js
data/           menu.js, translations.js
lib/            whatsapp.js, currency.js, validation.js, order.js, maps.js, i18n.js, langStore.js, storage.js, year.js
```

`next.config.mjs` keeps the Cache Components defaults of `create-next-app` (server components must not read the clock
during render; the footer year uses `"use cache"`).
