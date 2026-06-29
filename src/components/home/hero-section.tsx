"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";

import { useLanguage } from "@/lib/language-context";
import { waLink } from "@/lib/store";
import { cn } from "@/lib/utils";

interface Slide {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  imagePosition: string;
  cta: { href: string; label: string; external?: boolean };
}

export function HeroSection() {
  const { t, lang } = useLanguage();
  const [active, setActive] = useState(0);

  const slides = useMemo<Slide[]>(() => {
    const whatsappMessage =
      lang === "es"
        ? "Hola, quiero recibir orientación para hacer un pedido en Farmacia Viana."
        : lang === "pt"
          ? "Olá, quero receber orientação para fazer um pedido na Farmácia Viana."
          : "Hello, I would like guidance to place an order with Viana Pharmacy.";

    return [
      {
        eyebrow: lang === "es" ? "Confianza Viana" : lang === "pt" ? "Confiança Viana" : "Viana Trust",
        title:
          lang === "es"
            ? "Tu farmacia, cuidada al detalle"
            : lang === "pt"
              ? "Sua farmácia, cuidada em cada detalhe"
              : "Pharmacy care, refined",
        body:
          lang === "es"
            ? "Productos originales, selección profesional y atención clara antes de comprar."
            : lang === "pt"
              ? "Produtos originais, seleção profissional e orientação clara antes de comprar."
              : "Genuine products, professional selection, and clear guidance before you buy.",
        image: "/bg1.png",
        imagePosition: "center right",
        cta: { href: "/products", label: t("heroCtaPrimary") },
      },
      {
        eyebrow: lang === "es" ? "Vitalidad diaria" : lang === "pt" ? "Vitalidade diária" : "Daily vitality",
        title:
          lang === "es"
            ? "Apoyo simple para tu rutina"
            : lang === "pt"
              ? "Apoio simples para sua rotina"
              : "Simple support for your routine",
        body:
          lang === "es"
            ? "Vitaminas y bienestar diario con una selección clara, segura y fácil de elegir."
            : lang === "pt"
              ? "Vitaminas e bem-estar diário com uma seleção clara, segura e fácil de escolher."
              : "Vitamins and daily wellness, selected with clarity, safety, and ease.",
        image: "/bg2.png",
        imagePosition: "center right",
        cta: { href: "/products", label: lang === "es" ? "Ver bienestar" : lang === "pt" ? "Ver bem-estar" : "View wellness" },
      },
      {
        eyebrow: lang === "es" ? "Dermocosmética" : "Dermocosmetics",
        title:
          lang === "es"
            ? "Piel cuidada con criterio"
            : lang === "pt"
              ? "Pele cuidada com critério"
              : "Skin care with confidence",
        body:
          lang === "es"
            ? "Sérums, protectores y tratamientos elegidos para una rutina más precisa."
            : lang === "pt"
              ? "Séruns, protetores e tratamentos escolhidos para uma rotina mais precisa."
              : "Serums, sunscreens, and treatments selected for a more precise routine.",
        image: "/bg3.png",
        imagePosition: "center right",
        cta: { href: "/products", label: lang === "es" ? "Explorar dermo" : lang === "pt" ? "Explorar dermo" : "Explore dermo" },
      },
      {
        eyebrow: lang === "es" ? "Entrega guiada" : lang === "pt" ? "Entrega orientada" : "Guided delivery",
        title:
          lang === "es"
            ? "Pide fácil, recibe con confianza"
            : lang === "pt"
              ? "Peça fácil, receba com confiança"
              : "Order easily, receive confidently",
        body:
          lang === "es"
            ? "Te orientamos por WhatsApp y preparamos tu pedido con detalle."
            : lang === "pt"
              ? "Orientamos pelo WhatsApp e preparamos seu pedido com cuidado."
              : "We guide you on WhatsApp and prepare every order with care.",
        image: "/bg4.png",
        imagePosition: "center right",
        cta: {
          href: waLink(whatsappMessage),
          label: lang === "es" ? "Consultar por WhatsApp" : lang === "pt" ? "Consultar pelo WhatsApp" : "Ask on WhatsApp",
          external: true,
        },
      },
    ];
  }, [lang, t]);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
      <div className="relative w-full h-[360px] md:h-[430px] xl:h-[500px] rounded-[2rem] overflow-hidden bg-[var(--brand-green)] shadow-[var(--shadow-soft)]">
        <div className="absolute inset-0 w-full h-full">
          {slides.map((slide, i) => (
            <div
              key={slide.image}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out flex items-center",
                i === active ? "opacity-100 z-10" : "opacity-0 pointer-events-none",
              )}
            >
              <Image
                src={slide.image}
                alt=""
                fill
                priority={i === 0}
                quality={92}
                sizes="(min-width: 1400px) 1400px, 100vw"
                className="object-cover"
                style={{ objectPosition: slide.imagePosition }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,56,42,0.94)] via-[rgba(8,56,42,0.72)] md:via-[rgba(8,56,42,0.48)] to-[rgba(8,56,42,0.08)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />
              <div className="relative z-10 w-full max-w-[560px] px-6 md:px-10 lg:px-14 text-white">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/85 backdrop-blur-md">
                  {slide.eyebrow}
                </span>
                <h2 className="mt-4 max-w-[14ch] font-sans text-[1.75rem] font-medium leading-[1.08] tracking-[-0.02em] md:text-[2.35rem] lg:text-[2.75rem]">
                  {slide.title}
                </h2>
                <p className="mt-3 max-w-[420px] text-[13px] font-normal leading-[1.55] text-white/80 md:text-[14px]">
                  {slide.body}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {slide.cta.external ? (
                    <a
                      href={slide.cta.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-[var(--brand-green)] shadow-md transition-all hover:bg-[var(--brand-copper)] hover:text-white active:scale-[0.98] md:px-6"
                    >
                      {slide.cta.label}
                      <ArrowRight size={13} weight="bold" />
                    </a>
                  ) : (
                    <Link
                      href={slide.cta.href}
                      className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-[var(--brand-green)] shadow-md transition-all hover:bg-[var(--brand-copper)] hover:text-white active:scale-[0.98] md:px-6"
                    >
                      {slide.cta.label}
                      <ArrowRight size={13} weight="bold" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-5 left-6 z-20 flex w-[190px] items-center gap-1.5 md:bottom-7 md:left-10 lg:left-14">
          {slides.map((slide, i) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setActive(i)}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/30 transition-colors hover:bg-white/50"
            >
              <span
                className={cn(
                  "block h-full rounded-full bg-white transition-all duration-500",
                  i === active ? "w-full" : "w-0",
                )}
              />
            </button>
          ))}
        </div>

        <div className="absolute bottom-5 right-6 z-20 hidden items-center gap-2 md:bottom-7 md:right-10 md:flex lg:right-14">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => setActive((i) => (i - 1 + slides.length) % slides.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-[var(--brand-green)]"
          >
            <ArrowLeft size={12} weight="bold" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => setActive((i) => (i + 1) % slides.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white hover:text-[var(--brand-green)]"
          >
            <ArrowRight size={12} weight="bold" />
          </button>
        </div>
      </div>
    </section>
  );
}
