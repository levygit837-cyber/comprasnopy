"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Check, ShoppingBag, X } from "@phosphor-icons/react/dist/ssr";

import { useCartStore } from "@/lib/cart-store";
import { useLanguage } from "@/lib/language-context";
import { useOverlayStore } from "@/lib/overlay-store";

/**
 * Lightweight bottom-right toast that surfaces "added to cart" events without
 * auto-opening the drawer. Subscribes to the cart store's `lastAdded` token:
 * every time `add()` is called, the token increments, the notifier shows the
 * product for ~3s, and a "Ver bolsa" button opens the drawer on demand.
 *
 * Animations: the panel slides up + fades in, and slides down + fades out
 * when dismissed (either manually or by the auto-close timer). It stays
 * mounted briefly during the exit transition so the slide-out is visible.
 */
export function CartNotifier() {
  const lastAdded = useCartStore((s) => s.lastAdded);
  const consume = useCartStore((s) => s.consumeLastAdded);
  const openOverlay = useOverlayStore((s) => s.open);
  const { t } = useLanguage();

  // `phase` drives the transition: 'enter' shows, 'idle' holds, 'exit' hides.
  const [phase, setPhase] = useState<"enter" | "idle" | "exit">("idle");
  const timerRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);
  const lastTokenRef = useRef<number>(0);

  useEffect(() => {
    if (!lastAdded) return;
    if (lastAdded.token === lastTokenRef.current) return;
    lastTokenRef.current = lastAdded.token;

    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current);
      exitTimerRef.current = null;
    }
    if (timerRef.current) window.clearTimeout(timerRef.current);

    setPhase("enter");
    timerRef.current = window.setTimeout(() => {
      setPhase("exit");
      exitTimerRef.current = window.setTimeout(() => {
        setPhase("idle");
        consume();
      }, 250);
    }, 3200);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
    };
  }, [lastAdded, consume]);

  if (!lastAdded || phase === "idle") return null;

  const handleClose = () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    setPhase("exit");
    if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
    exitTimerRef.current = window.setTimeout(() => {
      setPhase("idle");
      consume();
    }, 250);
  };

  const isVisible = phase === "enter";

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[75] pointer-events-none"
    >
      <div
        className={`theme-aware pointer-events-auto flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--bg-border-strong)] rounded-2xl shadow-2xl pl-2 pr-3 py-2 max-w-[340px] ${
          isVisible
            ? "animate-notifier-in"
            : "animate-notifier-out"
        }`}
      >
        <div
          className="w-10 h-10 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center"
          style={{ backgroundColor: "var(--image-bg)" }}
        >
          {lastAdded.image ? (
            <Image
              src={lastAdded.image}
              alt={lastAdded.name}
              width={40}
              height={40}
              className="w-full h-full object-contain"
              style={{ mixBlendMode: "var(--image-blend)" as React.CSSProperties["mixBlendMode"] }}
              unoptimized
            />
          ) : (
            <ShoppingBag size={14} className="text-[var(--text-subtle)]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="flex items-center gap-1 text-[10px] font-bold text-[var(--brand-green)] uppercase tracking-wider">
            <Check size={10} weight="bold" /> {t("productAdded")}
          </p>
          <p className="text-xs font-bold text-[var(--text)] truncate">
            {lastAdded.name}
            {lastAdded.strength && (
              <span className="text-[var(--text-muted)] font-medium">
                {" "}- {lastAdded.strength}
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={() => {
              handleClose();
              openOverlay("cart");
            }}
            className="mt-0.5 text-[10px] font-bold text-[var(--brand-copper)] hover:text-[var(--brand-copper-dark)] transition-colors"
          >
            {t("cartTitle")} &rarr;
          </button>
        </div>
        <button
          type="button"
          onClick={handleClose}
          aria-label={t("cartClose")}
          className="theme-aware w-6 h-6 rounded-full bg-[var(--bg-muted)] hover:bg-[var(--bg-border)] flex items-center justify-center text-[var(--text-muted)] flex-shrink-0"
        >
          <X size={10} weight="bold" />
        </button>
      </div>
    </div>
  );
}
