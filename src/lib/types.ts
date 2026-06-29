import type { Lang } from "./store";

export type Localized = Record<Lang, string>;

export type Tint = "cool" | "warm" | "sage";

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
  featured?: boolean;
  lab?: string;
  /** Variant family key, e.g. "tirzepatide". Members render as one card with a strength picker. */
  variantGroup?: string;
  /** Strength label for the picker, e.g. "Pen 75mg". */
  strength?: string;
}
