"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { ProductGridCard } from "@/components/products/product-grid-card";
import { groupForDisplay } from "@/lib/variants";
import { featuredProducts, products } from "@/lib/products";
import { useLanguage } from "@/lib/language-context";

export function BestSellers() {
  const { t } = useLanguage();

  const items = groupForDisplay(featuredProducts());
  const fillCount = Math.max(0, 4 - items.length);
  const fillerSource = groupForDisplay(
    products.filter((p) => !p.featured).slice(0, fillCount * 2),
  );
  const fillers = fillerSource.slice(0, fillCount);
  const display = [...items, ...fillers].slice(0, 4);

  if (display.length === 0) return null;

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 mt-10 md:mt-14">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h3 className="font-sans text-2xl md:text-3xl text-[var(--brand-green)] font-semibold tracking-tight">
            {t("bestSellersTitle")}
          </h3>
          <p className="text-[var(--text-muted)] text-xs mt-0.5 font-medium">
            {t("bestSellersSubtitle")}
          </p>
        </div>
        <Link
          href="/products"
          className="hidden sm:flex text-xs font-bold text-[var(--brand-copper)] items-center gap-1 hover:text-[var(--brand-copper-dark)] transition-colors"
        >
          {t("bestSellersViewAll")} <ArrowRight size={10} weight="bold" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {display.map((item) => (
          <div key={item.primary.id} className="cv-auto">
            <ProductGridCard
              product={item.primary}
              variants={item.isGroup ? item.variants : undefined}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
