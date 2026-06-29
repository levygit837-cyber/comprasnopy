import type { Category } from "./types";

export const categories: Category[] = [
  {
    id: "hormonas-peptidos",
    slug: "hormonas-peptidos",
    icon: "Dna",
    tint: "cool",
    name: {
      es: "Hormonas y Peptidos",
      pt: "Hormonas e Peptideos",
      en: "Hormones & Peptides",
    },
  },
  {
    id: "esteroides-anabolicos",
    slug: "esteroides-anabolicos",
    icon: "ShieldCheck",
    tint: "warm",
    name: {
      es: "Esteroides Anabolicos",
      pt: "Esteroides Anabolicos",
      en: "Anabolic Steroids",
    },
  },
  {
    id: "moduladores-hormonales",
    slug: "moduladores-hormonales",
    icon: "SlidersHorizontal",
    tint: "sage",
    name: {
      es: "Moduladores Hormonales",
      pt: "Moduladores Hormonais",
      en: "Hormonal Modulators",
    },
  },
  {
    id: "metabolicos-quemagrasas",
    slug: "metabolicos-quemagrasas",
    icon: "Gauge",
    tint: "cool",
    name: {
      es: "Metabolicos y Quemagrasas",
      pt: "Metabolicos e Queimadores",
      en: "Metabolic & Fat Burners",
    },
  },
  {
    id: "regeneracion-reparacion",
    slug: "regeneracion-reparacion",
    icon: "Pulse",
    tint: "warm",
    name: {
      es: "Regeneracion y Reparacion",
      pt: "Regeneracao e Reparo",
      en: "Regeneration & Repair",
    },
  },
  {
    id: "bienestar-antienvejecimiento",
    slug: "bienestar-antienvejecimiento",
    icon: "Sparkle",
    tint: "sage",
    name: {
      es: "Bienestar y Antienvejecimiento",
      pt: "Bem-estar e Antienvelhecimento",
      en: "Wellness & Anti-Aging",
    },
  },
];

export const categoryById = (id: string): Category | undefined =>
  categories.find((c) => c.id === id);

export const categoryBySlug = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);
