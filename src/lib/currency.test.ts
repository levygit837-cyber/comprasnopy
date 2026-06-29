import { describe, expect, it } from "vitest";

import { CURRENCIES, formatFromUSD } from "./store";

describe("currency formatter", () => {
  it("formats USD with two decimals", () => {
    const out = formatFromUSD(20.5, "USD", "en");
    // English locale uses period as decimal separator
    expect(out).toMatch(/20\.50/);
    expect(out).toContain("$");
  });

  it("formats BRL with comma decimals", () => {
    const out = formatFromUSD(100, "BRL");
    // 100 * 5.08 = 508.00 (Spanish locale)
    expect(out).toMatch(/508/);
    expect(out).toContain("R$");
  });

  it("formats PYG with no minor units", () => {
    const out = formatFromUSD(100, "PYG");
    // 100 * 7250 = 725000
    expect(out).toMatch(/725\.000|725000/);
    expect(CURRENCIES.PYG.maximumFractionDigits).toBe(0);
  });
});
