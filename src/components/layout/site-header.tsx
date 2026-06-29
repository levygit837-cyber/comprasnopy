"use client";

import Link from "next/link";
import { Heartbeat, List, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

import { categories } from "@/lib/categories";
import { useLanguage } from "@/lib/language-context";
import { CartButton } from "@/components/cart/cart-button";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthPopover } from "@/components/auth/auth-popover";
import { SearchDropdown } from "@/components/search/search-dropdown";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const { t, lang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "theme-aware sticky top-0 w-full z-40 border-b bg-[var(--header-bg)]",
        scrolled
          ? "shadow-md border-[var(--bg-border-strong)]"
          : "shadow-sm border-[var(--bg-border)]",
      )}
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between gap-3 lg:gap-6">
        <button
          type="button"
          className="md:hidden text-[var(--text)]"
          aria-label={t("navMenu")}
        >
          <List size={20} />
        </button>

        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-[var(--brand-green)] text-white flex items-center justify-center group-hover:bg-[var(--brand-green-mid)] transition-colors duration-200">
            <Heartbeat size={18} weight="fill" />
          </div>
          <span className="font-sans font-semibold text-lg md:text-xl text-[var(--brand-green)] tracking-tight leading-none mt-0.5">
            VIANA
          </span>
        </Link>

        <SearchDropdown />

        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          <button
            type="button"
            className="md:hidden text-[var(--text)]"
            aria-label={t("navSearch")}
          >
            <MagnifyingGlass size={20} />
          </button>

          <div className="hidden xl:block">
            <CurrencySwitcher compact />
          </div>

          <ThemeToggle className="hidden sm:flex" />

          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>

          <AuthPopover />

          <CartButton />
        </div>
      </div>

      <div className="theme-aware w-full bg-[var(--bg-card)] border-t border-[var(--bg-border)]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
          <nav className="flex items-center gap-5 lg:gap-7 overflow-x-auto no-scrollbar whitespace-nowrap py-2 text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/products?category=${c.slug}`}
                className="hover:text-[var(--brand-green)] transition-colors"
              >
                {c.name[lang]}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
