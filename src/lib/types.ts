import type { Lang } from "./store";

export type Localized = Record<Lang, string>;

export type Tint = "cool" | "warm" | "sun";

export interface Category {
  id: string;
  slug: string;
  icon: string;
  tint: Tint;
  name: Localized;
}

export interface Product {
  id: string;
  slug: string;
  name: Localized;
  desc: Localized;
  /** Base price in USD. Convert at display time. */
  priceUSD: number;
  oldPriceUSD?: number;
  category: string;
  image: string;
  /** Explicit responsive asset paths. These take precedence over legacy image stems. */
  images?: string[];
  /** Supplier or inventory code when the source provides one. */
  sku?: string;
  /** Indicates whether a visual is tied to an exact source or still needs validation. */
  imageStatus?: "verified-source" | "awaiting-reference";
  /** Traceability for catalog data and product visuals. */
  source?: {
    kind: "supplier-pdf" | "reviewed-product-page";
    document?: string;
    page?: string | number;
    slot?: number;
  };
  featured?: boolean;
  lab?: string;
  /** Variant family key, e.g. "tirzepatide". Members render as one card with a strength picker. */
  variantGroup?: string;
  /** Strength label for the picker, e.g. "Pen 75mg". */
  strength?: string;
}
