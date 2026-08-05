import { describe, expect, it } from "vitest";

import { categories } from "./categories";
import { products, productById } from "./products";

describe("catalog source reconciliation", () => {
  it("keeps stable unique ids across the Compraspy and supplier catalogs", () => {
    expect(products).toHaveLength(218);
    expect(new Set(products.map((product) => product.id)).size).toBe(products.length);
  });

  it("imports exact supplier price and code data", () => {
    const product = productById("supplier-42375");
    expect(product?.name.es).toBe("ACIDO HIALURONICO CLASSIC LIDOCAINE MELINE 1.0ML");
    expect(product?.priceUSD).toBe(60);
    expect(product?.sku).toBe("42375");
    expect(product?.source?.page).toBe(1);
  });

  it("assigns every product to a real catalog category", () => {
    const categoryIds = new Set(categories.map((category) => category.id));
    expect(products.every((product) => categoryIds.has(product.category))).toBe(true);
  });
});
