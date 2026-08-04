"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { ProductGridCard } from "@/components/products/product-grid-card";
import { groupForDisplay } from "@/lib/variants";
import { featuredProducts, products } from "@/lib/products";
import { useLanguage } from "@/lib/language-context";

const TRACK_SPEED_PX_PER_SECOND = 14;
const LONG_PAUSE_MS = 8500;
const QUICK_PAUSE_MS = 1800;

export function BestSellers() {
  const { t, lang } = useLanguage();
  const viewportRef = useRef<HTMLDivElement>(null);
  const firstGroupRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const autoPositionRef = useRef(0);
  const resumeTimerRef = useRef<number | null>(null);
  const pointerRef = useRef({
    id: -1,
    startX: 0,
    startY: 0,
    startScroll: 0,
    moved: false,
  });
  const suppressClickRef = useRef(false);
  const [autoPaused, setAutoPaused] = useState(false);

  const display = useMemo(() => {
    const featured = groupForDisplay(featuredProducts());
    const fallback = groupForDisplay(products.filter((product) => !product.featured));
    const groups = [...featured];
    const ids = new Set(groups.map((group) => group.primary.id));

    for (const group of fallback) {
      if (groups.length >= 10) break;
      if (!ids.has(group.primary.id)) {
        groups.push(group);
        ids.add(group.primary.id);
      }
    }

    return groups.slice(0, 10);
  }, []);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const setPaused = useCallback((value: boolean) => {
    pausedRef.current = value;
    setAutoPaused(value);
  }, []);

  const pauseFor = useCallback(
    (duration: number) => {
      clearResumeTimer();
      setPaused(true);
      resumeTimerRef.current = window.setTimeout(() => {
        setPaused(false);
        resumeTimerRef.current = null;
      }, duration);
    },
    [clearResumeTimer, setPaused],
  );

  const pauseWhilePresent = useCallback(() => {
    clearResumeTimer();
    setPaused(true);
  }, [clearResumeTimer, setPaused]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || display.length === 0) return;

    let frame = 0;
    let lastTime = performance.now();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tick = (time: number) => {
      const elapsed = Math.min(64, time - lastTime);
      lastTime = time;

      if (!pausedRef.current && !reducedMotion) {
        autoPositionRef.current += (elapsed / 1000) * TRACK_SPEED_PX_PER_SECOND;
        const firstGroupWidth = firstGroupRef.current?.scrollWidth ?? 0;
        if (firstGroupWidth > 0 && autoPositionRef.current >= firstGroupWidth) {
          autoPositionRef.current -= firstGroupWidth;
        }
        viewport.scrollLeft = autoPositionRef.current;
      } else {
        autoPositionRef.current = viewport.scrollLeft;
      }

      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [display.length]);

  useEffect(() => () => clearResumeTimer(), [clearResumeTimer]);

  if (display.length === 0) return null;

  const moveByCard = (direction: -1 | 1) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const distance = Math.min(360, viewport.clientWidth * 0.78);
    viewport.scrollBy({ left: direction * distance, behavior: "smooth" });
    pauseFor(LONG_PAUSE_MS);
  };

  const finishPointer = (event: ReactPointerEvent<HTMLDivElement>, cancelled = false) => {
    if (event.pointerId !== pointerRef.current.id) return;
    const deliberate = !cancelled && pointerRef.current.moved;
    suppressClickRef.current = deliberate;
    pointerRef.current = {
      id: -1,
      startX: 0,
      startY: 0,
      startScroll: 0,
      moved: false,
    };
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    pauseFor(deliberate ? LONG_PAUSE_MS : QUICK_PAUSE_MS);
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  const previousLabel = lang === "en" ? "Previous products" : lang === "pt" ? "Produtos anteriores" : "Productos anteriores";
  const nextLabel = lang === "en" ? "Next products" : lang === "pt" ? "Próximos produtos" : "Próximos productos";
  const carouselLabel = lang === "en" ? "Best-selling products" : lang === "pt" ? "Produtos mais vendidos" : "Productos más vendidos";

  const renderGroup = (duplicate: boolean) => (
    <div
      ref={duplicate ? undefined : firstGroupRef}
      aria-hidden={duplicate ? true : undefined}
      inert={duplicate ? true : undefined}
      className="flex shrink-0 gap-3 pr-3"
    >
      {display.map((item) => (
        <div
          key={`${duplicate ? "duplicate" : "primary"}-${item.primary.id}`}
          className="w-[78vw] max-w-[310px] flex-none sm:w-[42vw] md:w-[30vw] lg:w-[22vw] xl:w-[300px]"
        >
          <ProductGridCard
            product={item.primary}
            variants={item.isGroup ? item.variants : undefined}
          />
        </div>
      ))}
    </div>
  );

  return (
    <section id="mais-vendidos" className="mx-auto mt-10 max-w-[1400px] scroll-mt-32 px-4 md:mt-14 md:px-6 lg:px-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-[var(--brand-primary)] md:text-3xl">
            {t("bestSellersTitle")}
          </h2>
          <p className="mt-0.5 text-xs font-medium text-[var(--text-muted)]">
            {t("bestSellersSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/products"
            className="mr-1 hidden items-center gap-1 text-xs font-bold text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-primary-hover)] sm:flex"
          >
            {t("bestSellersViewAll")} <ArrowRight size={10} weight="bold" />
          </Link>
          <button
            type="button"
            aria-label={previousLabel}
            onClick={() => moveByCard(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--bg-border-strong)] bg-[var(--bg-card)] text-[var(--brand-primary)] transition-colors hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
          >
            <ArrowLeft size={14} weight="bold" />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => moveByCard(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--bg-border-strong)] bg-[var(--bg-card)] text-[var(--brand-primary)] transition-colors hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]"
          >
            <ArrowRight size={14} weight="bold" />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={carouselLabel}
        aria-live="off"
        tabIndex={0}
        data-testid="best-sellers-carousel"
        data-autoplay-paused={autoPaused}
        className="no-scrollbar touch-pan-y cursor-grab overflow-x-auto overscroll-x-contain rounded-2xl active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
        onMouseEnter={pauseWhilePresent}
        onMouseLeave={() => pauseFor(QUICK_PAUSE_MS)}
        onFocusCapture={pauseWhilePresent}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) pauseFor(3200);
        }}
        onWheel={() => pauseFor(LONG_PAUSE_MS)}
        onPointerDown={(event) => {
          if (!event.isPrimary || event.button !== 0) return;
          pointerRef.current = {
            id: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            startScroll: event.currentTarget.scrollLeft,
            moved: false,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
          pauseWhilePresent();
        }}
        onPointerMove={(event) => {
          if (event.pointerId !== pointerRef.current.id) return;
          const deltaX = event.clientX - pointerRef.current.startX;
          const deltaY = event.clientY - pointerRef.current.startY;
          if (Math.abs(deltaX) > 6 && Math.abs(deltaX) > Math.abs(deltaY)) {
            pointerRef.current.moved = true;
            event.currentTarget.scrollLeft = pointerRef.current.startScroll - deltaX;
            event.preventDefault();
          }
        }}
        onPointerUp={(event) => finishPointer(event)}
        onPointerCancel={(event) => finishPointer(event, true)}
        onClickCapture={(event) => {
          if (suppressClickRef.current) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            moveByCard(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            moveByCard(1);
          }
        }}
      >
        <div className="flex w-max">{renderGroup(false)}{renderGroup(true)}</div>
      </div>
    </section>
  );
}
