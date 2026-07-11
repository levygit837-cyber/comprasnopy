"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import {
  Heartbeat,
  List,
  MagnifyingGlass,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { useState } from "react";

import { categories } from "@/lib/categories";
import { useLanguage } from "@/lib/language-context";
import { CartButton } from "@/components/cart/cart-button";
import { CurrencySwitcher } from "@/components/ui/currency-switcher";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { AuthPopover } from "@/components/auth/auth-popover";
import { SearchDropdown } from "@/components/search/search-dropdown";

export function SiteHeader() {
  const { t, lang } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const settingsLabel =
    lang === "es" ? "Preferencias" : lang === "pt" ? "Preferencias" : "Preferences";

  return (
    <>
      <header className="theme-aware sticky top-0 z-40 w-full border-b border-[var(--bg-border-strong)] bg-[var(--header-bg)] shadow-sm">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-2 px-3 sm:px-4 md:h-16 md:px-6 lg:gap-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center text-[var(--text)] md:hidden"
            aria-label={t("navMenu")}
          >
            <List size={22} />
          </button>

          <Link href="/" className="group flex flex-shrink-0 items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--brand-green)] text-white transition-colors group-hover:bg-[var(--brand-green-mid)] md:h-9 md:w-9">
              <Heartbeat size={18} weight="fill" />
            </span>
            <span className="mt-0.5 text-lg font-semibold leading-none text-[var(--brand-green)] md:text-xl">
              VIANA
            </span>
          </Link>

          <SearchDropdown />

          <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2 md:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-11 w-10 items-center justify-center text-[var(--text)] md:hidden"
              aria-label={t("navSearch")}
            >
              <MagnifyingGlass size={21} />
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

        <div className="theme-aware w-full border-t border-[var(--bg-border)] bg-[var(--bg-card)]">
          <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-8">
            <nav className="no-scrollbar flex items-center gap-5 overflow-x-auto whitespace-nowrap py-2 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] lg:gap-7">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="transition-colors hover:text-[var(--brand-green)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-copper)]"
                >
                  {category.name[lang]}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-[var(--brand-green)]/35 backdrop-blur-sm data-[state=open]:animate-fade-in" />
          <Dialog.Content className="theme-aware fixed inset-y-0 left-0 z-[70] flex h-[100dvh] w-[min(88vw,360px)] flex-col overflow-hidden bg-[var(--bg-card)] shadow-2xl focus:outline-none">
            <header className="flex min-h-16 items-center justify-between border-b border-[var(--bg-border)] px-4">
              <Dialog.Title className="text-sm font-bold text-[var(--text)]">
                {t("navMenu")}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-muted)]"
                  aria-label={t("cartClose")}
                >
                  <X size={18} weight="bold" />
                </button>
              </Dialog.Close>
            </header>

            <nav className="flex-grow overflow-y-auto p-3">
              <Dialog.Close asChild>
                <Link
                  href="/products"
                  className="flex min-h-11 items-center rounded-lg px-3 text-sm font-bold text-[var(--brand-green)] hover:bg-[var(--brand-sage)]"
                >
                  {t("navAllCategories")}
                </Link>
              </Dialog.Close>
              {categories.map((category) => (
                <Dialog.Close asChild key={category.id}>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text)]"
                  >
                    {category.name[lang]}
                  </Link>
                </Dialog.Close>
              ))}
            </nav>

            <div className="border-t border-[var(--bg-border)] p-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-subtle)]">
                {settingsLabel}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <CurrencySwitcher />
                <LanguageSwitcher />
                <ThemeToggle className="h-11 w-11" />
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={searchOpen} onOpenChange={setSearchOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[60] bg-[var(--brand-green)]/35 backdrop-blur-sm data-[state=open]:animate-fade-in" />
          <Dialog.Content className="theme-aware fixed inset-x-0 top-0 z-[70] max-h-[100dvh] overflow-y-auto bg-[var(--bg-card)] p-4 shadow-2xl focus:outline-none md:hidden">
            <div className="mb-3 flex items-center justify-between">
              <Dialog.Title className="text-sm font-bold text-[var(--text)]">
                {t("navSearch")}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-muted)]"
                  aria-label={t("cartClose")}
                >
                  <X size={18} weight="bold" />
                </button>
              </Dialog.Close>
            </div>
            <SearchDropdown
              mobile
              autoFocus
              onNavigate={() => setSearchOpen(false)}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
