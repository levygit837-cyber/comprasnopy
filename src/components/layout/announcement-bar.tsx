"use client";

import { Moped, Storefront } from "@phosphor-icons/react/dist/ssr";

import { useLanguage } from "@/lib/language-context";

export function AnnouncementBar() {
  const { t } = useLanguage();
  return (
    <div className="theme-aware bg-[var(--brand-green)] text-white text-[10px] font-medium py-1.5 px-4 text-center tracking-wide z-[55] relative flex items-center justify-center gap-4">
      <span className="flex items-center gap-1">
        <Moped size={11} weight="fill" className="text-[var(--brand-copper)]" />
        {t("announceShipping")}
      </span>
      <span className="hidden sm:inline opacity-30">|</span>
      <span className="hidden sm:inline-flex items-center gap-1">
        <Storefront size={11} weight="fill" className="text-[var(--brand-copper)]" />
        {t("announcePickup")}
      </span>
    </div>
  );
}
