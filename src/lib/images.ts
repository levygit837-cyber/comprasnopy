import verifiedWebImagesData from "@/data/verified-web-images.json";
import generatedProductImagesData from "@/data/generated-product-images.json";
import type { Product } from "./types";

interface VerifiedImageEntry {
  images: string[];
  source: {
    kind: "reviewed-product-page";
    page: string;
  };
}

const REVIEWED_WEB_IMAGES = verifiedWebImagesData as unknown as Record<
  string,
  VerifiedImageEntry
>;

const GENERATED_PRODUCT_IMAGES = generatedProductImagesData as Record<
  string,
  string[]
>;

const LEGACY_PRODUCT_IMAGES: Record<string, string[]> = {
  "ztrop-pen-72ui": ["ztrop-pen-72ui.png"],
  "ztrop-aq-90ui": ["ZTROP-AQ-90IU.png"],
  "ztrop-x-80ui": ["ztrop-x-80ui.png"],
  "ztrop-x-150ui-diluido": ["ztrop-150ui-premixed.png"],
  "ztrop-x-200ui": ["ztrop-200ui.png"],
  "ztrop-x-320ui": ["ztrop-320iu.png"],
  "ztrop-144ui-2-refills": ["ztrop-144ui.png"],
  "multi-pen-gh-180ui": ["multi-pen-gh.png"],
  "hgh-fragment-5mg-5": ["HGH-FRAGMENT-5MG.png"],
  "hgh-fragment-10mg": ["HGH-FRAGMENT-10MG.png"],
  "retatrutide-pen-30mg": ["RETRATUTIDE-30MG.png"],
  "retatrutide-60mg-5": ["Retratutide-60mg.png"],
  "tirzepatide-15mg": ["tizerpatide-15mg-box.png", "tizerpatide-pen-15mg.png"],
  "tirzepatide-25mg-amp": ["tirzerpatide-25mg.png"],
  "semaglutida-pen": ["semaglutide-pen-6mg.png"],
  "hcg-5000ui": ["HCG-5000IU.png"],
  "melanotan-2-pen": ["melanotan-2-30mg.png"],
  "testosterone-suspension": ["testosterone-aq-100mg.png"],
  "test-enantato-400": ["testosterone-enanthate-10ml.png"],
  "testosterone-cypionate": ["testo-cyphionate-250mg.png"],
  "trembo-hexa-100mg": ["trenbolone-hexa.png"],
  "trembo-hexa-10ml": ["trenbolone-hexa.png"],
  "trestolone-acetato-50mg": ["trestrolone-acetato-50mg.png"],
  "stano-susp-50mg": ["stano-susp-50mg.png"],
  "fluoxymesterolona": ["fluoxymesterone.png"],
  "methandione": ["methandione.png"],
  "super-mix": ["super-mix-250mg.png"],
  "tamoxifeno": ["Tamoxifen-Citrate-20mg.png"],
  "anastrozol": ["anastrozol-1mg.png"],
  "cabergoline": ["caber-goline-0-25.png"],
  "aod-9604-12mg": ["AOD9604-12-5.png"],
  "clenbuterol": ["clembuterol-40mcg.png"],
  "cyt3": ["CYT3-6MG.png"],
  "super-slim-55mg": ["super-slim-mix-55mg.png"],
  "double-burn": ["double-burn-mix-25mg.png"],
  "bpc-157-25mg": ["BPC-157-25MG.png"],
  "ghk-cu-50mg": ["GHK-CU-50MG.png"],
  "ghk-cu-200mg": ["GHK-CU-200MG.png"],
  "ultra-rehab-20mg": ["ultra-rehab-mix-20mg.png"],
  "nad-2500mg": ["NAD+2500MG.png"],
  "nad-pen-aquoso": ["nad+1000mg-aquoso.png"],
  "glutathione": ["gluthatione-3000mg.png"],
  "epitalon-100mg": ["Ephitalon-100mg.png"],
};

/**
 * Exact matches between products from docs/catalog.md and embedded supplier
 * images from Product_List (7).pdf. Similar dosages and package types are
 * intentionally not mapped.
 */
const VERIFIED_PDF_IMAGES: Record<string, string[]> = {
  "testosterone-undecanoato": [
    "/images/products/verified/supplier-47391-full.webp",
    "/images/products/verified/supplier-47391-detail.webp",
  ],
  "testosterone-propionato": [
    "/images/products/verified/supplier-47235-full.webp",
    "/images/products/verified/supplier-47235-detail.webp",
  ],
  "trembo-enantato": [
    "/images/products/verified/supplier-47415-full.webp",
    "/images/products/verified/supplier-47415-detail.webp",
  ],
  "trestolone-enantato-50mg": [
    "/images/products/verified/supplier-47189-full.webp",
    "/images/products/verified/supplier-47189-detail.webp",
  ],
  "trestolone-enantato-100mg": [
    "/images/products/verified/supplier-47358-full.webp",
    "/images/products/verified/supplier-47358-detail.webp",
  ],
  "mega-mix": [
    "/images/products/verified/supplier-47404-full.webp",
    "/images/products/verified/supplier-47404-detail.webp",
  ],
  "synthol-seo": [
    "/images/products/verified/supplier-47370-full.webp",
    "/images/products/verified/supplier-47370-detail.webp",
  ],
  "tb-500-25mg": [
    "/images/products/verified/supplier-47190-full.webp",
    "/images/products/verified/supplier-47190-detail.webp",
  ],
  "ghrp-2": [
    "/images/products/verified/supplier-47280-full.webp",
    "/images/products/verified/supplier-47280-detail.webp",
  ],
  "wellness-mix": [
    "/images/products/verified/supplier-33915-full.webp",
    "/images/products/verified/supplier-33915-detail.webp",
  ],
  "tirzepatide-50mg-amp": [
    "/images/products/verified/supplier-34646-full.webp",
    "/images/products/verified/supplier-34646-detail.webp",
  ],
};

export function getImageSrcs(product: Product | string): string[] | null {
  const id = typeof product === "string" ? product : product.id;

  const generated = GENERATED_PRODUCT_IMAGES[id];
  if (generated?.length) return generated;

  if (typeof product !== "string" && product.images?.length) {
    return product.images;
  }

  const reviewed = REVIEWED_WEB_IMAGES[id]?.images;
  if (reviewed?.length) return reviewed;

  const supplier = VERIFIED_PDF_IMAGES[id];
  if (supplier?.length) return supplier;

  const legacy = LEGACY_PRODUCT_IMAGES[id];
  return legacy?.length
    ? legacy.map((filename) => `/images/products/${filename}`)
    : null;
}

export function getPrimaryImage(product: Product): string | null {
  return getImageSrcs(product)?.[0] ?? null;
}

export function hasImage(product: Product | string): boolean {
  return Boolean(getImageSrcs(product)?.length);
}
