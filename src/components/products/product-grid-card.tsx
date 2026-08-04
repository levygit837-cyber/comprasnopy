"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ImageSquare, Plus } from "@phosphor-icons/react/dist/ssr";

import { useCurrency } from "@/lib/currency-context";
import { useLanguage } from "@/lib/language-context";
import { useCartStore } from "@/lib/cart-store";
import { useTheme } from "@/lib/theme-context";
import { getImageSrcs, hasOpaqueProductCanvas } from "@/lib/images";
import { categoryById } from "@/lib/categories";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/types";

interface ProductGridCardProps {
  product: Product;
  /** Variants in the same family. When > 1, render the inline strength picker. */
  variants?: Product[];
  priority?: boolean;
}

export function ProductGridCard({ product, variants, priority = false }: ProductGridCardProps) {
  const { format, formatCompact, primaryCurrency } = useCurrency();
  const { t, lang } = useLanguage();
  const add = useCartStore((s) => s.add);
  const { theme } = useTheme();

  const category = categoryById(product.category);
  const familyVariants = variants && variants.length > 1 ? variants : null;

  const [activeId, setActiveId] = useState(product.id);
  const active: Product =
    familyVariants?.find((v) => v.id === activeId) ?? product;
  const images = getImageSrcs(active) ?? [];
  const primaryImage = images[0];
  const hasOpaqueCanvas = hasOpaqueProductCanvas(primaryImage);

  const order: Array<"USD" | "BRL" | "PYG"> = ["USD", "BRL", "PYG"];
  const secondary = order.filter((c) => c !== primaryCurrency);
  const primaryValue = format(active.priceUSD);
  const secondaryLine = secondary.map((c) => formatCompact(active.priceUSD, c)).join(" . ");

  return (
    <article className="theme-aware group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--bg-border)] bg-[var(--bg-card)] p-3 shadow-sm hover:shadow-[var(--shadow-hover)]">
      <Link
        href={`/products/${active.slug}`}
        className="relative w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center p-3"
        style={{ backgroundColor: "var(--image-bg)" }}
      >
        {primaryImage ? (
          <>
            <Image
              src={primaryImage}
              alt={active.name[lang]}
              fill
              sizes="(max-width: 639px) calc(50vw - 24px), (max-width: 1023px) 33vw, 240px"
              priority={priority}
              loading={priority ? undefined : "lazy"}
              quality={82}
              style={hasOpaqueCanvas && theme === "dark" ? { filter: "brightness(0.72) contrast(1.1)", opacity: 0.74 } : undefined}
              className="product-image-blend object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </>
        ) : (
          <span className="flex flex-col items-center gap-2 text-center text-[10px] font-medium text-[var(--text-subtle)]">
            <ImageSquare size={24} />
            {t("productImagePending")}
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 px-1 pt-2.5">
        <p className="mb-1 truncate text-[9px] font-bold uppercase tracking-wider text-[var(--text-subtle)]">
          {[category?.name[lang], active.lab, active.sku ? `Cod. ${active.sku}` : null]
            .filter(Boolean)
            .join(" | ")}
        </p>
        <h3 className="mb-2 min-h-8 text-[13px] font-bold leading-tight text-[var(--text)] line-clamp-2">
          {active.name[lang]}
        </h3>

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
                      "min-h-7 rounded-full border px-2 py-1 text-[10px] font-bold transition-colors",
                      isActive
                        ? "bg-[var(--brand-action)] text-white border-[var(--brand-primary)]"
                        : "bg-transparent text-[var(--text-muted)] border-[var(--bg-border-strong)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]",
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
            <div className="font-bold text-[15px] text-[var(--brand-primary)] tabular-nums">
              {primaryValue}
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              add(active, 1);
            }}
            aria-label={`${t("productAddToCart")}: ${active.name[lang]}`}
            className="theme-aware flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand-primary)] transition-colors hover:bg-[var(--brand-action)] hover:text-white active:scale-[0.92]"
          >
            <Plus size={14} weight="bold" />
          </button>
        </div>
      </div>
    </article>
  );
}
