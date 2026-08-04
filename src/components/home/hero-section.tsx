"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  InstagramLogo,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";

import { useLanguage } from "@/lib/language-context";
import { waLink, type Lang } from "@/lib/store";
import { cn } from "@/lib/utils";

type CampaignId =
  | "tirzec"
  | "tg"
  | "testosterone"
  | "pen"
  | "zphc-line"
  | "whatsapp"
  | "instagram";

interface CampaignCopy {
  eyebrow: string;
  title: string;
  body: string;
  cta?: string;
  visualAlt: string;
}

interface CampaignMeta {
  id: CampaignId;
  href?: string;
  external?: boolean;
  copySide: "left" | "right";
  tone: "light" | "dark";
}

interface CampaignSlide extends CampaignMeta, CampaignCopy {}

const HERO_INTERVAL_MS = 3500;
const LONG_INTERACTION_PAUSE_MS = 9500;
const QUICK_INTERACTION_PAUSE_MS = 2200;

const META: CampaignMeta[] = [
  {
    id: "tirzec",
    href: "/products/tirzepatida-tirzec-15mg-4amp-37740",
    copySide: "left",
    tone: "light",
  },
  {
    id: "tg",
    href: "/products/tirzepatida-tg-15mg-4amp-27940",
    copySide: "right",
    tone: "dark",
  },
  {
    id: "testosterone",
    href: "/products/test-enantato-400",
    copySide: "left",
    tone: "light",
  },
  {
    id: "pen",
    href: "/products/tirzepatida-pen-75mg",
    copySide: "right",
    tone: "dark",
  },
  {
    id: "zphc-line",
    href: "/products",
    copySide: "left",
    tone: "light",
  },
  {
    id: "whatsapp",
    copySide: "left",
    tone: "light",
    external: true,
  },
  {
    id: "instagram",
    copySide: "right",
    tone: "dark",
    external: true,
  },
];

