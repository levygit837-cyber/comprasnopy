import type { Product } from "./types";

/**
 * Viana Pharmacy — image resolver.
 * Maps product ids to one or more cutout filenames in /public/images/products/.
 * The first entry is the primary image shown on cards.
 *
 * Files live under public/images/products/ and are referenced by `stem.png`.
 * Products without an entry render an "image coming soon" placeholder.
 */
const MAP: Record<string, string[]> = {
  // ── Hormonas y Peptidos ───────────────────────────────────────────────
  "ztrop-pen-72ui": ["ztrop-pen-72ui"],
  "ztrop-aq-90ui": ["ZTROP-AQ-90IU"],
  "ztrop-x-80ui": ["ztrop-x-80ui"],
  "ztrop-x-150ui-diluido": ["ztrop-150ui-premixed"],
  "ztrop-x-200ui": ["ztrop-200ui"],
  "ztrop-x-320ui": ["ztrop-320iu"],
  "ztrop-144ui-2-refills": ["ztrop-144ui"],
  "multi-pen-gh-180ui": ["multi-pen-gh"],
  "hgh-fragment-5mg": ["HGH-FRAGMENT-5MG"],
  "hgh-fragment-5mg-5": ["HGH-FRAGMENT-5MG"],
  "hgh-fragment-2-5mg": ["HGH-FRAGMENT-5MG"],
  "hgh-fragment-10mg": ["HGH-FRAGMENT-10MG"],
  "igf-1-1mg": ["IGF-1-1MG"],
  "retatrutida-120mg": ["Retratutide-60mg"],
  "retatrutide-pen-60mg": ["Retratutide-60mg"],
  "retatrutide-pen-30mg": ["RETRATUTIDE-30MG"],
  "retatrutide-60mg-5": ["Retratutide-60mg"],
  "tirzepatida-pen-75mg": ["tirzepatide-75-pen-box"],
  "tirzepatida-pen-30mg": ["tirzerpatide-15mg"],
  "tirzepatide-150mg": ["zphc-tizerpatide-150mg"],
  "tirzepatide-15mg": ["tizerpatide-15mg-box", "tizerpatide-pen-15mg"],
  "tirzepatide-25mg-amp": ["tirzerpatide-25mg"],
  "tirzepatide-50mg-amp": ["tirzerpatide-50mg"],
  "semaglutida-pen": ["semaglutide-pen-6mg"],
  "hcg-5000ui": ["HCG-5000IU"],
  "melanotan-2-pen": ["melanotan-2-30mg"],
  "melanotan-2-10mg": ["melanotan-2-10mg"],

  // ── Esteroides Anabolicos ─────────────────────────────────────────────
  "testosterone-suspension": ["testosterone-aq-100mg"],
  "testosterone-undecanoato": ["testosterone-undecaonate-250mg"],
  "testosterone-propionato": ["propionato-testo-100mg"],
  "test-enantato-400": ["testosterone-enanthate-10ml"],
  "testosterone-cypionate": ["testo-cyphionate-250mg"],
  "trembo-hexa-100mg": ["trenbolone-hexa"],
  "trembo-hexa-10ml": ["trenbolone-hexa"],
  "trembo-enantato": ["trembo-enantato-200mg"],
  "trestolone-enantato-50mg": ["trestolone-enanthate-50mg"],
  "trestolone-enantato-100mg": ["trestolone-enanthate-100mg"],
  "stano-susp-50mg": ["stano-susp-50mg"],
  "fluoxymesterolona": ["fluoxymesterone"],
  "methandione": ["methandione"],
  "super-mix": ["super-mix-250mg"],
  "mega-mix": ["megamix-250mg"],
  "mega-mass-mix": ["mega-mass-mix-50mg"],

  // ── Moduladores Hormonales ────────────────────────────────────────────
  "tamoxifeno": ["Tamoxifen-Citrate-20mg"],
  "anastrozol": ["anastrozol-1mg"],
  "cabergoline": ["caber-goline-0-25"],

  // ── Metabolicos y Quemagrasas ─────────────────────────────────────────
  "aod-9604-12mg": ["AOD9604-12-5"],
  "aod-9604-25mg": ["AOD9604"],
  "clenbuterol": ["clembuterol-40mcg"],
  "cyt3": ["CYT3-6MG"],
  "super-slim-27mg": ["super-slim-mix-27-5-mg"],
  "super-slim-55mg": ["super-slim-mix-55mg"],
  "double-burn": ["double-burn-mix-25mg"],
  "synthol-seo": ["synthol-40ml"],

  // ── Regeneracion y Reparacion ─────────────────────────────────────────
  "bpc-157-20mg": ["bpc-157-20mg"],
  "bpc-157-25mg": ["BPC-157-25MG"],
  "tb-500-20mg": ["tb-500-20mg"],
  "tb-500-25mg": ["tb-500-25mg"],
  "ghk-cu-60mg": ["ghkcu-60mg"],
  "ghk-cu-50mg": ["GHK-CU-50MG"],
  "ghk-cu-200mg": ["GHK-CU-200MG"],
  "ultra-rehab-50mg": ["ultra-rehab-mix-50mg"],
  "ultra-rehab-20mg": ["ultra-rehab-mix-20mg"],
  "ipamorelin": ["IPAMORELIN-25MG"],
  "ghrp-2": ["gphr-2-25mg"],
  "ghrp-6": ["ghrp-6"],
  "mots-c": ["mots-c-20mg"],
  "trestolone-acetato-25mg": ["trestrolone-acetato-50mg"],

  // ── Bienestar y Antienvejecimiento ────────────────────────────────────
  "nad-1000mg": ["NAD+1000MG"],
  "nad-2500mg": ["NAD+2500MG"],
  "nad-pen-aquoso": ["nad+1000mg-aquoso"],
  "glutathione": ["gluthatione-3000mg"],
  "epitalon-100mg": ["Ephitalon-100mg"],
  "epitalon-50mg": ["ephitalon-50mg"],
  "glow-pro-mix": ["glow-pro-mix-60mg"],
  "wellness-mix": ["wellness-mix-25mg"],

  // ── Misc ──────────────────────────────────────────────────────────────
  "ll37": ["LL37-25MG"],
};

/** Build a /images/products/<stem>.png path. */
export function imagePath(stem: string): string {
  return `/images/products/${stem}.png`;
}

/** Return optimized image src URLs for a product, or null if it has no photo. */
export function getImageSrcs(productId: string): string[] | null {
  const stems = MAP[productId];
  if (!stems || stems.length === 0) return null;
  return stems.map(imagePath);
}

/** First (primary) image for a product, or null if it has no photo. */
export function getPrimaryImage(product: Product): string | null {
  const srcs = getImageSrcs(product.id);
  return srcs && srcs.length > 0 ? srcs[0] : null;
}

export function hasImage(productId: string): boolean {
  return productId in MAP;
}
