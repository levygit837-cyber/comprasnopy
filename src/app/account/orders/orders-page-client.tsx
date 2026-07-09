"use client";

import Link from "next/link";

import { useLanguage } from "@/lib/language-context";

interface OrdersPageClientProps {
  empty: boolean;
}

/**
 * Client-side wrapper around the orders page so the page title, empty
 * state copy, and CTA button respect the active language. The list itself
 * lives in its own client component (`OrdersList`).
 */
export function OrdersPageClient({ empty, children }: OrdersPageClientProps & { children?: React.ReactNode }) {
  const { t } = useLanguage();

  if (empty) {
    return (
      <>
        <h1 className="font-sans text-2xl md:text-3xl font-semibold text-[var(--brand-green)] tracking-tight mb-4">
          {t("ordersTitle")}
        </h1>
        <div className="theme-aware bg-[var(--bg-card)] border border-[var(--bg-border)] rounded-2xl p-6 text-center">
          <p className="text-sm font-bold text-[var(--text)] mb-1">{t("ordersEmpty")}</p>
          <p className="text-xs text-[var(--text-muted)] mb-4">{t("ordersEmptyBody")}</p>
          <Link
            href="/products"
            className="inline-flex bg-[var(--brand-green)] text-white font-bold px-5 py-2 rounded-full hover:bg-[var(--brand-green-mid)] transition-colors text-xs"
          >
            {t("ordersBrowseCatalog")}
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="font-sans text-2xl md:text-3xl font-semibold text-[var(--brand-green)] tracking-tight mb-4">
        {t("ordersTitle")}
      </h1>
      {children}
    </>
  );
}
