import { describe, expect, it } from "vitest";

import { groupForDisplay, uniqueProductCount } from "./variants";
import type { Product } from "./types";

function p(partial: Partial<Product>): Product {
  return {
    id: partial.id ?? "test",
    slug: partial.slug ?? partial.id ?? "test",
    name: { es: "T", pt: "T", en: "T" },
    desc: { es: "T", pt: "T", en: "T" },
    priceUSD: partial.priceUSD ?? 10,
    category: partial.category ?? "hormonas-peptidos",
    image: partial.image ?? "x",
    variantGroup: partial.variantGroup,
    strength: partial.strength,
  };
}

describe("variant grouping", () => {
  it("collapses a variant family into one display item", () => {
    const list = [
      p({ id: "a", variantGroup: "fam", strength: "100mg", priceUSD: 100 }),
      p({ id: "b", variantGroup: "fam", strength: "200mg", priceUSD: 200 }),
      p({ id: "c" }),
    ];
    const items = groupForDisplay(list);
    expect(items).toHaveLength(2);
    const group = items.find((i) => i.isGroup)!;
    expect(group.variants).toHaveLength(2);
    // sorted by price ascending so the entry dose shows first
    expect(group.primary.id).toBe("a");
  });

  it("preserves order of standalone products", () => {
    const list = [
      p({ id: "a" }),
      p({ id: "b" }),
      p({ id: "c" }),
    ];
    const items = groupForDisplay(list);
    expect(items.map((i) => i.primary.id)).toEqual(["a", "b", "c"]);
  });
});

describe("uniqueProductCount", () => {
  it("counts each variant family as one product", () => {
    const list = [
      p({ id: "a", variantGroup: "fam", strength: "100mg", priceUSD: 100 }),
      p({ id: "b", variantGroup: "fam", strength: "200mg", priceUSD: 200 }),
      p({ id: "c", variantGroup: "fam", strength: "300mg", priceUSD: 300 }),
      p({ id: "d" }),
    ];
    expect(uniqueProductCount(list)).toBe(2);
  });

  it("filters by category and still collapses variants", () => {
    const list = [
      p({ id: "a", variantGroup: "fam", category: "hormonas-peptidos" }),
      p({ id: "b", variantGroup: "fam", category: "hormonas-peptidos" }),
      p({ id: "c", category: "esteroides-anabolicos" }),
      p({ id: "d", category: "hormonas-peptidos" }),
    ];
    expect(uniqueProductCount(list, "hormonas-peptidos")).toBe(2);
    expect(uniqueProductCount(list, "esteroides-anabolicos")).toBe(1);
  });

  it("returns the total when category is 'all'", () => {
    const list = [
      p({ id: "a", variantGroup: "fam" }),
      p({ id: "b", variantGroup: "fam" }),
      p({ id: "c" }),
    ];
    expect(uniqueProductCount(list, "all")).toBe(2);
  });
});

