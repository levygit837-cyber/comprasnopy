# Compraspy — Tokens Extracted from the Dark Prototype

> **Source of truth**: `prototype/index.html` ("Ultra-premium European Apothecary").
> Every color value below is mapped to a token in `src/styles/tokens.css`. The
> prototype is the documented source; the token system is the canonical
> implementation. **Components consume only semantic tokens — raw hex lives in
> `tokens.css` §2 (Color ramp).**

This palette **replaces** the earlier ivory Herbal system (`PALETTES.md`,
`ARCHITECTURE.md` §4/§10 are now stale on color and will be reconciled when
those docs are revised).

---

## 1. Color values extracted

### Greens — the canvas of authority and calm

| Prototype value | Where (file:line) | Tailwind name | Token |
|---|---|---|---|
| `#151f15` | `index.html:451` footer bg | — (arbitrary) | `--green-950` |
| `#1b261b` | `index.html:342` apothecary section | `bg-[#1b261b]` | `--green-900` |
| `#1E2B1E` | `index.html:32` (config `brand.dark`), `:56-57` (body) | `bg-brand-dark` | `--green-850` ← **PRIMARY canvas** |
| `#223022` | `index.html:365,380,395,410,496` product media | `bg-[#223022]` | `--green-800` |
| `#2D3A2D` | `index.html:33` (config `brand.surface`), `:87` glass panel | `bg-brand-surface` | `--green-700` |

Derived (not literal in prototype, but needed for hover/lift states):
`--green-600 #35452f`, `--green-500 #3d5036`.

### Copper — the single warm accent (used sparingly)

| Prototype value | Where (file:line) | Tailwind name | Token |
|---|---|---|---|
| `#C4956A` | `index.html:34` (config `brand.accent`), `:63-64` selection | `bg-brand-accent` / `text-brand-accent` | `--copper-500` ← **PRIMARY accent** |
| `#D4A574` | `index.html:35` (config `brand.accentHov`) | `hover:bg-brand-accentHov` | `--copper-400` |

Derived: `--copper-600 #b88559` (pressed), `--copper-300 #e0b78d` (lifted).

### Bone — text scale on the dark canvas

| Prototype value | Where (file:line) | Tailwind name | Token |
|---|---|---|---|
| `#F3F2EE` | `index.html:36` (config `brand.text`), `:57` (body color) | `text-brand-text` | `--bone-100` ← **PRIMARY text** |
| `#A3ACA3` | `index.html:37` (config `brand.muted`) | `text-brand-muted` | `--bone-400` ← muted/sage text |

Derived: `--bone-200 #e2e1db`, `--bone-300 #c8c8c2`, `--bone-500 #7d847a`.

### Glass / overlay / shadow tints

| Prototype value | Where (file:line) | Token |
|---|---|---|
| `rgba(30, 43, 30, 0.7)` | `index.html:79` `.glass-nav` bg | `--glass-nav-bg` |
| `rgba(243, 242, 238, 0.05)` | `index.html:82` `.glass-nav` border | `--color-border` |
| `rgba(255,255,255,0.02)` | `index.html:83` `.glass-nav` inset | `--shadow-inset-hairline` |
| `rgba(45, 58, 45, 0.4)` | `index.html:87` `.glass-panel` bg | `--glass-panel-bg` / `--color-surface-soft` |
| `rgba(196, 149, 106, 0.15)` | `index.html:89` `.glass-panel` border | `--color-accent-soft` |
| `rgba(30,43,30,1)` | `index.html:499` drawer inset shadow | `--shadow-inset-green` |
| `bg-black/60` → `rgba(0,0,0,0.6)` | `index.html:486` modal backdrop | `--overlay-modal` |
| `bg-black/10` → `rgba(0,0,0,0.10)` | `index.html:263` image tint | `--overlay-tint` |

### WhatsApp

| Value | Source | Token |
|---|---|---|
| `#1fa37a` | brand-harmonized (not prototype literal; carried from prior system) | `--wa-green` |
| `#178967` | darker variant | `--wa-green-dark` |

---

## 2. Typography extracted

| Role | Prototype | Token |
|---|---|---|
| Sans / UI | Outfit (Google Fonts, `index.html:12,41`) weights 300/400/500/600 | `--font-sans` |
| Serif / editorial | Playfair Display (Google Fonts, `index.html:12,42`) 400/500/600 + italic 400 | `--font-serif` |

Type-scale extensions (not in the standard ramp; used by the hero):
- `lg:text-[9rem]` (`index.html:221`) → `--text-8xl` (9rem)
- `lg:text-[7rem]` (`index.html:222` italic "The") → `--text-display` (7rem)
- `md:text-8xl` → `--text-7xl` (6rem)

Tracking:
- `tracking-[0.2em]` eyebrows → `--tracking-eyebrow`
- `tracking-[0.3em]` section eyebrows → `--tracking-widest`

> Fonts will be self-hosted in the Astro build via `@fontsource/outfit` and
> `@fontsource/playfair-display` (no Google CDN at runtime).

---

## 3. Motion extracted

| Prototype value | Where (file:line) | Token |
|---|---|---|
| `cubic-bezier(0.16, 1, 0.3, 1)` | `index.html:45` config `expo` | `--ease-expo` |
| `cubic-bezier(0.175, 0.885, 0.32, 1.275)` | `index.html:46` config `spring` | `--ease-spring` |
| `duration-1000` (image hover) | `index.html:207...` | `--dur-hero` (1000ms) |
| `1.2s` reveal transition | `index.html:123` | `--dur-reveal` (1200ms) |
| `0.4s ease` modal opacity | `index.html:135` | `--dur-modal` (400ms) |
| `0.6s expo` drawer translateX | `index.html:143` | `--dur-drawer` (600ms) |

Keyframes (moved to `src/styles/global.css`): `float`, `float-slow`,
`float-reverse` (`index.html:102-113`).

---

## 4. Layout extracted

| Prototype value | Token |
|---|---|
| `max-w-[1400px]` container (`index.html:178...`) | `--container-max` |
| `max-w-5xl` hero content (`index.html:217`) | `--hero-content-max` (64rem) |
| `h-20` nav (`index.html:177`) | `--nav-h` (5rem) |
| `px-6` / `lg:px-12` padding | `--container-pad` / `--container-pad-lg` |
| noise opacity `0.03` (`index.html:73`) | `--noise-opacity` |

---

## 5. Structural tokens retained (unchanged from prior system)

Kept verbatim because the prototype relies on Tailwind's defaults that match
these scales, and they are palette-independent:

- 4px-base spacing scale (`--space-0 … --space-40`)
- Radius system (`--radius-sm … --radius-full`) — prototype is mostly sharp; only buttons/pills use `--radius-full`
- Type scale `--text-xs … --text-6xl` (extended upward in §2)

---

## 6. Migration note (palette switch)

This extraction **supersedes** the prior ivory Herbal palette documented in
`PALETTES.md` and `ARCHITECTURE.md`. The page is now dark military-green with
copper accent — an inverted treatment relative to the prior "light ivory canvas"
direction. When reconciling those docs:

- `PALETTES.md`: replace the Herbal ramp with the green/copper/bone ramp above.
- `ARCHITECTURE.md` §4 ("Design tokens core"): the 3-layer discipline still holds; only the ramp values change.
- `ARCHITECTURE.md` §10 ("Open decisions"): palette is now **resolved** — dark prototype.
- `README.md`: remove the 3-palette switcher reference (already gone from code).
