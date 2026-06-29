"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  CURRENCIES,
  DEFAULT_RATES,
  formatFromUSD,
  type CurrencyCode,
  type CurrencyMeta,
} from "./store";

interface CurrencyContextValue {
  currency: CurrencyCode;
  primaryCurrency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  rates: Record<CurrencyCode, number>;
  format: (usd: number) => string;
  formatCompact: (usd: number, code?: CurrencyCode) => string;
  meta: CurrencyMeta;
}

const STORAGE_KEY = "viana.currency.v1";

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("USD");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
      if (stored && stored in CURRENCIES) setCurrencyState(stored);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }, []);

  const format = useCallback(
    (usd: number) => formatFromUSD(usd, currency, "es", DEFAULT_RATES),
    [currency],
  );

  const formatCompact = useCallback(
    (usd: number, code?: CurrencyCode) =>
      formatFromUSD(usd, code ?? currency, "es", DEFAULT_RATES),
    [currency],
  );

  const value = useMemo<CurrencyContextValue>(
    () => ({
      currency,
      primaryCurrency: currency,
      setCurrency,
      rates: DEFAULT_RATES,
      format,
      formatCompact,
      meta: CURRENCIES[currency],
    }),
    [currency, setCurrency, format, formatCompact],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {hydrated ? children : children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
