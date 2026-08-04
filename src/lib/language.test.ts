import { describe, expect, it } from "vitest";

import {
  detectLanguage,
  langFromAcceptLanguage,
  langFromCountry,
} from "./language";

describe("language detection", () => {
  it("keeps a manually saved language", () => {
    expect(
      detectLanguage({
        savedLanguage: "en",
        acceptLanguage: "pt-BR,pt;q=0.9",
        country: "BR",
      }),
    ).toBe("en");
  });

  it("uses the first supported browser preference", () => {
    expect(langFromAcceptLanguage("fr-FR,es;q=0.8,en;q=0.7")).toBe("es");
    expect(langFromAcceptLanguage("en-US,en;q=0.9,pt-BR;q=0.8")).toBe("en");
  });

  it("respects Accept-Language quality values", () => {
    expect(langFromAcceptLanguage("es;q=0.5,pt-BR;q=0.9,en;q=0")).toBe("pt");
  });

  it("maps Portuguese and Spanish-speaking countries", () => {
    expect(langFromCountry("BR")).toBe("pt");
    expect(langFromCountry("PT")).toBe("pt");
    expect(langFromCountry("PY")).toBe("es");
    expect(langFromCountry("MX")).toBe("es");
  });

  it("uses English for other known countries", () => {
    expect(langFromCountry("US")).toBe("en");
    expect(langFromCountry("DE")).toBe("en");
  });

  it("falls back to Spanish when no signal is available", () => {
    expect(detectLanguage({ country: "XX" })).toBe("es");
  });
});

