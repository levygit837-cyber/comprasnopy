"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { formatFromUSD, DEFAULT_RATES } from "./store";
import { getPrimaryImage } from "./images";
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

interface CartState {
  lines: CartLine[];
  drawerOpen: boolean;
  detailProduct: Product | null;
  detailVariants: Product[];
  add: (product: Product, qty?: number) => void;
  remove: (lineId: string) => void;
  setQty: (lineId: string, qty: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  openDetail: (product: Product, variants: Product[]) => void;
  closeDetail: () => void;
}

export const lineIdFor = (product: Product): string =>
  `${product.id}::${product.strength || ""}`;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      drawerOpen: false,
      detailProduct: null,
      detailVariants: [],
      add: (product, qty = 1) =>
        set((state) => {
          const id = lineIdFor(product);
          const existing = state.lines.find((l) => l.id === id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.id === id ? { ...l, qty: l.qty + qty } : l,
              ),
              drawerOpen: true,
            };
          }
          const line: CartLine = {
            id,
            productId: product.id,
            name: product.name.en,
            strength: product.strength || "",
            priceUSD: product.priceUSD,
            qty,
            image: getPrimaryImage(product),
            category: product.category,
            lab: product.lab,
          };
          return { lines: [...state.lines, line], drawerOpen: true };
        }),
      remove: (lineId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.id !== lineId) })),
      setQty: (lineId, qty) =>
        set((state) => {
          if (qty <= 0) return { lines: state.lines.filter((l) => l.id !== lineId) };
          return {
            lines: state.lines.map((l) =>
              l.id === lineId ? { ...l, qty: Math.max(1, Math.floor(qty)) } : l,
            ),
          };
        }),
      clear: () => set({ lines: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),
      openDetail: (product, variants) =>
        set({ detailProduct: product, detailVariants: variants }),
      closeDetail: () => set({ detailProduct: null, detailVariants: [] }),
    }),
    {
      name: "viana.cart.v1",
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
