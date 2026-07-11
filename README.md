# Viana Marketplace

Production Next.js + Supabase build of the Viana retail pharmacy storefront
for Paraguay. Visual target lives in
[`design/farmacia-viana-home.html`](design/farmacia-viana-home.html).

## Stack

- [Next.js 15](https://nextjs.org) (App Router, React 19, TypeScript strict)
- [Tailwind CSS v4](https://tailwindcss.com) with custom Viana design tokens
- [Radix UI](https://radix-ui.com) primitives (Dialog, Popover, RadioGroup, Slider)
- [@phosphor-icons/react](https://phosphoricons.com)
- [Zustand](https://zustand-demo.pmnd.rs) for cart state (persisted to localStorage)
- [Supabase](https://supabase.com) for auth, profiles, and Postgres data
- [Vitest](https://vitest.dev) for unit tests

## Routes

- `/` — landing page (hero carousel, marquee, bento categories, best sellers, first-buy guide)
- `/products` — catalog with category, price, and deals filters + smart search
- `/products/[slug]` — shareable SEO product detail page
- `/account/sign-in`, `/account/sign-up`, `/account` — Supabase Auth flow

## Cart

Cart lives in a Zustand store, persisted to `localStorage` under `viana.cart.v1`.
The "Complete order on WhatsApp" button builds a `https://wa.me/<number>?text=...`
deep link with all lines, the active currency, and the running total.

## Currency

Canonical prices are stored in USD on each product. Display values are derived
at render time from the user's selected currency (USD / BRL / PYG) using the
exchange rates in `src/lib/store.ts`. The currency preference is persisted to
`localStorage` under `viana.currency.v1`.

## Develop

```bash
cp .env.example .env.local      # fill Supabase + store values
npm install
npm run dev                     # http://localhost:3000
npm run build                   # production build
npm run test                    # unit tests
npm run typecheck               # tsc --noEmit
npm run lint                    # next lint
```

## Project layout

```
src/
  app/                Next App Router pages
    account/          sign-in / sign-up / profile
    products/         catalog + [slug] detail
    layout.tsx        root layout (providers)
    globals.css       Tailwind v4 + design tokens
  components/
    auth/             auth form + account shell
    cart/             cart store UI (button, drawer, hydrator)
    home/             landing-page sections
    layout/           announcement bar, header, footer
    products/         product card, drawer, browser, detail view
    search/           smart-search dropdown
    ui/               language + currency switchers
  lib/
    supabase/         browser + server clients
    cart-store.ts     Zustand store + WhatsApp message builder
    categories.ts     6 product categories
    currency-context.tsx
    images.ts         product -> /images/products/<stem>.png resolver
    language-context.tsx
    products.ts       full catalog (~78 SKUs)
    search.ts         token + trigram + synonym index
    store.ts          currency rates, store config, formatters
    translations.ts   ES / PT / EN UI strings
    variants.ts       variant-family grouping
    utils.ts          cn() helper
public/
  images/products/    background-removed product cutouts
design/               farmacia-viana-home.html (visual reference)
docs/                 ARCHITECTURE, PALETTES, catalog notes
scripts/              remove-backgrounds.py
```

## Supabase setup

The schema lives in `supabase/migrations/`. To finish wiring the backend:

1. Create a Supabase project and copy the URL and **publishable key**
   (`sb_publishable_...`) into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL`
   and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. Apply the migrations in order (`supabase/migrations/0001_init.sql`,
   then `supabase/seed.sql`). The init migration creates `profiles`,
   `categories`, `products`, `product_images`, `exchange_rates`, `orders`,
   and `order_lines`, plus the `handle_new_user()` trigger that mirrors
   `raw_user_meta_data` into a `profiles` row on signup.
3. In **Authentication -> Providers -> Email**, toggle **Confirm email**
   off. The storefront signs users in immediately after registration, so
   the email-verification round trip is undesirable; the auth-popover
   submit handler also falls back to a `signInWithPassword` if a
   confirmation step ever sneaks back in. Run this once after enabling
   auth to confirm any pre-existing users waiting on the flow:
   `update auth.users set email_confirmed_at = coalesce(email_confirmed_at, now()) where email_confirmed_at is null;`
4. Add the production site URL to **Authentication -> URL Configuration**
   so the password-reset email links back to the right origin.

The current build renders entirely from the local catalog at
`src/lib/products.ts` so the UI works end-to-end before the database is
wired up. To switch to Supabase data, replace the static `products`
import in catalog components with a server fetch.

## Future implementation decisions

The approved future direction for the Hostinger domain and professional email,
email marketing, WhatsApp sales intelligence, customer segmentation, and
personalized messaging is documented in
[`docs/FUTURE_IMPLEMENTATION_DECISIONS.md`](docs/FUTURE_IMPLEMENTATION_DECISIONS.md).
These capabilities are planned decisions and are not implemented in the current
build.
