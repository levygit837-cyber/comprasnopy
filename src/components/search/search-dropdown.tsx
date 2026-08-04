"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ImageSquare, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

import { scoreQuery, type Result } from "@/lib/search";
import { useCurrency } from "@/lib/currency-context";
import { useLanguage } from "@/lib/language-context";
import { getPrimaryImage } from "@/lib/images";
import { cn } from "@/lib/utils";

interface SearchDropdownProps {
  mobile?: boolean;
  autoFocus?: boolean;
  onNavigate?: () => void;
}

export function SearchDropdown({
  mobile = false,
  autoFocus = false,
  onNavigate,
}: SearchDropdownProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { t, lang } = useLanguage();
  const { format } = useCurrency();

  const results: Result[] = useMemo(() => {
    if (query.trim().length < 2) return [];
    return scoreQuery(query, 6);
  }, [query]);

  useEffect(() => {
    if (mobile) return;
    const onClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, [mobile]);

  const showResults = open && query.trim().length >= 2;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative group",
        mobile ? "block w-full" : "z-50 hidden max-w-xl flex-grow md:block",
      )}
    >
      <div className="relative flex w-full items-center">
        <input
          type="search"
          value={query}
          autoFocus={autoFocus}
          aria-label={t("navSearch")}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("navSearch")}
          className={cn(
            "theme-aware w-full rounded-full border border-transparent bg-[var(--bg-muted)] pl-10 pr-4 text-sm font-medium text-[var(--text)] outline-none placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:bg-[var(--bg-card)] focus:ring-2 focus:ring-[var(--brand-primary)]/10",
            mobile ? "h-12" : "h-9 text-xs",
          )}
        />
        <MagnifyingGlass
          size={mobile ? 17 : 14}
          className="absolute left-3.5 text-[var(--text-muted)] transition-colors group-focus-within:text-[var(--brand-primary)]"
        />
      </div>

      {showResults && (
        <div
          className={cn(
            "theme-aware overflow-hidden rounded-xl border border-[var(--bg-border-strong)] bg-[var(--bg-card)] animate-fade-in",
            mobile ? "relative mt-3" : "absolute left-0 right-0 top-full z-[80] mt-2 shadow-lg",
          )}
        >
          {results.length === 0 ? (
            <div className="p-5 text-center text-xs text-[var(--text-muted)]">
              {t("searchNoResults")} &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              <div className="border-b border-[var(--bg-border)] p-2 text-[10px] font-bold uppercase tracking-wider text-[var(--text-subtle)]">
                {t("searchSuggestions")}
              </div>
              <div className={cn("p-1", mobile ? "max-h-[58dvh] overflow-y-auto" : "max-h-[400px] overflow-y-auto")}>
                {results.map(({ product }) => {
                  const image = getPrimaryImage(product);
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => {
                        setOpen(false);
                        onNavigate?.();
                      }}
                      className="theme-aware flex min-h-14 items-center gap-3 rounded-lg p-2 transition-colors hover:bg-[var(--bg-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
                    >
                      <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-[var(--image-bg)]">
                        {image ? (
                          <Image
                            src={image}
                            alt=""
                            fill
                            sizes="44px"
                            loading="lazy"
                            quality={75}
                            className="object-contain"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-[var(--text-subtle)]">
                            <ImageSquare size={17} />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-grow">
                        <p className="truncate text-xs font-semibold text-[var(--text)]">
                          {product.name[lang]}
                        </p>
                        <p className="truncate text-[10px] text-[var(--text-muted)]">
                          {[product.lab, product.strength].filter(Boolean).join(" | ")}
                        </p>
                      </div>
                      <p className="text-xs font-bold tabular-nums text-[var(--brand-primary)]">
                        {format(product.priceUSD)}
                      </p>
                    </Link>
                  );
                })}
              </div>
              <div className="border-t border-[var(--bg-border)] bg-[var(--bg-muted)] p-2 text-center">
                <Link
                  href={`/products?q=${encodeURIComponent(query)}`}
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className="inline-flex min-h-9 items-center text-xs font-bold text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]"
                >
                  {t("searchViewAll")}
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
