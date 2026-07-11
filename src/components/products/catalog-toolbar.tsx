"use client";

import * as Select from "@radix-ui/react-select";
import { CaretDown, Check, Funnel } from "@phosphor-icons/react/dist/ssr";

import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

export type SortKey = "relevance" | "price-asc" | "price-desc" | "newest";

type SortLabelKey = "catalogRelevance" | "catalogPriceAsc" | "catalogPriceDesc" | "catalogNew";

const SORT_OPTIONS: { value: SortKey; labelKey: SortLabelKey }[] = [
  { value: "relevance", labelKey: "catalogRelevance" },
  { value: "price-asc", labelKey: "catalogPriceAsc" },
  { value: "price-desc", labelKey: "catalogPriceDesc" },
  { value: "newest", labelKey: "catalogNew" },
];

interface CatalogToolbarProps {
  sort: SortKey;
  onSortChange: (key: SortKey) => void;
  count: number;
  onOpenFilters?: () => void;
}

export function CatalogToolbar({ sort, onSortChange, count, onOpenFilters }: CatalogToolbarProps) {
  const { t, tpl } = useLanguage();
  const active = SORT_OPTIONS.find((o) => o.value === sort);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
        {tpl("catalogCount", { count })}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenFilters}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--bg-border-strong)] bg-[var(--bg-card)] text-[var(--text-muted)] lg:hidden"
          aria-label={t("catalogFilters")}
        >
          <Funnel size={12} />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)] hidden sm:inline">
            {t("catalogSort")}:
          </span>
          <Select.Root value={sort} onValueChange={(v) => onSortChange(v as SortKey)}>
            <Select.Trigger
              className={cn(
                "theme-aware flex min-h-11 items-center gap-2 rounded-lg border border-[var(--bg-border-strong)] bg-[var(--bg-card)] px-3 py-2 text-xs font-bold text-[var(--text)]",
                "hover:bg-[var(--bg-muted)] outline-none focus:border-[var(--brand-copper)]",
              )}
            >
              <Select.Value>{active ? t(active.labelKey) : t("catalogRelevance")}</Select.Value>
              <Select.Icon>
                <CaretDown size={10} weight="bold" className="opacity-60" />
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position="popper"
                sideOffset={6}
                className="z-[80] bg-[var(--bg-card)] rounded-xl shadow-lg border border-[var(--bg-border-strong)] p-1 min-w-[160px] animate-fade-in"
              >
                <Select.Viewport>
                  {SORT_OPTIONS.map((o) => (
                    <Select.Item
                      key={o.value}
                      value={o.value}
                      className={cn(
                        "flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer outline-none",
                        o.value === sort
                          ? "bg-[var(--brand-sage)] text-[var(--brand-green)]"
                          : "text-[var(--text-muted)] hover:bg-[var(--bg-muted)] focus:bg-[var(--bg-muted)]",
                      )}
                    >
                      <Select.ItemText>{t(o.labelKey)}</Select.ItemText>
                      <Select.ItemIndicator>
                        <Check size={11} weight="bold" className="text-[var(--brand-copper)]" />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>
    </div>
  );
}
