# Hero image prompt: Daily vitality ritual

## Purpose
Replace a generic gradient with a focused wellness ritual slide. This is slide 2 of 4. The hero block should use four real image slides, not two colored gradient slides.

## Visual identity lock
- Brand world: warm ivory pharmacy, deep herbal green authority, restrained amber detail.
- Palette: warm ivory `#fbfbf9`, primary herbal green `#536e2c`, deep forest `#182110`, sage `#e5ead2`, accent amber `#b0822a`.
- Image style: premium product-photography base with Photoshop-like motion graphics, translucent acrylic, soft botanical shadows, clean negative space.
- No text, logos, labels, brand names, UI, or readable packaging inside the image.

## Image prompt
Create a premium designed editorial still life for daily vitality and immune support products in a modern pharmacy marketplace. Warm ivory seamless background, pale oak surface, translucent sage acrylic platform, blank vitamin bottles turned away from camera, soft gel capsules, blister pack with no readable markings, amber dropper bottle, a glass of water with elegant refraction, and a folded warm-white paper insert with no text. Add subtle herbal-green motion-graphic arcs, small amber calibration dots, and soft botanical shadows to make it feel designed in Photoshop rather than like a real-world snapshot. Light comes from top-left, warm and clean, with deep forest-green shadow gradient on the left for UI copy. Product cluster floats visually from center-right to far-right, organized as a morning care ritual. Ultra realistic materials, premium pharmacy campaign, calm, trustworthy, refined, tactile, no readable text.

## Negative prompt
Readable text, logos, brand labels, exaggerated supplement claims, bodybuilder imagery, messy kitchen, cheap wellness stock photo, neon green, saturated orange, medical emergency, pills spilling everywhere, fake UI, hands with artifacts, plastic shine, surreal anatomy, too many products, text baked into image.

## Composition notes
- Text-safe zone: left 42 percent with a UI-applied green shadow overlay.
- Subject zone: capsules and bottles arranged in a gentle diagonal from lower-center to upper-right.
- Confidence cues: blank premium packaging, clean glass, measured quantities, calm morning ritual.
- Avoid a supermarket supplement look. This should read as curated pharmacy wellness.

## On-screen text, UI layer only
| Language | Eyebrow | Title | Body | CTA |
|---|---|---|---|---|
| ES | Vitalidad diaria | Apoyo para tu rutina | Vitaminas y bienestar diario con una selección simple, clara y confiable. | Ver bienestar |
| PT | Vitalidade diária | Apoio para sua rotina | Vitaminas e bem-estar diário com uma seleção simples, clara e confiável. | Ver bem-estar |
| EN | Daily vitality | Support for your routine | Vitamins and daily wellness, selected with clarity and confidence. | View wellness |

## Interaction and motion notes
- Progress bar segment should use herbal green when over light areas and white when over dark overlay.
- On slide entry, animate the UI copy upward 8 px while the image fades in, 500 ms ease-out.
- Add a subtle capsule sparkle only in CSS or Lottie if needed, never baked into the image.
- Micro-test: CTA label `Ver bienestar` vs `Ver productos`. Measure category page visits and add-to-cart after click.
- Swipe affordance: cursor changes to grab on desktop, horizontal drag threshold around 40 px.

## Technical specs
- Aspect ratio: 1400 x 460 display, generate at 2800 x 920 for retina.
- Safe crop: keep bottles and capsules within center-right, leave left copy zone uncluttered.
- Format: AVIF or WebP export, high quality, target below 450 KB after compression.
- Accessibility: image is decorative when overlaid with text, alt can summarize the concept if rendered as an image element.
