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

import { DEFAULT_LANG, type Lang } from "./store";
import { isLang, LANGUAGE_COOKIE } from "./language";
import { t, tpl } from "./translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: Parameters<typeof t>[0]) => string;
  tpl: (key: Parameters<typeof tpl>[0], vars: Record<string, string | number>) => string;
}

const STORAGE_KEY = LANGUAGE_COOKIE;

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function persistLanguage(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }

  try {
    document.cookie = `${LANGUAGE_COOKIE}=${lang}; Path=/; Max-Age=31536000; SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

export function LanguageProvider({
  children,
  initialLang = DEFAULT_LANG,
}: {
  children: ReactNode;
  initialLang?: Lang;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    let resolvedLanguage = initialLang;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLang(stored)) resolvedLanguage = stored;
    } catch {
      /* ignore */
    }

    setLangState(resolvedLanguage);
    persistLanguage(resolvedLanguage);
  }, [initialLang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    persistLanguage(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : lang;
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      t: (key) => t(key, lang),
      tpl: (key, vars) => tpl(key, lang, vars),
    }),
    [lang, setLang],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
