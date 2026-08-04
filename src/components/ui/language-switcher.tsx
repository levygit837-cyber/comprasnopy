"use client";

import * as Popover from "@radix-ui/react-popover";
import { CaretDown, Check } from "@phosphor-icons/react/dist/ssr";

import { LANGS, type Lang } from "@/lib/store";
import { useLanguage } from "@/lib/language-context";
import { cn } from "@/lib/utils";

const LANG_LABEL: Record<Lang, string> = {
  es: "ES",
  pt: "PT",
  en: "EN",
};

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const current = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="theme-aware flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider rounded-full text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors"
          aria-label="Change language"
        >
          {LANG_LABEL[lang]}
          <CaretDown size={9} weight="bold" className="opacity-60" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="theme-aware z-[80] bg-[var(--bg-card)] rounded-xl shadow-lg border border-[var(--bg-border-strong)] p-1 min-w-[140px] animate-fade-in"
        >
          {LANGS.map((l) => (
            <Popover.Close key={l.code} asChild>
              <button
                type="button"
                onClick={() => setLang(l.code as Lang)}
                className={cn(
                  "theme-aware flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-colors",
                  l.code === lang
                    ? "bg-[var(--brand-soft)] text-[var(--brand-primary)]"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-muted)]",
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="text-[10px] opacity-70 w-6">
                    {LANG_LABEL[l.code as Lang]}
                  </span>
                  {l.label}
                </span>
                {l.code === lang && (
                  <Check size={11} weight="bold" className="text-[var(--brand-primary)]" />
                )}
              </button>
            </Popover.Close>
          ))}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
