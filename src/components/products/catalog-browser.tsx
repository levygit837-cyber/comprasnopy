"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";

import { ProductGridCard } from "@/components/products/product-grid-card";
import { CatalogSidebar } from "@/components/products/catalog-sidebar";
import { CatalogToolbar, type SortKey } from "@/components/products/catalog-toolbar";
import { categories } from "@/lib/categories";
import { products } from "@/lib/products";
import { groupForDisplay } from "@/lib/variants";
import { useLanguage } from "@/lib/language-context";

export function CatalogBrowser() {
  const searchParams = useSearchParams();
  const { t, lang } = useLanguage();

  const initialCategory = searchParams.get("category") ?? "all";
  const initialFeatured = searchParams.get("featured") === "true";

  const [category, setCategory] = useState<string>(initialCategory);
  const [maxPriceUSD, setMaxPriceUSD] = useState<number>(500);
  const [sort, setSort] = useState<SortKey>("relevance");

  const filtered = useMemo(() => {
    let list = products.slice();
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (initialFeatured) list = list.filter((p) => p.featured);
    list = list.filter((p) => p.priceUSD <= maxPriceUSD);

    if (sort === "price-asc") list.sort((a, b) => a.priceUSD - b.priceUSD);
    if (sort === "price-desc") list.sort((a, b) => b.priceUSD - a.priceUSD);
    if (sort === "newest") list = list.filter((p) => p.featured).concat(list);

    return list;
  }, [category, initialFeatured, maxPriceUSD, sort]);

  const items = useMemo(() => groupForDisplay(filtered), [filtered]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-5 flex flex-col lg:flex-row items-start gap-5 lg:gap-6">
      <CatalogSidebar
        category={category}
        onCategoryChange={setCategory}
        maxPriceUSD={maxPriceUSD}
        onMaxPriceChange={setMaxPriceUSD}
      />

      <div className="flex-1 min-w-0 w-full">
        <CatalogToolbar sort={sort} onSortChange={setSort} count={filtered.length} />

        {category !== "all" && (
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <button
              type="button"
              onClick={() => setCategory("all")}
              className="theme-aware bg-[var(--brand-sage)] text-[var(--brand-green)] text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 hover:bg-[var(--bg-muted)] transition-colors"
            >
              {categories.find((c) => c.id === category)?.name[lang]}
              <X size={10} weight="bold" />
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="font-sans text-xl font-semibold text-[var(--brand-green)] tracking-tight mb-1">
              {t("catalogEmpty")}
            </h3>
            <p className="text-[var(--text-muted)] text-xs">{t("catalogEmptyBody")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {items.map((item) => (
              <div key={item.primary.id} className="cv-auto">
                <ProductGridCard
                  product={item.primary}
                  variants={item.isGroup ? item.variants : undefined}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
