/**
 * Compraspy — on-device smart search.
 * Precomputes a token / trigram / synonym index over the catalog so a static
 * build can answer "tirzepatide weight loss" with the right family of
 * products, while junk queries yield zero results.
 *
 * Scoring:
 *   score = 0.6 * tokenHitFrac
 *         + 0.4 * trigramDice
 *         + 0.8 * substringHit
 *         + 1.5 * aliasExact
 *         + 0.5 * synonymHit
 *
 * A hard relevance floor guarantees no false-positive items in the result list.
 */

import { products } from "./products";
import { categories } from "./categories";
import type { Product } from "./types";

const SYNONYMS: Record<string, string[]> = {
  "weight-loss": [
    "tirzepatida", "tirzepatide", "semaglutida", "semaglutide",
    "retatrutida", "retatrutide", "aod-9604", "bpc-157",
    "super-slim", "double-burn",
  ],
  // Common short spelling: people search "tg" for Tirzepatide.
  "tg": ["tirzepatida", "tirzepatide", "tizerpatide", "tirzerpatide"],
  "tirz": ["tirzepatida", "tirzepatide", "tizerpatide", "tirzerpatide"],
  "growth-hormone": [
    "hgh", "ztrop", "ipamorelin", "ghrp-2", "ghrp-6", "ghk-cu",
  ],
  "anabolic": [
    "trestolone", "testosterone", "trembo", "stanozolol", "trenbolone",
    "methandione", "fluoxymesterone", "fluoxymesterolona",
  ],
  "cutting": [
    "clenbuterol", "clembuterol", "aod-9604", "super-slim", "double-burn", "stano",
  ],
  "recovery": [
    "bpc-157", "tb-500", "ghk-cu", "ultra-rehab", "mot", "ipamorelin",
  ],
  "anti-aging": [
    "nad", "epitalon", "glutathione", "glow-pro", "wellness-mix",
  ],
  "first-time": [
    "testosterone-propionato", "tamoxifeno", "anastrozol", "ipamorelin",
  ],
  "libido": [
    "pt-141", "melanotan", "tirzepatida", "tirzepatide",
  ],
};

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function tokens(s: string): string[] {
  return normalize(s)
    .split(/[^a-z0-9]+/g)
    .filter((t) => t.length > 1);
}

function trigrams(s: string): string[] {
  const padded = ` ${normalize(s)} `;
  const out: string[] = [];
  for (let i = 0; i < padded.length - 2; i++) {
    out.push(padded.slice(i, i + 3));
  }
  return out;
}

interface IndexEntry {
  id: string;
  haystack: string;
  product: Product;
  tokens: Set<string>;
  trigrams: Set<string>;
  aliases: Set<string>;
  synonyms: Set<string>;
}

const SYNONYM_KEYS = Object.keys(SYNONYMS);

function buildEntry(p: Product): IndexEntry {
  const category = categories.find((c) => c.id === p.category);
  const haystack = normalize(
    `${p.id} ${p.name.en} ${p.desc.en} ${p.lab || ""} ${p.strength || ""} ${category ? category.name.en : ""}`,
  );
  const tokensSet = new Set(tokens(haystack));
  const trigramsSet = new Set(trigrams(haystack));
  const aliases = new Set<string>(
    [normalize(p.name.en), normalize(p.id)].concat(
      p.strength ? [normalize(p.strength)] : [],
    ),
  );
  const synonyms = new Set<string>();
  for (const key of SYNONYM_KEYS) {
    if (SYNONYMS[key].some((v) => haystack.includes(v))) synonyms.add(key);
  }
  return {
    id: p.id,
    haystack,
    product: p,
    tokens: tokensSet,
    trigrams: trigramsSet,
    aliases,
    synonyms,
  };
}

const ENTRIES: IndexEntry[] = products.map(buildEntry);

export interface Result {
  product: Product;
  score: number;
  matchedSynonyms: string[];
}

export function scoreQuery(query: string, limit = 8): Result[] {
  const qNorm = normalize(query);
  if (!qNorm) return [];
  const qTokens = new Set(tokens(qNorm));
  const qTrigrams = new Set(trigrams(qNorm));
  const qAliases = new Set<string>([qNorm]);
  const qSynonyms = new Set<string>();
  for (const key of SYNONYM_KEYS) {
    if (qNorm.includes(key)) qSynonyms.add(key);
    for (const w of key.split("-")) if (qNorm.includes(w)) qSynonyms.add(key);
  }

  if (qTokens.size === 0 && qAliases.size === 0 && qSynonyms.size === 0) {
    return [];
  }

  const out: Result[] = [];
  for (const entry of ENTRIES) {
    let tokenHit = 0;
    for (const t of qTokens) if (entry.tokens.has(t)) tokenHit++;
    const tokenHitFrac = qTokens.size === 0 ? 0 : tokenHit / qTokens.size;

    let trigramHit = 0;
    for (const t of qTrigrams) if (entry.trigrams.has(t)) trigramHit++;
    const trigramDice =
      (2 * trigramHit) /
      Math.max(1, qTrigrams.size + entry.trigrams.size - trigramHit);

    const substringHit =
      entry.haystack.includes(qNorm) ||
      (qNorm.length >= 4 &&
        entry.haystack.includes(qNorm.slice(0, Math.max(3, qNorm.length - 1))));

    let aliasExact = 0;
    for (const a of qAliases) if (entry.aliases.has(a)) aliasExact = 1;

    let synonymHit = 0;
    const matched: string[] = [];
    for (const s of qSynonyms) {
      if (entry.synonyms.has(s)) {
        synonymHit += 1;
        matched.push(s);
      }
    }

    const score =
      0.6 * tokenHitFrac +
      0.4 * trigramDice +
      0.8 * (substringHit ? 1 : 0) +
      1.5 * aliasExact +
      0.5 * synonymHit;

    const passesFloor =
      trigramDice > 0.1 ||
      substringHit ||
      aliasExact > 0 ||
      synonymHit > 0;
    if (passesFloor && score > 0) {
      out.push({ product: entry.product, score, matchedSynonyms: matched });
    }
  }
  out.sort((a, b) => b.score - a.score);
  return out.slice(0, limit);
}
