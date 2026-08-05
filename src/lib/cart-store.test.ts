import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { buildWhatsAppMessage, totalUSD, totalUnits } from "./cart-store";
import type { CartLine } from "./cart-store";

function line(overrides: Partial<CartLine>): CartLine {
  return {
    id: overrides.id ?? "x::",
    productId: overrides.productId ?? "x",
    name: overrides.name ?? "Item",
    strength: overrides.strength ?? "",
    priceUSD: overrides.priceUSD ?? 100,
    qty: overrides.qty ?? 1,
    image: overrides.image ?? null,
    category: overrides.category,
    lab: overrides.lab,
  };
}

describe("cart totals", () => {
  it("sums qty across lines", () => {
    const lines = [line({ qty: 2 }), line({ qty: 3 })];
    expect(totalUnits(lines)).toBe(5);
  });

  it("sums qty * price across lines", () => {
    const lines = [line({ priceUSD: 10, qty: 2 }), line({ priceUSD: 25, qty: 1 })];
    expect(totalUSD(lines)).toBe(45);
  });
});

describe("whatsapp checkout url", () => {
  it("includes phone, encoded message and total", () => {
    const lines = [line({ name: "Tirzepatide", priceUSD: 100, qty: 2, strength: "Pen 75mg" })];
    const url = buildWhatsAppMessage(
      lines,
      totalUSD(lines),
      "Hola Compraspy ({total}).",
      "USD",
      "595994987699",
    );
    expect(url).toContain("https://wa.me/595994987699");
    expect(url).toContain("Tirzepatide");
    // Decoded query param contains the strength
    const decoded = decodeURIComponent(url.split("text=")[1] ?? "");
    expect(decoded).toContain("Pen 75mg");
    expect(decoded).toContain("Total:");
  });
});
