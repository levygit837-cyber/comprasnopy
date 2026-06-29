import type { Product } from "./types";

/** A display unit: either a standalone product or a variant family. */
export interface DisplayItem {
  /** The primary product shown initially (first member of a group, or the standalone). */
  primary: Product;
  /** All members if this is a variant group; [primary] if standalone. */
  variants: Product[];
  /** True when there is more than one strength to pick from. */
  isGroup: boolean;
}

/**
 * Collapse the flat product list into display items: one per variant group
 * (members sorted by price ascending so the entry dose shows first) plus one
 * per standalone product. Order follows first appearance in the source array.
 */
export function groupForDisplay(list: Product[]): DisplayItem[] {
  const seen = new Set<string>();
  const seenGroup = new Set<string>();
  const out: DisplayItem[] = [];

  for (const p of list) {
    if (seen.has(p.id)) continue;

    if (p.variantGroup && !seenGroup.has(p.variantGroup)) {
      const members = list
        .filter((m) => m.variantGroup === p.variantGroup)
        .sort((a, b) => a.priceUSD - b.priceUSD);
      members.forEach((m) => seen.add(m.id));
      seenGroup.add(p.variantGroup);
      out.push({ primary: members[0], variants: members, isGroup: members.length > 1 });
    } else if (!p.variantGroup) {
      seen.add(p.id);
      out.push({ primary: p, variants: [p], isGroup: false });
    }
  }
  return out;
}

/**
 * Reference-keyed memoization for `groupForDisplay`. The catalog list is
 * stable across renders within a session, so caching by list identity avoids
 * recomputing the same ~915-line grouping on every page render, every hover,
 * and every SSG pass for `/products/[slug]`.
 */
const groupForDisplayCache = new WeakMap<Product[], DisplayItem[]>();

export function getGroupedProducts(list: Product[]): DisplayItem[] {
  const cached = groupForDisplayCache.get(list);
  if (cached) return cached;
  const fresh = groupForDisplay(list);
  groupForDisplayCache.set(list, fresh);
  return fresh;
}

/** True if any member of the group is featured (for carousel inclusion). */
export function isGroupFeatured(item: DisplayItem): boolean {
  return item.variants.some((v) => v.featured);
}