const COPY: Record<Lang, CampaignCopy[]> = {
  es: [
    {
      eyebrow: "NUEVA PRESENTACIÓN",
      title: "TIRZEC 15 con nueva caja y nuevo vial",
      body: "4 viales de 15 mg/0,5 mL. Presentación original disponible en el catálogo Compraspy.",
      cta: "Ver TIRZEC 15",
      visualAlt: "Nueva caja de TIRZEC 15 con cuatro viales",
    },
    {
      eyebrow: "TIRZEPATIDA TG",
      title: "TG 15 mg en caja con 4 viales",
      body: "Presentación de 15 mg/0,5 mL con imagen real del producto.",
      cta: "Ver TG 15",
      visualAlt: "Caja y vial de tirzepatida TG 15 mg",
    },
    {
      eyebrow: "DESTACADO ANABÓLICO",
      title: "Testosterone Enanthate 400",
      body: "Presentación de 10 mL de la línea ZPHC. Consulte disponibilidad.",
      cta: "Ver presentación",
      visualAlt: "Caja de Testosterone Enanthate 400 de ZPHC",
    },
    {
      eyebrow: "PRESENTACIÓN EN PEN",
      title: "Tirzepatide Pen 75 mg",
      body: "Presentación en pluma con imagen validada del catálogo.",
      cta: "Ver producto",
      visualAlt: "Caja y pluma de Tirzepatide Pen 75 mg",
    },
    {
      eyebrow: "LÍNEA ZPHC",
      title: "Más presentaciones para comparar",
      body: "HGH Fragment, BPC-157 y otras referencias con fotos reales.",
      cta: "Explorar catálogo",
      visualAlt: "Selección de productos ZPHC disponibles en el catálogo",
    },
    {
      eyebrow: "ATENCIÓN DIRECTA",
      title: "Pedido y consulta por WhatsApp",
      body: "Envíe su lista, consulte disponibilidad y coordine pago, retiro o entrega.",
      cta: "Abrir WhatsApp",
      visualAlt: "Atención de Compraspy por WhatsApp con productos del catálogo",
    },
    {
      eyebrow: "COMPRASPY EN INSTAGRAM",
      title: "Novedades y productos en su feed",
      body: "Acompañe nuevas presentaciones, avisos y destacados del catálogo.",
      cta: "Abrir Instagram",
      visualAlt: "Productos de Compraspy presentados para Instagram",
    },
  ],
  pt: [
    {
      eyebrow: "NOVA APRESENTAÇÃO",
      title: "TIRZEC 15 com nova caixa e novo frasco",
      body: "4 frascos de 15 mg/0,5 mL. Apresentação original disponível no catálogo Compraspy.",
      cta: "Ver TIRZEC 15",
      visualAlt: "Nova caixa de TIRZEC 15 com quatro frascos",
    },
    {
      eyebrow: "TIRZEPATIDA TG",
      title: "TG 15 mg em caixa com 4 frascos",
      body: "Apresentação de 15 mg/0,5 mL com imagem real do produto.",
      cta: "Ver TG 15",
      visualAlt: "Caixa e frasco de tirzepatida TG 15 mg",
    },
    {
      eyebrow: "DESTAQUE ANABOLIZANTE",
      title: "Testosterone Enanthate 400",
      body: "Apresentação de 10 mL da linha ZPHC. Consulte a disponibilidade.",
      cta: "Ver apresentação",
      visualAlt: "Caixa de Testosterone Enanthate 400 da ZPHC",
    },
    {
      eyebrow: "APRESENTAÇÃO EM PEN",
      title: "Tirzepatide Pen 75 mg",
      body: "Apresentação em caneta com imagem validada do catálogo.",
      cta: "Ver produto",
      visualAlt: "Caixa e caneta de Tirzepatide Pen 75 mg",
    },
    {
      eyebrow: "LINHA ZPHC",
      title: "Mais apresentações para comparar",
      body: "HGH Fragment, BPC-157 e outras referências com fotos reais.",
      cta: "Explorar catálogo",
      visualAlt: "Seleção de produtos ZPHC disponíveis no catálogo",
    },
    {
      eyebrow: "ATENDIMENTO DIRETO",
      title: "Pedido e consulta pelo WhatsApp",
      body: "Envie sua lista, confira a disponibilidade e combine pagamento, retirada ou entrega.",
      cta: "Abrir WhatsApp",
      visualAlt: "Atendimento da Compraspy pelo WhatsApp com produtos do catálogo",
    },
    {
      eyebrow: "COMPRASPY NO INSTAGRAM",
      title: "Novidades e produtos no seu feed",
      body: "Acompanhe novas apresentações, avisos e destaques do catálogo.",
      cta: "Abrir Instagram",
      visualAlt: "Produtos da Compraspy apresentados para o Instagram",
    },
  ],
  en: [
    {
      eyebrow: "NEW PRESENTATION",
      title: "TIRZEC 15 with a new box and new vial",
      body: "4 vials of 15 mg/0.5 mL. Original presentation available in the Compraspy catalog.",
      cta: "View TIRZEC 15",
      visualAlt: "New TIRZEC 15 box with four vials",
    },
    {
      eyebrow: "TG TIRZEPATIDE",
      title: "TG 15 mg in a box with 4 vials",
      body: "15 mg/0.5 mL presentation shown with a real product image.",
      cta: "View TG 15",
      visualAlt: "TG 15 mg tirzepatide box and vial",
    },
    {
      eyebrow: "ANABOLIC FEATURE",
      title: "Testosterone Enanthate 400",
      body: "10 mL presentation from the ZPHC line. Ask about availability.",
      cta: "View presentation",
      visualAlt: "ZPHC Testosterone Enanthate 400 box",
    },
    {
      eyebrow: "PEN PRESENTATION",
      title: "Tirzepatide Pen 75 mg",
      body: "Pen presentation shown with a validated catalog image.",
      cta: "View product",
      visualAlt: "Tirzepatide Pen 75 mg box and pen",
    },
    {
      eyebrow: "ZPHC LINE",
      title: "More presentations to compare",
      body: "HGH Fragment, BPC-157, and other references with real photos.",
      cta: "Explore catalog",
      visualAlt: "Selection of ZPHC products available in the catalog",
    },
    {
      eyebrow: "DIRECT SUPPORT",
      title: "Orders and questions on WhatsApp",
      body: "Send your list, check availability, and arrange payment, pickup, or delivery.",
      cta: "Open WhatsApp",
      visualAlt: "Compraspy WhatsApp support with catalog products",
    },
    {
      eyebrow: "COMPRASPY ON INSTAGRAM",
      title: "New products and updates in your feed",
      body: "Follow new presentations, notices, and catalog highlights.",
      cta: "Open Instagram",
      visualAlt: "Compraspy products presented for Instagram",
    },
  ],
};

