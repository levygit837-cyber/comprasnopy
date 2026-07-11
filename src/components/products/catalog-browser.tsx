"use client";

import * as Dialog from "@radix-ui/react-dialog";
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
import { scoreQuery } from "@/lib/search";

export function CatalogBrowser() {
  const searchParams = useSearchParams();
  const { t, lang } = useLanguage();

  const initialCategory = searchParams.get("category") ?? "all";
  const initialFeatured = searchParams.get("featured") === "true";
  const query = searchParams.get("q")?.trim() ?? "";

  const [category, setCategory] = useState<string>(initialCategory);
  const [maxPriceUSD, setMaxPriceUSD] = useState<number>(500);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.slice();
    if (query) {
      const matchingIds = new Set(scoreQuery(query, products.length).map(({ product }) => product.id));
      list = list.filter((product) => matchingIds.has(product.id));
    }
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (initialFeatured) list = list.filter((p) => p.featured);
    list = list.filter((p) => p.priceUSD <= maxPriceUSD);

    if (sort === "price-asc") list.sort((a, b) => a.priceUSD - b.priceUSD);
    if (sort === "price-desc") list.sort((a, b) => b.priceUSD - a.priceUSD);
    if (sort === "newest") {
      list.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    }

    return list;
  }, [category, initialFeatured, maxPriceUSD, query, sort]);

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
        <CatalogToolbar
          sort={sort}
          onSortChange={setSort}
          count={items.length}
          onOpenFilters={() => setMobileFiltersOpen(true)}
        />

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
            {items.map((item, index) => (
              <div key={item.primary.id} className="cv-auto">
                <ProductGridCard
                  product={item.primary}
                  variants={item.isGroup ? item.variants : undefined}
                  priority={index < 4}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog.Root open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-[var(--brand-green)]/35 backdrop-blur-sm data-[state=open]:animate-fade-in" />
          <Dialog.Content className="theme-aware fixed inset-y-0 left-0 z-[70] h-[100dvh] w-[min(90vw,380px)] overflow-y-auto bg-[var(--bg-card)] shadow-2xl focus:outline-none lg:hidden">
            <header className="sticky top-0 z-10 flex min-h-16 items-center justify-between border-b border-[var(--bg-border)] bg-[var(--bg-card)] px-4">
              <Dialog.Title className="text-sm font-bold text-[var(--text)]">
                {t("catalogFilters")}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  aria-label={t("cartClose")}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-muted)]"
                >
                  <X size={17} weight="bold" />
                </button>
              </Dialog.Close>
            </header>
            <CatalogSidebar
              mobile
              category={category}
              onCategoryChange={(nextCategory) => {
                setCategory(nextCategory);
                setMobileFiltersOpen(false);
              }}
              maxPriceUSD={maxPriceUSD}
              onMaxPriceChange={setMaxPriceUSD}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
