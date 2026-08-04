"use client";

import Link from "next/link";

import { useLanguage } from "@/lib/language-context";

export function CatalogPageHeader() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-[1400px] border-b border-[var(--bg-border)] px-4 pb-3 pt-4 md:px-6 lg:px-8">
      <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-subtle)]">
        <Link href="/" className="hover:text-[var(--brand-primary)]">
          {t("breadcrumbHome")}
        </Link>
        <span>/</span>
        <span className="text-[var(--brand-primary)]">{t("breadcrumbCatalog")}</span>
      </div>
      <h1 className="font-sans text-2xl font-semibold tracking-tight text-[var(--brand-primary)] md:text-3xl">
        {t("catalogTitle")}
      </h1>
    </div>
  );
}
