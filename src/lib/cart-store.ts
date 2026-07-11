"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { formatFromUSD, DEFAULT_RATES } from "./store";
import { getPrimaryImage } from "./images";
import { checkRateLimit } from "./rate-limit";
import { useOverlayStore } from "./overlay-store";
import { productById } from "./products";
import type { Product } from "./types";

export interface CartLine {
  id: string;
  productId: string;
  name: string;
  strength: string;
  priceUSD: number;
  qty: number;
  image: string | null;
  category?: string;
  lab?: string;
}

export interface CartNotification {
  id: string;
  productId: string;
  name: string;
  strength: string;
  qty: number;
  image: string | null;
  /** Increments on every add so subscribers can detect new events. */
  token: number;
}

interface CartState {
  lines: CartLine[];
  detailProduct: Product | null;
  detailVariants: Product[];
  /** Latest add event, consumed by the notifier. */
  lastAdded: CartNotification | null;
  /** Wall-clock ms of the last `add()` that passed the rate-limit check. */
  lastAddAt: number;
  add: (product: Product, qty?: number) => void;
  remove: (lineId: string) => void;
  setQty: (lineId: string, qty: number) => void;
  clear: () => void;
  openDetail: (product: Product, variants: Product[]) => void;
  closeDetail: () => void;
  /** Acknowledge the most recent add so the notifier can dismiss. */
  consumeLastAdded: () => void;
}

/**
 * Hard cap on how many "add to cart" clicks a single tab can issue per
 * second. Mass-clicking the "+" button should never reach the notifier or
 * the cart lines, so we drop the event at the store level. Real users
 * click a few times per minute at most.
 */
const MAX_ADDS_PER_SECOND = 8;

export const lineIdFor = (product: Product): string =>
  `${product.id}::${product.strength || ""}`;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      detailProduct: null,
      detailVariants: [],
      lastAdded: null,
      lastAddAt: 0,
      add: (product, qty = 1) => {
        // Throttle mass-clicks at the store boundary. The check is a pure
        // function of time so it costs nothing and survives across renders.
        const now = Date.now();
        const rl = checkRateLimit({
          key: "cart:add",
          limit: MAX_ADDS_PER_SECOND,
          windowMs: 1_000,
        });
        if (!rl.ok) return;
        set((state) => {
          const id = lineIdFor(product);
          const existing = state.lines.find((l) => l.id === id);
          const nextLines = existing
            ? state.lines.map((l) =>
                l.id === id ? { ...l, qty: l.qty + qty } : l,
              )
            : [
                ...state.lines,
                {
                  id,
                  productId: product.id,
                  name: product.name.en,
                  strength: product.strength || "",
                  priceUSD: product.priceUSD,
                  qty,
                  image: getPrimaryImage(product),
                  category: product.category,
                  lab: product.lab,
                },
              ];
          const newQty = existing ? existing.qty + qty : qty;
          return {
            lines: nextLines,
            lastAddAt: now,
            lastAdded: {
              id,
              productId: product.id,
              name: product.name.en,
              strength: product.strength || "",
              qty: newQty,
              image: getPrimaryImage(product),
              token: (state.lastAdded?.token ?? 0) + 1,
            },
          };
        });
      },
      remove: (lineId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.id !== lineId) })),
      setQty: (lineId, qty) =>
        set((state) => {
          if (!checkRateLimit({ key: "cart:setQty", limit: 30, windowMs: 1_000 }).ok) {
            return {};
          }
          if (qty <= 0) return { lines: state.lines.filter((l) => l.id !== lineId) };
          return {
            lines: state.lines.map((l) =>
              l.id === lineId ? { ...l, qty: Math.max(1, Math.floor(qty)) } : l,
            ),
          };
        }),
      clear: () => set({ lines: [] }),
      openDetail: (product, variants) => {
        set({ detailProduct: product, detailVariants: variants });
        // The Radix Dialog open prop in ProductDetailDrawer subscribes to
        // the overlay store, so we toggle it here in lockstep. Throttled
        // to keep mass-clicks cheap.
        if (checkRateLimit({ key: "ui:openDetail", limit: 12, windowMs: 1_000 }).ok) {
          useOverlayStore.getState().open("detail");
        }
      },
      closeDetail: () => {
        set({ detailProduct: null, detailVariants: [] });
        useOverlayStore.getState().close("detail");
      },
      consumeLastAdded: () => set({ lastAdded: null }),
    }),
    {
      name: "viana.cart.v1",
      version: 2,
      migrate: (persisted) => {
        const state = persisted as Partial<CartState>;
        return {
          ...state,
          lines: (state.lines ?? []).map((line) => {
            const product = productById(line.productId);
            return {
              ...line,
              image: product ? getPrimaryImage(product) : null,
            };
          }),
        } as CartState;
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

export const totalUnits = (lines: CartLine[]): number =>
  lines.reduce((n, l) => n + l.qty, 0);

export const totalUSD = (lines: CartLine[]): number =>
  lines.reduce((sum, l) => sum + l.qty * l.priceUSD, 0);

export const formatTotal = (lines: CartLine[], currency: "USD" | "BRL" | "PYG"): string =>
  formatFromUSD(totalUSD(lines), currency, "es", DEFAULT_RATES);

export const buildWhatsAppMessage = (
  lines: CartLine[],
  totalUSDValue: number,
  intro: string,
  currency: "USD" | "BRL" | "PYG",
  phone: string,
): string => {
  const formattedTotal = formatFromUSD(totalUSDValue, currency, "es", DEFAULT_RATES);
  const items = lines
    .map((l, i) => {
      const label = l.strength ? `${l.name} (${l.strength})` : l.name;
      const price = formatFromUSD(l.priceUSD * l.qty, currency, "es", DEFAULT_RATES);
      const lab = l.lab ? ` - ${l.lab}` : "";
      return `${i + 1}. ${label} x${l.qty} - ${price}${lab}`;
    })
    .join("\n");
  const totalLine = `Total: ${formattedTotal}`;
  const message = `${intro.replace(/\{total\}/g, formattedTotal)}\n${items}\n${totalLine}`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
};
