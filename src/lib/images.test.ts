import { describe, expect, it } from "vitest";

import { getImageSrcs } from "./images";
import { productById } from "./products";

describe("verified image resolver", () => {
  it("prefers the exact transparent pen cutout over the reviewed white canvas", () => {
    const product = productById("tirzepatida-pen-75mg");
    expect(product).toBeDefined();
    expect(getImageSrcs(product!)).toEqual([
      "/images/products/tirzepatide-75-pen-box.png",
    ]);
  });

  it("prefers the exact transparent BPC cutout over the reviewed white canvas", () => {
    const product = productById("bpc-157-20mg");
    expect(product).toBeDefined();
    expect(getImageSrcs(product!)).toEqual([
      "/images/products/bpc-157-20mg.png",
    ]);
  });

  it("uses the exact generated 120mg kit instead of the 60mg fallback", () => {
    const product = productById("retatrutida-120mg");
    expect(product).toBeDefined();
    expect(getImageSrcs(product!)).toEqual([
      "/images/products/premium/retatrutida-120mg-primary.webp",
      "/images/products/premium/retatrutida-120mg-detail.webp",
    ]);
  });

  it("prefers regenerated premium images for imported products", () => {
    const product = productById("supplier-49169");
    expect(product).toBeDefined();
    expect(getImageSrcs(product!)).toEqual([
      "/images/products/premium/supplier-49169-primary.webp",
      "/images/products/premium/supplier-49169-detail.webp",
    ]);
  });

  it.each([
    "hgh-fragment-2-5mg",
    "tirzepatida-pen-30mg",
    "trestolone-acetato-25mg",
  ])("does not reuse a different dosage for %s", (id) => {
    const product = productById(id);
    expect(product).toBeDefined();
    expect(getImageSrcs(product!)?.[0]).toBe(
      `/images/products/premium/${id}-primary.webp`,
    );
  });
});
