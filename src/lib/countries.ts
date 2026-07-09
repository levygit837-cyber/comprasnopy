import type { Lang } from "./store";

export interface Country {
  /** ISO 3166-1 alpha-2 country code. */
  code: string;
  /** Localized display name. */
  name: Record<Lang, string>;
  /** Dialing prefix, digits only, includes leading "+". */
  dial: string;
  /** Suggested default for the phone field. */
  flag: string;
}

/**
 * Common worldwide coverage for the auth phone input. Ordered by relevance to
 * the Viana audience (Paraguay + Latin America first, then the rest of the
 * world). Symbols are emoji flags rendered by the OS.
 */
export const COUNTRIES: Country[] = [
  { code: "PY", name: { es: "Paraguay", pt: "Paraguai", en: "Paraguay" }, dial: "+595", flag: "PY" },
  { code: "BR", name: { es: "Brasil", pt: "Brasil", en: "Brazil" }, dial: "+55", flag: "BR" },
  { code: "AR", name: { es: "Argentina", pt: "Argentina", en: "Argentina" }, dial: "+54", flag: "AR" },
  { code: "UY", name: { es: "Uruguay", pt: "Uruguai", en: "Uruguay" }, dial: "+598", flag: "UY" },
  { code: "CL", name: { es: "Chile", pt: "Chile", en: "Chile" }, dial: "+56", flag: "CL" },
  { code: "BO", name: { es: "Bolivia", pt: "Bolivia", en: "Bolivia" }, dial: "+591", flag: "BO" },
  { code: "PE", name: { es: "Peru", pt: "Peru", en: "Peru" }, dial: "+51", flag: "PE" },
  { code: "CO", name: { es: "Colombia", pt: "Colombia", en: "Colombia" }, dial: "+57", flag: "CO" },
  { code: "EC", name: { es: "Ecuador", pt: "Equador", en: "Ecuador" }, dial: "+593", flag: "EC" },
  { code: "VE", name: { es: "Venezuela", pt: "Venezuela", en: "Venezuela" }, dial: "+58", flag: "VE" },
  { code: "MX", name: { es: "Mexico", pt: "Mexico", en: "Mexico" }, dial: "+52", flag: "MX" },
  { code: "US", name: { es: "Estados Unidos", pt: "Estados Unidos", en: "United States" }, dial: "+1", flag: "US" },
  { code: "CA", name: { es: "Canada", pt: "Canada", en: "Canada" }, dial: "+1", flag: "CA" },
  { code: "ES", name: { es: "Espana", pt: "Espanha", en: "Spain" }, dial: "+34", flag: "ES" },
  { code: "PT", name: { es: "Portugal", pt: "Portugal", en: "Portugal" }, dial: "+351", flag: "PT" },
  { code: "GB", name: { es: "Reino Unido", pt: "Reino Unido", en: "United Kingdom" }, dial: "+44", flag: "GB" },
  { code: "FR", name: { es: "Francia", pt: "Franca", en: "France" }, dial: "+33", flag: "FR" },
  { code: "DE", name: { es: "Alemania", pt: "Alemanha", en: "Germany" }, dial: "+49", flag: "DE" },
  { code: "IT", name: { es: "Italia", pt: "Italia", en: "Italy" }, dial: "+39", flag: "IT" },
  { code: "NL", name: { es: "Paises Bajos", pt: "Paises Baixos", en: "Netherlands" }, dial: "+31", flag: "NL" },
  { code: "BE", name: { es: "Belgica", pt: "Belgica", en: "Belgium" }, dial: "+32", flag: "BE" },
  { code: "CH", name: { es: "Suiza", pt: "Suica", en: "Switzerland" }, dial: "+41", flag: "CH" },
  { code: "AT", name: { es: "Austria", pt: "Austria", en: "Austria" }, dial: "+43", flag: "AT" },
  { code: "SE", name: { es: "Suecia", pt: "Suecia", en: "Sweden" }, dial: "+46", flag: "SE" },
  { code: "NO", name: { es: "Noruega", pt: "Noruega", en: "Norway" }, dial: "+47", flag: "NO" },
  { code: "DK", name: { es: "Dinamarca", pt: "Dinamarca", en: "Denmark" }, dial: "+45", flag: "DK" },
  { code: "FI", name: { es: "Finlandia", pt: "Finlandia", en: "Finland" }, dial: "+358", flag: "FI" },
  { code: "IE", name: { es: "Irlanda", pt: "Irlanda", en: "Ireland" }, dial: "+353", flag: "IE" },
  { code: "PL", name: { es: "Polonia", pt: "Polonia", en: "Poland" }, dial: "+48", flag: "PL" },
  { code: "CZ", name: { es: "Chequia", pt: "Tchéquia", en: "Czechia" }, dial: "+420", flag: "CZ" },
  { code: "RU", name: { es: "Rusia", pt: "Russia", en: "Russia" }, dial: "+7", flag: "RU" },
  { code: "TR", name: { es: "Turquia", pt: "Turquia", en: "Turkey" }, dial: "+90", flag: "TR" },
  { code: "IL", name: { es: "Israel", pt: "Israel", en: "Israel" }, dial: "+972", flag: "IL" },
  { code: "AE", name: { es: "Emiratos Arabes Unidos", pt: "Emirados", en: "United Arab Emirates" }, dial: "+971", flag: "AE" },
  { code: "SA", name: { es: "Arabia Saudita", pt: "Arabia Saudita", en: "Saudi Arabia" }, dial: "+966", flag: "SA" },
  { code: "ZA", name: { es: "Sudafrica", pt: "Africa do Sul", en: "South Africa" }, dial: "+27", flag: "ZA" },
  { code: "EG", name: { es: "Egipto", pt: "Egito", en: "Egypt" }, dial: "+20", flag: "EG" },
  { code: "NG", name: { es: "Nigeria", pt: "Nigeria", en: "Nigeria" }, dial: "+234", flag: "NG" },
  { code: "CN", name: { es: "China", pt: "China", en: "China" }, dial: "+86", flag: "CN" },
  { code: "JP", name: { es: "Japon", pt: "Japao", en: "Japan" }, dial: "+81", flag: "JP" },
  { code: "KR", name: { es: "Corea del Sur", pt: "Coreia do Sul", en: "South Korea" }, dial: "+82", flag: "KR" },
  { code: "TW", name: { es: "Taiwan", pt: "Taiwan", en: "Taiwan" }, dial: "+886", flag: "TW" },
  { code: "HK", name: { es: "Hong Kong", pt: "Hong Kong", en: "Hong Kong" }, dial: "+852", flag: "HK" },
  { code: "SG", name: { es: "Singapur", pt: "Singapura", en: "Singapore" }, dial: "+65", flag: "SG" },
  { code: "MY", name: { es: "Malasia", pt: "Malasia", en: "Malaysia" }, dial: "+60", flag: "MY" },
  { code: "TH", name: { es: "Tailandia", pt: "Tailandia", en: "Thailand" }, dial: "+66", flag: "TH" },
  { code: "VN", name: { es: "Vietnam", pt: "Vietna", en: "Vietnam" }, dial: "+84", flag: "VN" },
  { code: "ID", name: { es: "Indonesia", pt: "Indonesia", en: "Indonesia" }, dial: "+62", flag: "ID" },
  { code: "PH", name: { es: "Filipinas", pt: "Filipinas", en: "Philippines" }, dial: "+63", flag: "PH" },
  { code: "IN", name: { es: "India", pt: "India", en: "India" }, dial: "+91", flag: "IN" },
  { code: "AU", name: { es: "Australia", pt: "Australia", en: "Australia" }, dial: "+61", flag: "AU" },
  { code: "NZ", name: { es: "Nueva Zelanda", pt: "Nova Zelandia", en: "New Zealand" }, dial: "+64", flag: "NZ" },
];

export const countryByCode = (code: string): Country | undefined =>
  COUNTRIES.find((c) => c.code === code);
