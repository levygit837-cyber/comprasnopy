"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";

import { useLanguage } from "@/lib/language-context";
import type { Lang } from "@/lib/store";

const STORAGE_KEY = "viana.announcement.tirzec";
const REMIND_AFTER_MS = 21 * 24 * 60 * 60 * 1000;
const ENABLED = process.env.NEXT_PUBLIC_ENABLE_TIRZEC_PROMO !== "false";
const VERSION =
  process.env.NEXT_PUBLIC_TIRZEC_PROMO_VERSION ?? "tirzec-15-new-presentation-v1";

interface SeenState {
  version: string;
  seenAt: number;
}

const COPY: Record<
  Lang,
  { eyebrow: string; title: string; body: string; notice: string; close: string }
> = {
  es: {
    eyebrow: "Nueva presentación",
    title: "TIRZEC 15 · Caja con 4 viales",
    body: "Presentación de tirzepatida 15 mg/0,5 mL en cuatro viales de solución inyectable.",
    notice: "Medicamento de venta bajo receta. Consulte disponibilidad y orientación profesional.",
    close: "Entendido",
  },
  pt: {
    eyebrow: "Nova apresentação",
    title: "TIRZEC 15 · Caixa com 4 frascos",
    body: "Apresentação de tirzepatida 15 mg/0,5 mL em quatro frascos de solução injetável.",
    notice: "Medicamento sob prescrição. Consulte disponibilidade e orientação profissional.",
    close: "Entendi",
  },
  en: {
    eyebrow: "New presentation",
    title: "TIRZEC 15 · Box with 4 vials",
    body: "Tirzepatide 15 mg/0.5 mL presentation with four vials of injectable solution.",
    notice: "Prescription medicine. Ask about availability and professional guidance.",
    close: "Got it",
  },
};

export function TirzecAnnouncement() {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      const next: SeenState = { version: VERSION, seenAt: Date.now() };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // The dialog can still be dismissed when storage is unavailable.
    }
    window.setTimeout(() => previousFocusRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!ENABLED) return;

    let shouldShow = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const seen = JSON.parse(raw) as Partial<SeenState>;
        const sameVersion = seen.version === VERSION;
        const recentlySeen =
          typeof seen.seenAt === "number" && Date.now() - seen.seenAt < REMIND_AFTER_MS;
        shouldShow = !sameVersion || !recentlySeen;
      }
    } catch {
      shouldShow = true;
    }

    if (!shouldShow) return;
    const timer = window.setTimeout(() => {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      setVisible(true);
    }, 1100);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dismiss, visible]);

  if (!ENABLED || !visible) return null;

  const copy = COPY[lang];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/48 p-3 backdrop-blur-[2px] sm:items-center sm:p-6"
      data-testid="tirzec-announcement"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="tirzec-announcement-title"
        className="animate-notifier-in relative grid max-h-[92dvh] w-full max-w-[860px] overflow-hidden rounded-[1.5rem] bg-[var(--bg-card)] shadow-2xl sm:grid-cols-[0.92fr_1.08fr]"
      >
        <button
          ref={closeRef}
          type="button"
          aria-label={lang === "en" ? "Close announcement" : lang === "pt" ? "Fechar anúncio" : "Cerrar anuncio"}
          onClick={dismiss}
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/35 bg-[var(--brand-green)]/88 text-white shadow-md backdrop-blur transition-colors hover:bg-[var(--brand-copper)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white"
        >
          <X size={18} weight="bold" />
        </button>

        <div className="relative min-h-[250px] bg-[var(--brand-green)] sm:min-h-[520px]">
          <Image
            src="/images/products/tirzec/tirzec-15-popup-editorial.webp"
            alt={lang === "en" ? "TIRZEC 15 box with four vials" : lang === "pt" ? "Caixa TIRZEC 15 com quatro frascos" : "Caja TIRZEC 15 con cuatro viales"}
            fill
            priority
            quality={88}
            sizes="(max-width: 639px) calc(100vw - 24px), 400px"
            className="object-cover object-[50%_56%]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5" />
        </div>

        <div className="flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--brand-copper)]">
            {copy.eyebrow}
          </p>
          <h2
            id="tirzec-announcement-title"
            className="mt-3 max-w-[16ch] text-3xl font-semibold leading-[1.05] tracking-[-0.025em] text-[var(--brand-green)] sm:text-4xl"
          >
            {copy.title}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--text-muted)]">{copy.body}</p>
          <p className="mt-4 rounded-xl bg-[var(--bg-muted)] px-4 py-3 text-xs font-medium leading-relaxed text-[var(--text-muted)]">
            {copy.notice}
          </p>
          <button
            type="button"
            onClick={dismiss}
            className="mt-6 inline-flex min-h-11 w-fit items-center justify-center rounded-full bg-[var(--brand-green)] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--brand-green-mid)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--brand-sage-dark)]"
          >
            {copy.close}
          </button>
        </div>
      </section>
    </div>
  );
}
