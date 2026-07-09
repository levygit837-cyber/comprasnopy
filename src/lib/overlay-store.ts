"use client";

import { create } from "zustand";

/** Identifiers for every "modal" surface in the storefront. */
export type OverlayId = "auth" | "cart" | "detail";

interface OverlayState {
  active: OverlayId | null;
  open: (id: OverlayId) => void;
  close: (id: OverlayId) => void;
  closeAll: () => void;
  toggle: (id: OverlayId) => void;
  isOpen: (id: OverlayId) => boolean;
}

/**
 * Single source of truth for which overlay surface is currently visible.
 * Used to enforce mutual exclusion: opening one overlay closes any other
 * (so e.g. clicking the cart icon while the auth popover is open closes
 * the popover instead of leaving a floating card on screen).
 */
export const useOverlayStore = create<OverlayState>()((set, get) => ({
  active: null,
  open: (id) => set({ active: id }),
  close: (id) =>
    set((state) => (state.active === id ? { active: null } : state)),
  closeAll: () => set({ active: null }),
  toggle: (id) =>
    set((state) => ({ active: state.active === id ? null : id })),
  isOpen: (id) => get().active === id,
}));

/**
 * Convenience hook returning a boolean suitable for Radix `open` props.
 * Subscribes to the store so the component re-renders when the active
 * overlay changes.
 */
export function useOverlayOpen(id: OverlayId): boolean {
  return useOverlayStore((s) => s.active === id);
}
