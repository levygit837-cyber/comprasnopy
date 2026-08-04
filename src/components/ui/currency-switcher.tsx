"use client";

import * as Popover from "@radix-ui/react-popover";
import { CaretDown, Check } from "@phosphor-icons/react/dist/ssr";

import { CURRENCIES, formatRate, type CurrencyCode } from "@/lib/store";
import { useCurrency } from "@/lib/currency-context";
import { cn } from "@/lib/utils";

export function CurrencySwitcher({ compact = false }: { compact?: boolean }) {
  const { currency, setCurrency, meta, rates } = useCurrency();

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={cn(
            "theme-aware flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border border-[var(--bg-border-strong)] bg-[var(--bg-muted)] px-2.5 py-1 transition-colors hover:bg-[var(--bg-card)] hover:border-[var(--brand-primary)]",
            compact && "px-2 py-1",
          )}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[var(--brand-primary)]">
            {meta.code} {formatRate(meta.code, rates[meta.code])}
          </span>
          <CaretDown size={9} weight="bold" className="opacity-60" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align={compact ? "end" : "start"}
          sideOffset={8}
          className="theme-aware z-[80] bg-[var(--bg-card)] rounded-xl shadow-lg border border-[var(--bg-border-strong)] p-1 min-w-[180px] animate-fade-in"
        >
          {Object.values(CURRENCIES).map((c) => (
            <Popover.Close key={c.code} asChild>
              <button
                type="button"
                onClick={() => setCurrency(c.code as CurrencyCode)}
                className={cn(
                  "theme-aware flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors",
                  c.code === currency
                    ? "bg-[var(--brand-soft)] text-[var(--brand-primary)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-muted)]",
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="font-bold tabular-nums w-12">{c.code}</span>
                  <span className="text-[10px] font-medium text-[var(--text-muted)]">
                    {formatRate(c.code as CurrencyCode, rates[c.code as CurrencyCode])}
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-[9px] text-[var(--text-subtle)] uppercase tracking-wider">
                    {c.label}
                  </span>
                  {c.code === currency && (
                    <Check size={11} weight="bold" className="text-[var(--brand-primary)]" />
                  )}
                </span>
              </button>
            </Popover.Close>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
