/**
 * Viana Pharmacy — store configuration.
 * Single source of truth for store-wide values. Update the WhatsApp number
 * here once the real one is provided. Every CTA link re-derives from it.
 */

export type Lang = "es" | "pt" | "en";

export const LANGS: { code: Lang; label: string }[] = [
  { code: "es", label: "Espanol" },
  { code: "pt", label: "Portugues" },
  { code: "en", label: "English" },
];

export const DEFAULT_LANG: Lang = "es";

export type CurrencyCode = "USD" | "BRL" | "PYG";

export const CURRENCY_CODES: CurrencyCode[] = ["USD", "BRL", "PYG"];

export interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  label: string;
  locale: string;
  /** Number of minor units to display. PYG has none. */
  maximumFractionDigits: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  USD: { code: "USD", symbol: "US$", label: "Dolar", locale: "es-PY", maximumFractionDigits: 2 },
  BRL: { code: "BRL", symbol: "R$", label: "Real", locale: "pt-BR", maximumFractionDigits: 2 },
  PYG: { code: "PYG", symbol: "G$", label: "Guarani", locale: "es-PY", maximumFractionDigits: 0 },
};

/**
 * Exchange rates from USD. Static default values; can be overridden at
 * runtime by the rate provider. Update monthly or when the spread widens.
 */
export const DEFAULT_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  BRL: 5.08,
  PYG: 7250,
};

export const storeConfig = {
  storeName: "Viana",
  storeFullName: "Farmacia Viana",
  tagline: {
    es: "Tu farmacia de confianza en Paraguay",
    pt: "Sua farmacia de confianca no Paraguai",
    en: "Your trusted pharmacy in Paraguay",
  },

  /** WhatsApp number in international format, digits only. */
  whatsappNumber: "595993342253",

  contact: {
    address: "Av. Mariscal Lopez, Asuncion, Paraguay",
    phone: "+595 21 000 000",
    email: "contacto@viana.com.py",
    hours: {
      es: "Lun a Dom, 07:00 a 22:00",
      pt: "Seg a Dom, 07:00 as 22:00",
      en: "Mon to Sun, 07:00 to 22:00",
    },
  },

  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/",
  },
} as const;

/** Build a WhatsApp deep link with a prefilled message. */
export function waLink(message: string): string {
  return `https://wa.me/${storeConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

/** Format a USD amount into the requested display currency. */
export function formatFromUSD(
  usd: number,
  currency: CurrencyCode,
  lang: Lang = "es",
  rates: Record<CurrencyCode, number> = DEFAULT_RATES,
): string {
  const meta = CURRENCIES[currency];
  const value = currency === "USD" ? usd : usd * rates[currency];
  const locale = lang === "pt" ? "pt-BR" : lang === "en" ? "en-US" : meta.locale;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: meta.maximumFractionDigits,
  }).format(value);
}

/**
 * Format an exchange rate for display. PYG rates use thousand-dot separators
 * (7.250 instead of 7250) so they read naturally in Paraguay.
 */
export function formatRate(currency: CurrencyCode, value: number): string {
  if (currency === "PYG") {
    return value.toLocaleString("es-PY", { maximumFractionDigits: 0 });
  }
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
