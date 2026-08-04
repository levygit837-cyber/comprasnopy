"use client";

import Link from "next/link";
import {
  ArrowRight,
  Dna,
  Gauge,
  Pill,
  Pulse,
  ShieldCheck,
  SlidersHorizontal,
  Sparkle,
  SquaresFour,
} from "@phosphor-icons/react/dist/ssr";

import { categories } from "@/lib/categories";
import { useLanguage } from "@/lib/language-context";

type IconComponent = React.ComponentType<{ size?: number; weight?: "fill" | "regular" | "bold"; className?: string }>;

const ICON_MAP: Record<string, IconComponent> = {
  Dna,
  Gauge,
  Pill,
  Pulse,
  ShieldCheck,
  SlidersHorizontal,
  Sparkle,
};

const TINT_VAR: Record<string, string> = {
  cool: "var(--tint-cool)",
  warm: "var(--tint-warm)",
  sun: "var(--tint-sun)",
};

const CATEGORY_COPY: Record<string, Record<"es" | "pt" | "en", string>> = {
  "hormonas-peptidos": {
    es: "Señalización precisa",
    pt: "Sinalização precisa",
    en: "Precise signaling",
  },
  "esteroides-anabolicos": {
    es: "Control profesional",
    pt: "Controle profissional",
    en: "Professional control",
  },
  "moduladores-hormonales": {
    es: "Balance guiado",
    pt: "Equilíbrio orientado",
    en: "Guided balance",
  },
  "metabolicos-quemagrasas": {
    es: "Energía con criterio",
    pt: "Energia com critério",
    en: "Energy with care",
  },
};

export function BentoCategories() {
  const { t, lang } = useLanguage();
  const items = categories.slice(0, 4);

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 mt-10 md:mt-14">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h3 className="font-sans text-2xl md:text-3xl text-[var(--brand-primary)] font-semibold tracking-tight">
            {t("bentoTitle")}
          </h3>
          <p className="text-[var(--text-muted)] text-xs mt-0.5 font-medium">
            {t("bentoSubtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((c) => {
          const Icon = ICON_MAP[c.icon] ?? Pill;
          const description = CATEGORY_COPY[c.id]?.[lang];
          return (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className="theme-aware relative rounded-2xl overflow-hidden group min-h-[132px] p-3.5 flex flex-col justify-between border border-[var(--bg-border)] hover:border-[var(--brand-primary-hover)]/25 hover:shadow-md transition-all active:scale-[0.99]"
              style={{ backgroundColor: TINT_VAR[c.tint] ?? "var(--tint-cool)" }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,var(--tint-sheen),transparent_34%),linear-gradient(135deg,var(--tint-glaze),transparent_58%)] pointer-events-none" />
              <Icon
                size={82}
                weight="regular"
                className="absolute -right-4 -bottom-5 text-[var(--brand-primary-hover)]/12 group-hover:rotate-6 group-hover:scale-105 transition-transform"
              />
              <div className="relative z-10 flex items-center justify-between">
                <span className="w-9 h-9 rounded-xl bg-[var(--tint-icon-bg)] border border-[var(--tint-icon-border)] shadow-[var(--shadow-inner-border)] flex items-center justify-center text-[var(--brand-primary)]">
                  <Icon size={18} weight="bold" />
                </span>
                <span className="w-7 h-7 rounded-full bg-[var(--tint-icon-bg)] text-[var(--brand-primary)] flex items-center justify-center opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                  <ArrowRight size={12} weight="bold" />
                </span>
              </div>
              <div className="relative z-10 pr-8">
                <h4 className="font-sans text-sm md:text-[15px] font-semibold tracking-tight leading-tight text-[var(--tint-text)] mb-1">
                  {c.name[lang]}
                </h4>
                {description && (
                  <p className="text-[11px] leading-snug font-medium text-[var(--tint-text-muted)]">
                    {description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* All categories — full-width slim bar below the category grid */}
      <Link
        href="/products"
        className="theme-aware mt-3 relative rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--bg-border-strong)] group flex items-center justify-between px-4 py-2.5 hover:border-[var(--brand-primary)] hover:shadow-md transition-all"
      >
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-[var(--brand-soft)] flex items-center justify-center group-hover:bg-[var(--brand-action)] group-hover:text-white transition-colors text-[var(--brand-primary)]">
            <SquaresFour size={14} weight="fill" />
          </span>
          <span className="font-sans text-sm font-semibold tracking-tight text-[var(--brand-primary)]">
            {t("bentoViewAll")}
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-[var(--brand-primary)] font-bold text-xs group-hover:gap-2.5 transition-all">
          {t("bentoSeeMore")}
          <ArrowRight size={12} weight="bold" />
        </span>
      </Link>
    </section>
  );
}
