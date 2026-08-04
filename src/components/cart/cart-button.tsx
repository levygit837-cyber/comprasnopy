"use client";

import { ShoppingBag } from "@phosphor-icons/react/dist/ssr";

import { totalUnits, useCartStore } from "@/lib/cart-store";
import { useLanguage } from "@/lib/language-context";
import { useOverlayStore } from "@/lib/overlay-store";
import { cn } from "@/lib/utils";

export function CartButton({ className }: { className?: string }) {
  const lines = useCartStore((s) => s.lines);
  const { t } = useLanguage();
  const openOverlay = useOverlayStore((s) => s.open);
  const count = totalUnits(lines);

  return (
    <button
      type="button"
      onClick={() => openOverlay("cart")}
      aria-label={t("navCart")}
      className={cn(
        "theme-aware flex items-center gap-1.5 text-[var(--text)] hover:text-[var(--brand-primary)] transition-colors group",
        className,
      )}
    >
      <span className="relative bg-[var(--brand-soft)] group-hover:bg-[var(--brand-action)]/10 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
        <ShoppingBag size={15} weight="regular" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-[var(--brand-red)] text-white text-[9px] font-bold w-[15px] h-[15px] rounded-full flex items-center justify-center border-2 border-[var(--bg-card)]">
            {count}
          </span>
        )}
      </span>
      <span className="hidden md:flex flex-col items-start leading-none">
        <span className="text-[9px] text-[var(--text-muted)] font-medium uppercase tracking-wider mb-0.5">
          {t("navCart")}
        </span>
        <span className="text-[10px] font-bold tabular-nums">
          {count} {count === 1 ? "item" : "items"}
        </span>
      </span>
    </button>
  );
}
