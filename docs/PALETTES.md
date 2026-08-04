# Compraspy — Palette

> The brand system uses a restrained burnt orange on warm ivory in light mode,
> and orange light over neutral black and charcoal surfaces in dark mode.

## Direction

Orange communicates movement, accessibility, and the energy of cross-border
commerce. The selected ramp stays burnt rather than neon so the marketplace
continues to feel premium and trustworthy. Neutral surfaces carry most of the
interface; orange is reserved for brand voice, focus, price emphasis, and
actions.

The dark theme is intentionally neutral. It does not tint black surfaces green
or orange. Orange appears as a controlled highlight, which keeps product
photography and text readable without abandoning the brand.

## Core brand colors

| Role | Light | Dark | Use |
|---|---:|---:|---|
| Brand primary | `#c94416` | `#ff8a5b` | Text links, focus, prices, marks |
| Brand primary hover | `#a93511` | `#ffad8c` | Foreground hover states |
| Action | `#c94416` | `#c94416` | Buttons and filled controls |
| Action hover | `#a93511` | `#a93511` | Filled-control hover states |
| Brand soft | `#fff0e8` | `#271a15` | Selected rows and soft washes |
| Brand soft strong | `#f8c8b2` | `#45291f` | Focus halos and strong tint borders |
| Brand on dark | `#ff8a5b` | `#ff8a5b` | Orange details on charcoal sections |

The brighter logo orange is `#e85d2a`. Interface actions use the deeper
`#c94416` so white text maintains accessible contrast.

## Surfaces and text

| Role | Light | Dark |
|---|---:|---:|
| Canvas | `#fcfbfa` | `#0a0908` |
| Card | `#ffffff` | `#141210` |
| Muted surface | `#f8f2ee` | `#1d1916` |
| Border | `#eee3dc` | `#2b2521` |
| Strong border | `#dccbc1` | `#40362f` |
| Text | `#241b17` | `#f8f4f1` |
| Muted text | `#72645d` | `#c1b4ac` |
| Subtle text | `#9d8d84` | `#8f8078` |
| Footer / dark section | `#211815` | `#070605` |

## Category tints

Category cards use quiet neutral, orange, and sunlit washes. In dark mode
these become low-chroma charcoal variants rather than colored panels.

| Tint | Light | Dark |
|---|---:|---:|
| Cool neutral | `#f2f0ee` | `#191817` |
| Warm orange | `#fff0e8` | `#241713` |
| Sun | `#fff6df` | `#241e12` |

## Rules

- Components consume semantic variables from `src/app/globals.css`.
- Filled orange controls use `--brand-action`; orange foregrounds use
  `--brand-primary`.
- Dark-mode canvases stay neutral black or charcoal. Do not tint them with the
  brand hue.
- Product photography uses normal blending in dark mode to preserve color.
- Platform colors, such as the WhatsApp icon green, are allowed only on the
  platform mark itself.
