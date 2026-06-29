# Hero image prompt: Guided delivery and WhatsApp order

## Purpose
Create a service-focused hero slide about guidance, ordering, and delivery without looking like a courier stock photo. This is slide 4 of 4. The hero block should use four real image slides, not two colored gradient slides.

## Visual identity lock
- Brand world: warm ivory pharmacy, deep herbal green authority, restrained amber detail.
- Palette: warm ivory `#fbfbf9`, primary herbal green `#536e2c`, deep forest `#182110`, sage `#e5ead2`, accent amber `#b0822a`.
- Image style: premium product-photography base with Photoshop-like motion graphics, translucent acrylic, soft botanical shadows, clean negative space.
- No text, logos, labels, brand names, UI, or readable packaging inside the image.

## Image prompt
Create a premium designed editorial pharmacy delivery scene for a modern marketplace. Warm ivory background, pale oak packing counter, elegant sealed pharmacy bag with blank green label, blank product boxes partly visible, amber glass bottle, small roll of paper tape, clean receipt shape with no writing, and a smartphone face-up with a soft green chat-like glow but absolutely no readable screen text. Add translucent herbal-green route lines, subtle motion-graphic dots, and a sage acrylic panel behind the order, composed like a polished Photoshop campaign. Lighting is soft top-left, warm and trustworthy, with a deep forest-green gradient on the left for UI text overlay. The order package sits center-right and feels carefully prepared, local, professional, and calm. No courier person, no street background, no logos, no readable text.

## Negative prompt
Readable phone text, WhatsApp logo, app UI, brand names, delivery scooter, random courier, city street, messy packaging, fake labels, barcode with text, hospital scene, urgent emergency feeling, neon green sticker, cheap ecommerce stock photo, distorted phone, warped bag, text baked into image.

## Composition notes
- Text-safe zone: left 42 percent, with UI-applied forest-green gradient.
- Subject zone: right side, bag and phone form a clean triangle with tape and blank receipt.
- Service cues: sealed bag, careful packing, subtle chat glow, route lines, no loud delivery imagery.
- Keep the brand feeling like professional guidance first, delivery second.

## On-screen text, UI layer only
| Language | Eyebrow | Title | Body | CTA |
|---|---|---|---|---|
| ES | Entrega guiada | Pide fácil, recibe con confianza | Te orientamos por WhatsApp y preparamos tu pedido con detalle. | Consultar por WhatsApp |
| PT | Entrega orientada | Peça fácil, receba com confiança | Orientamos pelo WhatsApp e preparamos seu pedido com cuidado. | Consultar pelo WhatsApp |
| EN | Guided delivery | Order easily, receive confidently | We guide you on WhatsApp and prepare every order with care. | Ask on WhatsApp |

## Interaction and motion notes
- CTA can use the harmonized WhatsApp green only here, with brand-green hover state to stay cohesive.
- Animate route dots subtly in CSS over the image side, not baked into the exported image.
- Micro-test: WhatsApp CTA as primary vs secondary. Measure outbound WhatsApp starts and product browsing continuation.
- Swipe affordance: on touch, allow swiping anywhere outside CTA and buttons.
- Add hover state to arrows: white fill, herbal-green icon, slight scale to 1.05.

## Technical specs
- Aspect ratio: 1400 x 460 display, generate at 2800 x 920 for retina.
- Safe crop: keep smartphone and bag inside center-right so mobile crops preserve the service story.
- Format: AVIF or WebP export, high quality, target below 450 KB after compression.
- Accessibility: image is decorative when overlaid with text, alt can summarize the concept if rendered as an image element.
