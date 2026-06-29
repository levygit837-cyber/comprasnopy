import { describe, expect, it } from "vitest";

import { scoreQuery } from "./search";

describe("search", () => {
  it("returns tirzepatide family for weight-loss query", () => {
    const results = scoreQuery("weight-loss", 10);
    expect(results.length).toBeGreaterThan(0);
    const ids = results.map((r) => r.product.id);
    // Either tirzepatida or retatrutida should match via synonym
    expect(
      ids.some((id) => id.includes("tirzepatida") || id.includes("retatrutida")),
    ).toBe(true);
  });

  it("returns nothing for nonsense", () => {
    const results = scoreQuery("zzz-nonexistent-123");
    expect(results.length).toBe(0);
  });

  it("matches partial lab name", () => {
    const results = scoreQuery("zphc", 5);
    expect(results.length).toBeGreaterThan(0);
  });

  it("matches prefix trigram on short query", () => {
    const results = scoreQuery("clen", 3);
    const ids = results.map((r) => r.product.id);
    expect(ids).toContain("clenbuterol");
  });
});
