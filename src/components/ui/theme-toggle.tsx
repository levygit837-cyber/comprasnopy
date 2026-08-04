"use client";

import { Moon, Sun } from "@phosphor-icons/react/dist/ssr";

import { useTheme } from "@/lib/theme-context";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "theme-aware w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--brand-primary)] hover:bg-[var(--brand-soft)] transition-colors",
        className,
      )}
    >
      {theme === "dark" ? <Sun size={14} weight="regular" /> : <Moon size={14} weight="regular" />}
    </button>
  );
}
