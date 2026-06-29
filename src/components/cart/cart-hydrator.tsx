"use client";

import { useEffect } from "react";

import { useCartStore } from "@/lib/cart-store";

/**
 * The cart store rehydrates from localStorage on the client. We mount this
 * component once near the root so the first paint already reflects the
 * persisted state, avoiding an empty-bag flash.
 */
export function CartHydrator(): null {
  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);
  return null;
}
