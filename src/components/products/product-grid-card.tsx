"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";

import { useCurrency } from "@/lib/currency-context";
import { useLanguage } from "@/lib/language-context";
import { useCartStore } from "@/lib/cart-store";
import { getImageSrcs } from "@/lib/images";
import { categoryById } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductGridCardProps {
  product: Product;
  /** Variants in the same family. When > 1, render the inline strength picker. */
  variants?: Product[];
}

export function ProductGridCard({ product, variants }: ProductGridCardProps) {
  const { format, formatCompact, primaryCurrency } = useCurrency();
  const { t, lang } = useLanguage();
  const add = useCartStore((s) => s.add);

  const images = getImageSrcs(product.id) ?? [];
  const category = categoryById(product.category);
  const familyVariants = variants && variants.length > 1 ? variants : null;

  const [activeId, setActiveId] = useState(product.id);
  const active: Product =
    familyVariants?.find((v) => v.id === activeId) ?? product;

  const order: Array<"USD" | "BRL" | "PYG"> = ["USD", "BRL", "PYG"];
  const secondary = order.filter((c) => c !== primaryCurrency);
  const primaryValue = format(active.priceUSD);
  const secondaryLine = secondary.map((c) => formatCompact(active.priceUSD, c)).join(" . ");

  return (
    <article className="theme-aware group relative bg-[var(--bg-card)] rounded-2xl p-3 border border-[var(--bg-border)] shadow-sm hover:shadow-[var(--shadow-hover)] flex flex-col h-full overflow-hidden">
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1">
        {category && (
          <span className="bg-[var(--brand-sage)] text-[var(--brand-green)] text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md">
            {category.name[lang]}
          </span>
        )}
      </div>

      <Link
        href={`/products/${active.slug}`}
        className="relative w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center p-3"
        style={{ backgroundColor: "var(--image-bg)" }}
      >
        {images[0] ? (
          <Image
            src={images[0]}
            alt={active.name.en}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            loading="lazy"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            style={{ mixBlendMode: "var(--image-blend)" as React.CSSProperties["mixBlendMode"] }}
            unoptimized
          />
        ) : (
          <span className="text-xs text-[var(--text-subtle)]">
            Sin imagen
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 px-1 pt-2.5">
        <h3 className="font-bold text-[13px] leading-tight mb-0.5 text-[var(--text)] line-clamp-1">
          {active.name.en}
        </h3>
        <p className="text-[11px] text-[var(--text-muted)] mb-2 line-clamp-1">
          {active.desc[lang]}
        </p>

        {familyVariants && (
          <div className="mb-2.5">
            <div className="flex flex-wrap gap-1">
              {familyVariants.slice(0, 4).map((v) => {
                const isActive = v.id === active.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveId(v.id);
                    }}
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors",
                      isActive
                        ? "bg-[var(--brand-green)] text-white border-[var(--brand-green)]"
                        : "bg-transparent text-[var(--text-muted)] border-[var(--bg-border-strong)] hover:border-[var(--brand-copper)] hover:text-[var(--brand-copper)]",
                    )}
                    title={`${v.name.en}${v.strength ? " - " + v.strength : ""}`}
                  >
                    {v.strength ?? v.name.en}
                  </button>
                );
              })}
              {familyVariants.length > 4 && (
                <span className="px-2 py-0.5 text-[10px] font-bold text-[var(--text-subtle)]">
                  +{familyVariants.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto pt-2.5 border-t border-[var(--bg-border)] flex items-end justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[9px] text-[var(--text-subtle)] font-medium mb-0.5 truncate tabular-nums">
              {secondaryLine}
            </div>
            <div className="font-bold text-[15px] text-[var(--brand-green)] tabular-nums">
              {primaryValue}
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              add(active, 1);
            }}
            aria-label={t("productAddToCart")}
            className="theme-aware w-8 h-8 rounded-full bg-[var(--brand-sage)] text-[var(--brand-green)] flex items-center justify-center hover:bg-[var(--brand-copper)] hover:text-white active:scale-[0.92] transition-colors flex-shrink-0"
          >
            <Plus size={14} weight="bold" />
          </button>
        </div>
      </div>
    </article>
  );
}
