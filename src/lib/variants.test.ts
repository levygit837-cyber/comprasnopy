import { describe, expect, it } from "vitest";

import { groupForDisplay } from "./variants";
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
