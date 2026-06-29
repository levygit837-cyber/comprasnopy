# Hero image prompt: Dermocosmetics ritual

## Purpose
Create a refined dermocosmetics slide that feels clinical enough for trust and warm enough for a pharmacy brand. This is slide 3 of 4. The hero block should use four real image slides, not two colored gradient slides.

## Visual identity lock
- Brand world: warm ivory pharmacy, deep herbal green authority, restrained amber detail.
- Palette: warm ivory `#fbfbf9`, primary herbal green `#536e2c`, deep forest `#182110`, sage `#e5ead2`, accent amber `#b0822a`.
- Image style: premium product-photography base with Photoshop-like motion graphics, translucent acrylic, soft botanical shadows, clean negative space.
- No text, logos, labels, brand names, UI, or readable packaging inside the image.

## Image prompt
Create a luxury designed editorial dermocosmetics pharmacy image. Warm ivory seamless background with a pale oak shelf, frosted glass slab, blank serum bottle, blank sunscreen tube, small cream jar with label turned away, clean water droplets on glass, a thin smear of cream as a tactile texture, and soft botanical shadows. Add translucent herbal-green acrylic arcs, delicate motion-graphic orbit lines, and restrained amber highlights, like a premium Photoshop campaign for pharmacy skincare. Light is soft and diffused from top-left, with gentle refractions through glass. Leave the left 42 percent calm and darker with a forest-green gradient space for UI text overlay. Product composition sits center-right, elegant, precise, and skin-care focused. It should feel professional, high quality, and curated, not beauty influencer content. Ultra realistic, editorial, no readable text.

## Negative prompt
Readable text, logos, brand packaging, face closeup, skin before-after, medical procedure, needles, messy bathroom, influencer vanity, pink beauty palette, harsh clinical blue, overdone water splashes, fake typography, AI artifacts, distorted bottles, labels with gibberish, text baked into image.

## Composition notes
- Text-safe zone: left 42 percent, green overlay in UI layer.
- Subject zone: right side, serum and sunscreen form a vertical rhythm with glass refraction.
- Quality cues: frosted glass, controlled droplets, cream texture, labels hidden or blank.
- Keep it pharmacy dermo, not cosmetics counter glam.

## On-screen text, UI layer only
| Language | Eyebrow | Title | Body | CTA |
|---|---|---|---|---|
| ES | Dermocosmética | Cuidado de piel con criterio | Sérums, protectores y tratamientos elegidos para una rutina más precisa. | Explorar dermo |
| PT | Dermocosmética | Cuidado da pele com critério | Séruns, protetores e tratamentos escolhidos para uma rotina mais precisa. | Explorar dermo |
| EN | Dermocosmetics | Skin care with confidence | Serums, sunscreens, and treatments selected for a more precise routine. | Explore dermo |

## Interaction and motion notes
- On hover, add a very soft glass-refraction shimmer in CSS over the product side, 10 percent opacity maximum.
- Progress indicator can inherit sage for inactive segments and white for active over dark overlay.
- Micro-test: image-only hover zoom at 1.03 scale vs parallax drift. Measure CTA click rate and time on slide.
- Tap zones should not conflict with CTA. CTA area always wins click priority.
- Keyboard users can tab to previous, next, and active CTA with visible brand-green focus ring.

## Technical specs
- Aspect ratio: 1400 x 460 display, generate at 2800 x 920 for retina.
- Safe crop: keep hero products away from extreme right edge so rounded card clipping does not cut bottles.
- Format: AVIF or WebP export, high quality, target below 450 KB after compression.
- Accessibility: image is decorative when overlaid with text, alt can summarize the concept if rendered as an image element.