interface ProductVisualProps {
  src: string;
  alt: string;
  className: string;
  imageClassName?: string;
  editorialPhoto?: boolean;
  priority?: boolean;
}

function ProductVisual({
  src,
  alt,
  className,
  imageClassName,
  editorialPhoto = false,
  priority = false,
}: ProductVisualProps) {
  return (
    <div
      className={cn(
        "absolute z-10",
        editorialPhoto &&
          "hero-editorial-photo overflow-hidden rounded-[1.75rem] border border-[var(--product-photo-border)] bg-[var(--product-photo-bg)] shadow-[0_24px_60px_rgba(76,36,20,0.24)]",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={88}
        sizes="(max-width: 767px) 82vw, 56vw"
        className={cn("object-contain", imageClassName)}
      />
    </div>
  );
}

function CampaignScene({ slide, priority }: { slide: CampaignSlide; priority: boolean }) {
  const sharedAlt = slide.visualAlt;

  switch (slide.id) {
    case "tirzec":
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,var(--hero-glow),transparent_30%),linear-gradient(115deg,var(--hero-deep)_0%,var(--hero-deep)_43%,var(--hero-mid)_43%,var(--hero-mid)_70%,var(--hero-canvas)_70%,var(--hero-canvas)_100%)]" />
          <div className="absolute -right-[8%] -top-[40%] h-[120%] w-[46%] rotate-12 rounded-[50%] border-[3px] border-[var(--brand-primary)]/65" />
          <div className="absolute right-[2%] top-[5%] text-[11vw] font-extrabold leading-none tracking-[-0.08em] text-[var(--brand-primary)]/[0.07] md:text-[150px]">
            T15
          </div>
          <ProductVisual
            src="/images/products/tirzec/tirzec-15-set-canonical.webp"
            alt={sharedAlt}
            priority={priority}
            className="bottom-[2%] left-[7%] h-[43%] w-[88%] md:bottom-[1%] md:left-[42%] md:h-[92%] md:w-[56%]"
            imageClassName="drop-shadow-[0_22px_22px_rgba(76,36,20,0.3)]"
          />
        </>
      );

    case "tg":
      return (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(120deg,var(--hero-canvas)_0%,var(--hero-canvas)_58%,var(--hero-soft)_58%,var(--hero-soft)_96%,var(--brand-action)_96%,var(--brand-action)_100%)]" />
          <div className="absolute -left-[8%] top-[4%] h-[36%] w-[65%] -rotate-3 bg-[var(--brand-action)] opacity-95 [clip-path:polygon(0_0,94%_0,80%_100%,0_100%)]" />
          <div className="absolute left-0 top-[38%] h-1 w-[72%] bg-[var(--hero-deep)]" />
          <div className="absolute bottom-[8%] left-[7%] h-[28%] w-[42%] rounded-[50%] bg-[var(--product-stage-bg)] shadow-[0_22px_40px_rgba(76,36,20,0.16)] md:bottom-[8%] md:left-[7%] md:h-[18%] md:w-[34%]" />
          <ProductVisual
            src="/images/products/premium/supplier-27940-primary.webp"
            alt={sharedAlt}
            priority={priority}
            editorialPhoto
            className="bottom-[5%] left-[10%] h-[35%] w-[54%] md:bottom-[10%] md:left-[8%] md:h-[66%] md:w-[34%]"
            imageClassName="object-cover"
          />
        </>
      );

    case "testosterone":
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_45%,var(--hero-glow),transparent_28%),linear-gradient(118deg,var(--hero-deep)_0%,var(--hero-deep)_52%,var(--hero-mid)_100%)]" />
          <div className="absolute bottom-[18%] right-[-3%] h-[16%] w-[62%] -rotate-6 bg-[var(--brand-action)] opacity-90 [clip-path:polygon(4%_0,100%_0,94%_100%,0_100%)]" />
          <div className="absolute right-[5%] top-[8%] h-[72%] w-[44%] rotate-6 rounded-3xl border border-white/15 bg-white/5" />
          <ProductVisual
            src="/images/products/testosterone-enanthate-10ml.png"
            alt={sharedAlt}
            priority={priority}
            className="bottom-[3%] left-[12%] h-[39%] w-[78%] md:bottom-[4%] md:left-[48%] md:h-[84%] md:w-[47%]"
            imageClassName="drop-shadow-[0_28px_30px_rgba(0,0,0,0.42)]"
          />
        </>
      );

    case "pen":
      return (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(110deg,var(--hero-canvas)_0%,var(--hero-canvas)_58%,var(--hero-soft)_58%,var(--hero-soft)_96%,var(--brand-action)_96%,var(--brand-action)_100%)]" />
          <div className="absolute -bottom-[24%] -left-[10%] h-[76%] w-[66%] rotate-6 rounded-[50%] border-[20px] border-[var(--brand-primary)]/85" />
          <div className="absolute left-[4%] top-[12%] h-[68%] w-[54%] rounded-[2rem] border border-[var(--product-photo-border)] bg-[var(--product-stage-bg)] shadow-[0_28px_70px_rgba(76,36,20,0.14)] md:w-[50%]" />
          <ProductVisual
            src="/images/products/tirzepatide-75-pen-box.png"
            alt={sharedAlt}
            priority={priority}
            className="bottom-[4%] left-[6%] h-[38%] w-[78%] md:bottom-[13%] md:left-[5%] md:h-[62%] md:w-[46%]"
            imageClassName="scale-[1.02] drop-shadow-[0_24px_24px_rgba(0,0,0,0.26)]"
          />
        </>
      );

    case "zphc-line":
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_28%,var(--hero-glow),transparent_26%),linear-gradient(118deg,var(--hero-deep)_0%,var(--hero-deep)_58%,var(--hero-mid)_100%)]" />
          <div className="absolute bottom-[2%] right-[3%] h-[20%] w-[56%] rounded-[50%] border border-[var(--brand-primary)]/60 bg-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.28)]" />
          <ProductVisual
            src="/images/products/HGH-FRAGMENT-5MG.png"
            alt="HGH Fragment 5 mg"
            priority={priority}
            className="bottom-[3%] left-[30%] h-[30%] w-[29%] -rotate-2 md:bottom-[9%] md:left-[47%] md:h-[66%] md:w-[20%]"
            imageClassName="drop-shadow-[0_24px_22px_rgba(0,0,0,0.34)]"
          />
          <ProductVisual
            src="/images/products/bpc-157-20mg.png"
            alt="BPC-157 20 mg"
            className="bottom-[4%] left-[53%] h-[32%] w-[30%] rotate-2 md:bottom-[5%] md:left-[64%] md:h-[72%] md:w-[21%]"
            imageClassName="drop-shadow-[0_24px_22px_rgba(0,0,0,0.34)]"
          />
          <ProductVisual
            src="/images/products/tirzec/tirzec-15-box-canonical.webp"
            alt="TIRZEC 15"
            className="bottom-[2%] right-[1%] h-[36%] w-[29%] md:bottom-[2%] md:right-[1%] md:h-[77%] md:w-[22%]"
            imageClassName="drop-shadow-[0_22px_20px_rgba(0,0,0,0.32)]"
          />
        </>
      );

    case "whatsapp":
      return (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_50%,var(--hero-glow),transparent_34%),linear-gradient(115deg,var(--hero-deep)_0%,var(--hero-deep)_53%,var(--hero-mid)_100%)]" />
          <div className="absolute right-[6%] top-[32%] h-[34%] w-[42%] rotate-3 rounded-[2.4rem] border border-white/25 bg-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.28)] md:top-[8%] md:h-[58%] md:w-[36%]" />
          <div className="absolute right-[12%] top-[39%] flex h-24 w-24 items-center justify-center rounded-full bg-white text-[#1fa37a] shadow-xl md:right-[15%] md:top-[20%] md:h-32 md:w-32">
            <WhatsappLogo size={72} weight="fill" />
          </div>
          <ProductVisual
            src="/images/products/tirzec/tirzec-15-box-canonical.webp"
            alt="TIRZEC 15"
            className="bottom-[1%] left-[45%] h-[31%] w-[28%] md:bottom-[2%] md:left-[57%] md:h-[52%] md:w-[20%]"
            imageClassName="drop-shadow-[0_18px_18px_rgba(0,0,0,0.30)]"
          />
          <ProductVisual
            src="/images/products/testosterone-enanthate-10ml.png"
            alt="Testosterone Enanthate 400"
            className="bottom-[2%] right-[1%] h-[29%] w-[36%] md:bottom-[3%] md:right-[1%] md:h-[48%] md:w-[26%]"
            imageClassName="drop-shadow-[0_18px_18px_rgba(0,0,0,0.30)]"
          />
        </>
      );

    case "instagram":
      return (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(112deg,var(--hero-canvas)_0%,var(--hero-canvas)_56%,var(--hero-soft)_56%,var(--hero-soft)_96%,var(--brand-action)_96%,var(--brand-action)_100%)]" />
          <div className="absolute left-[2%] top-[30%] h-[34%] w-[48%] rotate-6 rounded-[32%] bg-[linear-gradient(135deg,#f07a46_0%,#d64d2a_52%,#6f2b16_100%)] md:-left-[12%] md:-top-[40%] md:h-[92%] md:w-[60%] md:rotate-12" />
          <div className="absolute left-[8%] top-[37%] flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-[var(--brand-primary)] shadow-xl md:top-[11%] md:h-28 md:w-28">
            <InstagramLogo size={64} weight="bold" />
          </div>
          <ProductVisual
            src="/images/products/tirzec/tirzec-15-box-canonical.webp"
            alt="TIRZEC 15"
            className="bottom-[2%] left-[4%] h-[31%] w-[29%] md:bottom-[3%] md:left-[5%] md:h-[60%] md:w-[20%]"
            imageClassName="drop-shadow-[0_18px_18px_rgba(76,36,20,0.28)]"
          />
          <ProductVisual
            src="/images/products/tirzepatide-75-pen-box.png"
            alt="Tirzepatide Pen 75 mg"
            className="bottom-[4%] left-[28%] h-[27%] w-[30%] rotate-2 md:bottom-[6%] md:left-[21%] md:h-[55%] md:w-[20%]"
            imageClassName="drop-shadow-[0_18px_18px_rgba(76,36,20,0.28)]"
          />
          <ProductVisual
            src="/images/products/HGH-FRAGMENT-5MG.png"
            alt="HGH Fragment 5 mg"
            className="bottom-[2%] left-[52%] h-[28%] w-[30%] -rotate-2 md:bottom-[3%] md:left-[35%] md:h-[57%] md:w-[18%]"
            imageClassName="drop-shadow-[0_18px_18px_rgba(76,36,20,0.28)]"
          />
        </>
      );
  }
}

