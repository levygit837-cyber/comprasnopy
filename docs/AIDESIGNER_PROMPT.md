# AiDesigner Prompt — Compraspy

> A vision-led brief. This gives AiDesigner the **complete idea**, the brand
> soul, and the constraints, then trusts it to interpret the layout, rhythm,
> and detail. It is deliberately not a pixel spec. Feed the prompt block below.

---

## PROMPT

Design a complete, production-quality website for **Compraspy**, a
pharmacy in Asuncion, Paraguay. This is a real commerce site for a real
neighborhood pharmacy. I want you to bring your own design judgement to the
layout, spacing, composition, and motion. Tell me the *story* of this brand
visually. Make it feel like a place people trust with their family's health.

### Who Compraspy is

Compraspy is a local Paraguayan pharmacy. It sells medicines, hygiene,
personal care, baby products, and health-and-wellness items. What makes it
different from a cold chain-pharmacy website is warmth and trust: genuine
products, a real pharmacist who advises you, and the convenience of buying
through WhatsApp instead of a sterile online cart. When a customer wants a
product, they tap and a WhatsApp chat opens with the product already
mentioned. The conversation is the checkout. The website's job is to make
people feel "this is a good, careful pharmacy" in the first two seconds, then
let them browse and reach out.

### The feeling we want

Premium, minimalist, calm, trustworthy. Think of how Apple product pages feel:
lots of breathing room, confident typography, nothing shouting, every element
earning its place. Then add the warmth of a neighborhood pharmacy: it should
not feel like a tech startup, it should feel like a place that cares about
people. The green is deep and earthy, like a military or forest green, not a
neon or clinical teal. The overall impression on first scroll should be
"quietly excellent."

### The customer journey (design the page around this)

1. **First impression.** The visitor lands and instantly feels this is a
   serious, premium, trustworthy pharmacy. They see one clear, confident
   message and one image that makes the brand feel real (not a stock-photo
   cliche, not floating emoji cards). Trust signals live just below, not
   crammed into the hero.

2. **Get to know the pharmacy.** A short, editorial moment: who Compraspy is, a
   few honest numbers (years, products, availability). Refined, not boastful.

3. **Browse the products.** This is the heart. Rather than dumping every
   product into one giant grid, present the catalog as a series of
   collections, each shown as a smooth, flickable horizontal shelf. Think of
   how premium commerce apps let you glide through a category. A clear way to
   "see everything" opens the full catalog with filters when someone wants to
   dig in. The browsing should feel light and enjoyable, never overwhelming.

4. **Look closer at a product.** When something catches the eye, the visitor
   should be able to see it in detail without losing their place. A focused,
   elegant product view: large image, price, what it is, why trust it, and a
   single clear path to ask about it on WhatsApp.

5. **Reach out.** A clean contact moment: where the pharmacy is, when it's
   open, how to message. The WhatsApp option is always one tap away,
   everywhere, because that's how Compraspy actually does business.

### What to design (the complete site)

Design the full experience so it reads as one coherent world:

- An opening hero that sells the feeling and the brand at a glance.
- A way to show trust and credibility without clutter.
- The pharmacy's story and a few real-feeling credentials.
- The product catalog, browsable by collection, with a way to see everything.
- A focused product detail experience.
- Contact and location.
- A quiet, minimal footer.

Connect all of it with one consistent visual language so it never feels like
different designers made different sections. Navigation should be present but
never heavy. There is no traditional sticky header bar glued to the top.

### Visual direction (the soul, not the spec)

- **Color.** The brand is a deep, earthy military/forest green. Pair it with a
  warm, off-white ivory canvas, not pure clinical white. Use the green as the
  voice of authority and trust; use the ivory as the calm, breathable space.
  A restrained warm accent (a muted amber/gold) can appear very sparingly for
  emphasis. The WhatsApp call-to-action should use a brand-harmonized green,
  not a loud default, so it stays part of the family.
- **Typography.** Use **Geist** as the single typeface family (a modern
  geometric sans). Lean on weight and size contrast for hierarchy, not
  multiple fonts. Tight tracking on headlines, comfortable line-height on
  body. Prices should feel precise and considered (use tabular numerals).
- **Space.** Generous, confident whitespace is the luxury here. Let things
  breathe. Prefer hairline dividers and pure space over boxes and borders.
  When you do use a container, make it feel crafted (think of how a premium
  device sits in a machined frame).
- **Material.** Mostly flat and clean. Shadows, when used, should be barely
  there, soft, warm-tinted, never harsh black. No glassmorphism everywhere.
  No neon glows. The elegance comes from restraint and proportion.
- **Motion.** Quiet and purposeful. Gentle reveals as content enters view,
  smooth glide for the product shelves, a soft slide for the product detail.
  Nothing bouncy, nothing that screams for attention. Motion should feel like
  the page is breathing.
- **Imagery.** Real-feeling lifestyle and product photography, warm and
  slightly desaturated so it sits inside the palette. The hero especially
  needs a real image that makes the pharmacy feel like a real place. No
  emoji, no clip-art icons, no generic dashboard screenshots.

### Languages and currency

The site is trilingual: Spanish (default), Portuguese, English. Include a
discreet language switch. Prices are in Paraguayan Guarani (the G symbol),
which has no cents. Every product's buy action opens WhatsApp with the
product name and price already written into the message.

### Hard nos (so the result doesn't drift into AI-slop territory)

- No purple/blue gradients, no generic neon glow.
- No emoji as icons or decoration anywhere. Use a clean, consistent line-icon
  family (Phosphor light weight is our reference).
- No fat, heavy cards with chunky borders and big drop shadows. Prefer fine,
  airy containers and hairline dividers.
- No Inter, Poppins, or Roboto as the typeface.
- No cliche WhatsApp blob illustrations; use a clean, simple WhatsApp glyph
  that matches the icon family.
- No em-dashes in any visible text.
- No fake product previews built from styled rectangles, and no overlong
  spec tables with hairlines under every row.

### What I want from you

Surprise me with the composition. I have given you the brand, the feeling, the
journey, and the boundaries. Within that, make confident choices about how
each section is laid out, how the rhythm flows down the page, how the product
shelves move, and how the detail view opens. Aim for the quality bar of a
high-end studio build for a premium local brand. Deliver clean, semantic HTML
and CSS that I can hand to an Astro build, fully responsive, with real images
and a trilingual, WhatsApp-first product flow.

## END PROMPT

---

## Notes for the operator

- This prompt is intentionally **vision-led**, not a pixel spec, per the
  project direction: give AiDesigner the complete idea and let it interpret.
- It encodes every constraint the three design skills enforce (single accent,
  one radius family, one theme, Geist, Phosphor, no emoji, no em-dashes,
  real imagery, hairlines over boxes, restrained motion).
- The exact color ramp and token system AiDesigner should align to live in
  `src/styles/tokens.css`; the working reference implementation is in
  `prototype/`. After AiDesigner returns its interpretation, map its sections
  onto the Astro component structure in `docs/ARCHITECTURE.md`.
