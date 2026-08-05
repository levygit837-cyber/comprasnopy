-- Compraspy — minimal seed.
-- Categories and exchange rates. The full product catalog continues to be
-- rendered from `src/lib/products.ts` until a separate seeding pass is run
-- (see scripts/seed-products.sql in a follow-up).

insert into public.categories (id, slug, icon, tint, name_es, name_pt, name_en)
values
  ('hormonas-peptidos', 'hormonas-peptidos', 'Dna', 'cool',
   'Hormonas y Peptidos', 'Hormonas e Peptideos', 'Hormones & Peptides'),
  ('esteroides-anabolicos', 'esteroides-anabolicos', 'ShieldCheck', 'warm',
   'Esteroides Anabolicos', 'Esteroides Anabolicos', 'Anabolic Steroids'),
  ('moduladores-hormonales', 'moduladores-hormonales', 'SlidersHorizontal', 'sage',
   'Moduladores Hormonales', 'Moduladores Hormonais', 'Hormonal Modulators'),
  ('metabolicos-quemagrasas', 'metabolicos-quemagrasas', 'Gauge', 'cool',
   'Metabolicos y Quemagrasas', 'Metabolicos e Queimadores', 'Metabolic & Fat Burners'),
  ('regeneracion-reparacion', 'regeneracion-reparacion', 'Pulse', 'warm',
   'Regeneracion y Reparacion', 'Regeneracao e Reparo', 'Regeneration & Repair'),
  ('bienestar-antienvejecimiento', 'bienestar-antienvejecimiento', 'Sparkle', 'sage',
   'Bienestar y Antienvejecimiento', 'Bem-estar e Antienvelhecimento', 'Wellness & Anti-Aging')
on conflict (id) do update set
  slug = excluded.slug,
  icon = excluded.icon,
  tint = excluded.tint,
  name_es = excluded.name_es,
  name_pt = excluded.name_pt,
  name_en = excluded.name_en;

insert into public.exchange_rates (currency, rate)
values
  ('USD', 1.0000),
  ('BRL', 5.0800),
  ('PYG', 7250.0000)
on conflict (currency) do update set
  rate = excluded.rate,
  updated_at = now();
