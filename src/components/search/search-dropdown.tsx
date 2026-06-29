"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

import { scoreQuery, type Result } from "@/lib/search";
import { useCurrency } from "@/lib/currency-context";
import { useLanguage } from "@/lib/language-context";
import { getPrimaryImage } from "@/lib/images";

export function SearchDropdown() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { t } = useLanguage();
  const { format } = useCurrency();

  const results: Result[] = useMemo(() => {
    if (query.trim().length < 2) return [];
    return scoreQuery(query, 6);
  }, [query]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-grow max-w-xl hidden md:block relative z-50 group"
    >
      <div className="relative flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("navSearch")}
          className="theme-aware w-full h-9 pl-9 pr-3 rounded-full bg-[var(--bg-muted)] border border-transparent focus:bg-[var(--bg-card)] focus:border-[var(--brand-copper)] focus:ring-2 focus:ring-[var(--brand-copper)]/10 outline-none text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] font-medium"
        />
        <MagnifyingGlass
          size={14}
          weight="regular"
          className="absolute left-3 text-[var(--text-muted)] group-focus-within:text-[var(--brand-copper)] transition-colors"
        />
      </div>

      {open && query.trim().length >= 2 && (
        <div className="theme-aware absolute top-full left-0 right-0 mt-2 bg-[var(--bg-card)] rounded-2xl shadow-lg border border-[var(--bg-border-strong)] overflow-hidden animate-fade-in z-[80]">
          {results.length === 0 ? (
            <div className="p-4 text-center text-xs text-[var(--text-muted)]">
              {t("searchNoResults")} &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              <div className="p-2 border-b border-[var(--bg-border)] text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-wider">
                {t("searchSuggestions")}
              </div>
              <div className="p-1 max-h-[400px] overflow-y-auto">
                {results.map(({ product }) => {
                  const img = getPrimaryImage(product);
                  return (
                    <Link
                      key={product.id}
                      href={`/products?focus=${product.slug}`}
                      onClick={() => setOpen(false)}
                      className="theme-aware flex items-center gap-2.5 p-2 hover:bg-[var(--bg-muted)] rounded-lg transition-colors"
                    >
                      <div
                        className="w-10 h-10 rounded-md flex-shrink-0 overflow-hidden relative"
                        style={{ backgroundColor: "var(--image-bg)" }}
                      >
                        {img && (
                          <Image
                            src={img}
                            alt={product.name.en}
                            width={40}
                            height={40}
                            loading="lazy"
                            className="w-full h-full object-contain"
                            style={{ mixBlendMode: "var(--image-blend)" as React.CSSProperties["mixBlendMode"] }}
                            unoptimized
                          />
                        )}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-semibold text-[var(--text)] truncate">
                          {product.name.en}
                        </p>
                        {product.strength && (
                          <p className="text-[10px] text-[var(--text-muted)] truncate">
                            {product.strength}
                          </p>
                        )}
                      </div>
                      <p className="text-xs font-bold tabular-nums text-[var(--brand-green)]">
                        {format(product.priceUSD)}
                      </p>
                    </Link>
                  );
                })}
              </div>
              <div className="p-2 bg-[var(--bg-muted)] text-center border-t border-[var(--bg-border)]">
                <Link
                  href={`/products?q=${encodeURIComponent(query)}`}
                  onClick={() => setOpen(false)}
                  className="text-xs text-[var(--brand-copper)] font-bold hover:text-[var(--brand-copper-dark)] inline-flex items-center gap-1"
                >
                  {t("searchViewAll")} &rarr;
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
