import { DEFAULT_LANG, type Lang } from "./store";

export const LANGUAGE_COOKIE = "viana.lang.v1";
export const LANGUAGE_REQUEST_HEADER = "x-viana-language";

const PORTUGUESE_COUNTRIES = new Set([
  "AO",
  "BR",
  "CV",
  "GW",
  "MZ",
  "PT",
  "ST",
  "TL",
]);

const SPANISH_COUNTRIES = new Set([
  "AR",
  "BO",
  "CL",
  "CO",
  "CR",
  "CU",
  "DO",
  "EC",
  "ES",
  "GQ",
  "GT",
  "HN",
  "MX",
  "NI",
  "PA",
  "PE",
  "PR",
  "PY",
  "SV",
  "UY",
  "VE",
]);

export function isLang(value: unknown): value is Lang {
  return value === "es" || value === "pt" || value === "en";
}

function langFromTag(tag: string): Lang | undefined {
  const base = tag.trim().toLowerCase().split("-")[0];
  return isLang(base) ? base : undefined;
}

/**
 * Parses the browser's Accept-Language header in preference order and returns
 * the first language supported by the storefront.
 */
export function langFromAcceptLanguage(header: string | null): Lang | undefined {
  if (!header) return undefined;

  const preferences = header
    .split(",")
    .map((entry, index) => {
      const [tag, ...params] = entry.trim().split(";");
      const qualityParam = params.find((param) => param.trim().startsWith("q="));
      const parsedQuality = qualityParam
        ? Number.parseFloat(qualityParam.trim().slice(2))
        : 1;

      return {
        tag,
        quality: Number.isFinite(parsedQuality) ? parsedQuality : 0,
        index,
      };
    })
    .filter(({ quality }) => quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const preference of preferences) {
    const lang = langFromTag(preference.tag);
    if (lang) return lang;
  }

  return undefined;
}

export function langFromCountry(country: string | null): Lang | undefined {
  if (!country) return undefined;

  const code = country.trim().toUpperCase();
  if (PORTUGUESE_COUNTRIES.has(code)) return "pt";
  if (SPANISH_COUNTRIES.has(code)) return "es";
  if (code === "XX" || code === "T1") return undefined;

  return "en";
}

interface DetectLanguageInput {
  savedLanguage?: string | null;
  acceptLanguage?: string | null;
  country?: string | null;
}

/**
 * Manual choice wins. Browser preference is more reliable than IP location
 * (travel and VPNs are common), while country remains a useful fallback.
 */
export function detectLanguage({
  savedLanguage,
  acceptLanguage,
  country,
}: DetectLanguageInput): Lang {
  if (isLang(savedLanguage)) return savedLanguage;

  return (
    langFromAcceptLanguage(acceptLanguage ?? null) ??
    langFromCountry(country ?? null) ??
    DEFAULT_LANG
  );
}

