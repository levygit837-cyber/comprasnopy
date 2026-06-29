# Viana Pharmacy — Palette

> The single, locked brand palette: **Herbal military-green** on a warm ivory
> canvas. The earlier 3-palette comparison (Emerald / Herbal / Clinical) has
> been retired after review; Herbal is the chosen system.

## Why Herbal

A deep, earthy military/forest green reads as authority, trust, and calm
without going neon (too energetic) or clinical-teal (too corporate/sterile).
On a warm ivory canvas (not pure white), it feels premium and human, the way a
neighborhood pharmacy should. This matches the Apple-esque minimalist
direction: confident color used sparingly, generous warm space around it.

## The ramp (the only place raw hex lives)

Defined in `src/styles/tokens.css` as `--brand-50` through `--brand-950`.

| Token | Hex | Use |
|-------|-----|-----|
| `--brand-50`  | `#f4f6ee` | Soft brand backgrounds, faint tints |
| `--brand-100` | `#e5ead2` | Hover washes, subtle fills |
| `--brand-200` | `#cdd5a8` | |
| `--brand-300` | `#adbb78` | |
| `--brand-400` | `#8ba24c` | |
| `--brand-500` | `#6c8531` | Mid brand |
| `--brand-600` | `#536e2c` | **PRIMARY brand** (buttons, links, marks) |
| `--brand-700` | `#425824` | Strong (hovers) |
| `--brand-800` | `#374820` | |
| `--brand-900` | `#2d3b1d` | Deep section gradient start |
| `--brand-950` | `#182110` | Deepest (footer, dark sections) |

## Surfaces, text, accent

| Role | Token | Value |
|------|-------|-------|
| Canvas | `--color-canvas` | `#fbfbf9` (warm ivory) |
| Surface | `--color-surface` | `#ffffff` |
| Surface muted | `--color-surface-muted` | `#f5f5f1` |
| Text | `--color-text` | `#1f2418` (warm near-black, never pure) |
| Text muted | `--color-text-muted` | `#5c5f55` |
| Hairline border | `--color-border` | `rgba(31,36,24,0.08)` |
| Accent (use sparingly) | `--color-accent` | `#b0822a` (deep amber/gold) |
| WhatsApp CTA | `--wa-green` | `#1fa37a` (brand-harmonized, not `#25d366`) |

## Rules

- Components consume **only** semantic tokens, never raw ramp hex.
- One accent only. The accent appears rarely, for emphasis (a stat, a chip),
  never as a competing brand color.
- WhatsApp green is desaturated toward the brand so the CTA stays part of the
  family instead of looking like a loud sticker.
- No section flips theme: the whole page is light ivory with green as the
  voice of authority. The footer and any deep section use the brand-950
  gradient, never an inverted white-on-green hero.

## Category tints

Each product category gets a desaturated wash background for its media:

| Tint | Token | Use |
|------|-------|-----|
| cool | `--tint-cool` | Medicamentos, Salud |
| warm | `--tint-warm` | Cuidado personal, Bebe |
| sage | `--tint-sage` | Higiene |

These live in the ramp section and are referenced by category in
`src/data/categories.ts`.