function Cta({ slide }: { slide: CampaignSlide }) {
  if (!slide.cta || !slide.href) return null;

  const className = cn(
    "inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full px-5 py-3 text-sm font-bold shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-4 active:scale-[0.98]",
    slide.tone === "light"
      ? "bg-white text-[var(--brand-primary)] focus-visible:ring-white/55"
      : "bg-[var(--brand-action)] text-white focus-visible:ring-[var(--brand-primary)]/25",
  );

  const content: ReactNode = (
    <>
      {slide.cta}
      <ArrowRight size={15} weight="bold" />
    </>
  );

  if (slide.external) {
    return (
      <a href={slide.href} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={slide.href} className={className}>
      {content}
    </Link>
  );
}

export function HeroSection() {
  const { lang } = useLanguage();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const resumeTimerRef = useRef<number | null>(null);
  const pointerRef = useRef({ id: -1, startX: 0, deltaX: 0 });
  const suppressClickRef = useRef(false);

  const slides = useMemo<CampaignSlide[]>(() => {
    const whatsappMessage =
      lang === "es"
        ? "Hola, quiero consultar disponibilidad y hacer un pedido en Farmacia Viana."
        : lang === "pt"
          ? "Olá, quero consultar a disponibilidade e fazer um pedido na Farmácia Viana."
          : "Hello, I would like to check availability and place an order with Viana Pharmacy.";
    const instagramUrl = process.env.NEXT_PUBLIC_STORE_INSTAGRAM?.trim();

    return META.map((meta, index) => {
      if (meta.id === "whatsapp") {
        return { ...meta, ...COPY[lang][index]!, href: waLink(whatsappMessage) };
      }
      if (meta.id === "instagram") {
        return {
          ...meta,
          ...COPY[lang][index]!,
          href: instagramUrl || undefined,
          external: Boolean(instagramUrl),
          cta: instagramUrl ? COPY[lang][index]!.cta : undefined,
        };
      }
      return { ...meta, ...COPY[lang][index]! };
    });
  }, [lang]);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
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
    [clearResumeTimer],
  );

  const pauseWhilePresent = useCallback(() => {
    clearResumeTimer();
    setPaused(true);
  }, [clearResumeTimer]);

  const goTo = useCallback(
    (index: number, pauseDuration = LONG_INTERACTION_PAUSE_MS) => {
      setActive((index + slides.length) % slides.length);
      pauseFor(pauseDuration);
    },
    [pauseFor, slides.length],
  );

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setActive((index) => (index + 1) % slides.length),
      HERO_INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [paused, slides.length]);

  useEffect(() => () => clearResumeTimer(), [clearResumeTimer]);

  const finishPointer = (event: ReactPointerEvent<HTMLDivElement>, cancelled = false) => {
    if (event.pointerId !== pointerRef.current.id) return;
    const delta = pointerRef.current.deltaX;
    const deliberateSwipe = !cancelled && Math.abs(delta) >= 54;
    suppressClickRef.current = deliberateSwipe;

    if (deliberateSwipe) {
      setActive((index) =>
        delta < 0 ? (index + 1) % slides.length : (index - 1 + slides.length) % slides.length,
      );
    }

    pointerRef.current = { id: -1, startX: 0, deltaX: 0 };
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    pauseFor(deliberateSwipe ? LONG_INTERACTION_PAUSE_MS : QUICK_INTERACTION_PAUSE_MS);
    window.setTimeout(() => {
      suppressClickRef.current = false;
    }, 0);
  };

  const previousLabel = lang === "en" ? "Previous" : "Anterior";
  const nextLabel = lang === "es" ? "Siguiente" : lang === "pt" ? "Próximo" : "Next";
  const carouselLabel =
    lang === "es"
      ? "Campañas y productos de Compraspy"
      : lang === "pt"
        ? "Campanhas e produtos da Compraspy"
        : "Compraspy campaigns and products";

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 md:px-6 lg:px-8">
      <h1 className="sr-only">Compraspy</h1>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={carouselLabel}
        data-testid="hero-carousel"
        data-active-slide={active}
        data-slide-count={slides.length}
        data-autoplay-paused={paused}
        className="relative h-[640px] touch-pan-y overflow-hidden rounded-2xl bg-[var(--brand-action)] shadow-[var(--shadow-soft)] md:h-[438px]"
        onMouseEnter={pauseWhilePresent}
        onMouseLeave={() => pauseFor(QUICK_INTERACTION_PAUSE_MS)}
        onFocusCapture={pauseWhilePresent}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) pauseFor(4500);
        }}
        onPointerDown={(event) => {
          if (!event.isPrimary || event.button !== 0) return;
          // Buttons and links must keep their native click sequence. Capturing
          // their pointer on the carousel can retarget pointerup/click to the
          // slide container in some browsers, making the arrows look dead.
          if ((event.target as HTMLElement).closest("button, a")) {
            pauseWhilePresent();
            return;
          }
          pointerRef.current = { id: event.pointerId, startX: event.clientX, deltaX: 0 };
          event.currentTarget.setPointerCapture(event.pointerId);
          pauseWhilePresent();
        }}
        onPointerMove={(event) => {
          if (event.pointerId !== pointerRef.current.id) return;
          pointerRef.current.deltaX = event.clientX - pointerRef.current.startX;
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
            goTo(active - 1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            goTo(active + 1);
          }
        }}
      >
        <div
          className="flex h-full transition-transform duration-700 [transition-timing-function:var(--ease-out-expo)] motion-reduce:transition-none"
          style={{ transform: `translate3d(${-active * 100}%, 0, 0)` }}
        >
          {slides.map((slide, index) => (
            <article
              key={`${slide.id}-${lang}`}
              aria-hidden={index !== active}
              inert={index !== active ? true : undefined}
              className="relative h-full min-w-full overflow-hidden"
            >
              <CampaignScene slide={slide} priority={index === 0} />

              <div
                className={cn(
                  "absolute left-5 right-5 top-6 z-20 flex max-w-[560px] flex-col items-start md:inset-y-0 md:w-[43%] md:justify-center",
                  slide.copySide === "right"
                    ? "md:left-auto md:right-[5%]"
                    : "md:left-[5%] md:right-auto",
                  slide.tone === "light" ? "text-white" : "text-[var(--brand-primary)]",
                )}
              >
                <p
                  className={cn(
                    "mb-2.5 text-[10px] font-extrabold uppercase tracking-[0.19em]",
                    slide.tone === "light" ? "text-white/72" : "text-[var(--brand-primary)]",
                  )}
                >
                  {slide.eyebrow}
                </p>
                <h2 className="max-w-[16ch] text-[2rem] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-[2.25rem] md:text-[2.25rem] lg:text-[2.75rem]">
                  {slide.title}
                </h2>
                <p
                  className={cn(
                    "mt-3 max-w-[44ch] text-[13px] font-medium leading-relaxed md:text-sm",
                    slide.tone === "light"
                      ? "text-white/80"
                      : "text-[var(--brand-primary)]/75",
                  )}
                >
                  {slide.body}
                </p>
                <div className="mt-5">
                  <Cta slide={slide} />
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2 sm:right-5">
          <button
            type="button"
            aria-label={previousLabel}
            onClick={() => goTo(active - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/55 bg-[var(--brand-action)]/92 text-white shadow-md transition-colors hover:bg-[var(--brand-action)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowLeft size={14} weight="bold" />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            onClick={() => goTo(active + 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/55 bg-[var(--brand-action)]/92 text-white shadow-md transition-colors hover:bg-[var(--brand-action)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowRight size={14} weight="bold" />
          </button>
        </div>

        <div className="absolute bottom-5 left-5 z-30 flex w-[154px] items-center gap-1.5 sm:w-[182px]">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`${slide.title} (${index + 1}/${slides.length})`}
              aria-current={index === active ? "true" : undefined}
              onClick={() => goTo(index)}
              className="h-2 flex-1 rounded-full bg-white/35 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span
                className={cn(
                  "block h-full rounded-full transition-all duration-300",
                  index === active ? "w-full bg-[var(--brand-action)]" : "w-0 bg-transparent",
                )}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
