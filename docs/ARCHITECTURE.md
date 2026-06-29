# Viana Pharmacy — Architecture

> Source of truth for the technical design of the Viana pharmacy store
> (Paraguay). Trilingual ES / PT / EN, catalog + WhatsApp checkout.

## 1. Product vision

A Paraguayan pharmacy storefront. Users browse a product catalog (filter,
search, sort) and every purchase path resolves to **WhatsApp** — there is no
in-site cart or payment gateway. The owner operates the sales conversation
over WhatsApp; the website's job is to present products and route intent.

- **Audience**: Paraguay (Spanish primary), with Portuguese and English
  secondary for cross-border shoppers in Ciudad del Este / border traffic.
- **Currency**: Guaraní (₲, PYG) — no minor units.
- **Checkout model**: each product CTA builds a prefilled WhatsApp message
  (`wa.me/<number>?text=...`) and opens the chat.

## 2. Tech stack

| Layer        | Choice       | Why                                                 |
|--------------|--------------|-----------------------------------------------------|
| Framework    | **Astro**    | Static-first, component-based, excellent SEO. Product catalog renders to static HTML; minimal JS for interactivity. |
| Styling      | **Design tokens** (CSS custom properties) | Single source of truth for the 3 candidate palettes; switchable live in the prototype, fixed at build in production. |
| i18n         | Translation dictionary + `lang` attribute | Trilingual without the weight of a full i18n framework. |
| Data         | TS/JSON modules | Products, categories, translations as plain data files — no DB needed for the catalog. |
| Checkout     | WhatsApp deep links | `wa.me` with prefilled text — zero backend. |
| Deploy       | Static host (Vercel / Netlify / Cloudflare Pages) | Fits Astro's static output. |

> The current `prototype/` directory is a **no-build HTML/CSS/JS** preview so
> the owner can pick a palette before the Astro build is scaffolded. It mirrors
> `src/data/*` inline (see §5 — Data flow). Once the palette is locked, the
> Astro build is created and `prototype/` content is ported into Astro
> components; the inline data is dropped in favor of the TS modules.

## 3. Repository layout

```
viana/
├── docs/                       # Planning & spec docs
│   ├── ARCHITECTURE.md         # ← this file
│   ├── PALETTES.md             # 3 green palettes side-by-side
│   └── AIDESIGNER_PROMPT.md    # prompt for the AiDesigner visual pass
├── src/
│   ├── data/
│   │   ├── config.ts           # store info, WhatsApp number, currency, waLink()
│   │   ├── categories.ts       # 5 product categories (trilingual)
│   │   ├── products.ts         # ~28 products (trilingual, PYG prices)
│   │   └── translations.ts     # UI strings ES/PT/EN + t()/tpl()
│   └── styles/
│       └── tokens.css          # design tokens (color ramps, type, spacing…)
├── prototype/                  # no-build preview (palette picker lives here)
│   ├── index.html
│   ├── styles.css              # @imports tokens.css; themes via data-palette
│   └── app.js                  # state + i18n + catalog + WhatsApp links
└── README.md
```

When the Astro build is scaffolded, this grows to roughly:

```
src/
├── components/   ProductCard, FilterBar, Hero, Header, Footer…
├── layouts/      BaseLayout (sets <html lang>, data-palette)
├── pages/        index (landing), catalog/[category], product/[id], about
└── data/, styles/  (unchanged)
```

## 4. Design tokens — the theming core

`src/styles/tokens.css` defines three dark-green palettes. Switching the root
attribute re-derives every semantic token, so the entire UI re-themes:

```html
<html data-palette="emerald">   <!-- or "herbal" | "clinical" -->
```

Token layers:

1. **Global** — typography, spacing, radius, shadow, motion (palette-independent).
2. **Palette ramps** — `--brand-50…950` + `--accent` per palette (only place
   raw hex lives).
3. **Semantic** — `--color-bg`, `--color-text`, `--color-brand`… what components
   consume.

> Rule: components reference **only** semantic tokens. Raw palette hex never
> appears in component CSS. Adding a palette = one block in `tokens.css`.

The three candidate palettes are documented in [`PALETTES.md`](./PALETTES.md).

## 5. Data flow

```
src/data/*.ts  ──(Astro import)──▶  Astro components  ──▶  static HTML
       │
       └──(mirrored inline)──▶  prototype/app.js  ──▶  rendered DOM
```

- **Production (Astro)**: components `import { products } from "@/data/products"`.
  Product cards render at build time; client JS only handles filter/search UX.
- **Prototype (no-build)**: `prototype/app.js` keeps an inline copy of the same
  data so the file opens directly in a browser with no server. The two must
  stay in sync until the Astro build replaces the prototype.

### Product shape

```ts
interface Product {
  id: string;
  name:   Record<"es"|"pt"|"en", string>;
  desc:   Record<"es"|"pt"|"en", string>;
  price: number;        // PYG, no minor units
  oldPrice?: number;    // present ⇒ on offer
  category: string;     // → categories[].id
  icon: string;         // emoji stand-in → real photo in Astro build
  featured?: boolean;
  tint?: "light"|"warm"|"cool";
}
```

## 6. i18n strategy

- `translations.ts` keys every UI string by id, with ES / PT / EN values.
- `t(key, lang)` looks up; `tpl(key, lang, vars)` interpolates `{placeholders}`.
- The `<html lang>` attribute drives selection; a language toggle persists to
  `localStorage`.
- Product/catalog copy is **per-product**, not in the UI dictionary.
- Default language: **Spanish** (`es`).

## 7. WhatsApp integration

A single config constant holds the number:

```ts
// src/data/config.ts
whatsappNumber: "595XXXXXXXXX"   // placeholder — replace with the real number
```

`waLink(message)` returns `https://wa.me/<number>?text=<encoded>`. Two message
templates:

| Use             | Key                 | Example                                                              |
|-----------------|---------------------|----------------------------------------------------------------------|
| Product CTA     | `waProductMessage`  | `Hola! Quiero consultar sobre: Paracetamol (₲12.000). ¿Disponible?` |
| Generic contact | `waGenericMessage`  | `Hola Farmacia Viana! Quisiera hacer una consulta.`                  |

The product template is filled with the localized name + formatted PYG price.

## 8. Currency formatting

Guaraní has **no minor units** (no cents). `formatPrice(valuePYG, lang)` uses
`Intl.NumberFormat` with `maximumFractionDigits: 0` and locale `es-PY` /
`pt-PY` / `en-PY`. Symbol: **₲**.

## 9. Responsibilities split (prototype vs. production)

| Concern                | Prototype (`prototype/`)        | Production (`src/` Astro)         |
|------------------------|---------------------------------|-----------------------------------|
| Data                   | inline mirror in `app.js`       | `import` from `src/data/*`        |
| Routing                | single page, anchor nav         | real routes per page/category     |
| Rendering              | client-side JS                  | build-time static HTML            |
| Palette                | switchable live (owner review)  | fixed at build (chosen palette)   |
| Product imagery        | emoji                           | real product photos               |
| Language               | switchable live                 | switchable (or per-route)         |

## 10. Open decisions (resolved by owner)

- [ ] **Palette** — pick one of emerald / herbal / clinical from the prototype.
- [ ] **WhatsApp number** — replace the placeholder.
- [ ] (Later) Real product photos + full catalog beyond the sample 28.
- [ ] (Later) Astro scaffold + deploy target.
