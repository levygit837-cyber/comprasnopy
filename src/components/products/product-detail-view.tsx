"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, ShieldCheck, Storefront, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";

import { useCartStore } from "@/lib/cart-store";
import { useCurrency } from "@/lib/currency-context";
import { useLanguage } from "@/lib/language-context";
import { categoryById } from "@/lib/categories";
import { getImageSrcs } from "@/lib/images";
import { waLink } from "@/lib/store";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  product: Product;
  variants: Product[];
}

export function ProductDetailView({ product, variants }: Props) {
  const [activeId, setActiveId] = useState<string>(product.id);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState<number>(0);
  const add = useCartStore((s) => s.add);

  const { t, lang } = useLanguage();
  const { format } = useCurrency();

  const selected = useMemo(() => {
    if (variants.length > 1) {
      return variants.find((v) => v.id === activeId) ?? variants[0]!;
    }
    return product;
  }, [product, variants, activeId]);

  const images = getImageSrcs(selected) ?? [];
  const category = categoryById(selected.category);

  useEffect(() => {
    setActiveImage(0);
  }, [selected.id]);

  const savings = selected.oldPriceUSD
    ? Math.max(0, selected.oldPriceUSD - selected.priceUSD)
    : null;

  const productLabel = `${selected.name[lang]}${selected.strength ? ` (${selected.strength})` : ""}`;
  const waMessage =
    lang === "es"
      ? `Hola Farmacia Viana. Quiero consultar ${productLabel} (${format(selected.priceUSD)}) y coordinar el pedido y el pago. Esta disponible?`
      : lang === "pt"
        ? `Ola Farmacia Viana. Quero consultar ${productLabel} (${format(selected.priceUSD)}) e combinar o pedido e o pagamento. Esta disponivel?`
        : `Hello Viana Pharmacy. I would like to ask about ${productLabel} (${format(selected.priceUSD)}) and arrange the order and payment. Is it available?`;
  const waUrl = waLink(waMessage);

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-5 grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="theme-aware rounded-2xl p-4 flex flex-col gap-3" style={{ backgroundColor: "var(--image-bg)" }}>
        <div
          className="aspect-square relative rounded-xl flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          {images[activeImage] ? (
            <Image
              src={images[activeImage]}
              alt={selected.name[lang]}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              quality={86}
              className="object-contain p-4"
            />
          ) : (
            <span className="text-[var(--text-subtle)] text-xs">{t("productImagePending")}</span>
          )}
          {savings && savings > 0 && (
            <span className="absolute top-3 left-3 bg-[var(--brand-red)] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
              {Math.round((savings / selected.oldPriceUSD!) * 100)}% OFF
            </span>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-1.5 flex-wrap">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`Image ${i + 1}`}
                className={cn(
                  "w-12 h-12 rounded-lg overflow-hidden border-2 transition-colors flex items-center justify-center",
                  i === activeImage
                    ? "border-[var(--brand-copper)]"
                    : "border-transparent hover:border-[var(--bg-border-strong)]",
                )}
                style={{ backgroundColor: "var(--bg-card)" }}
              >
                <Image src={src} alt="" width={40} height={40} loading="lazy" quality={70} className="object-contain" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-widest mb-1">
          {category?.name[lang] ?? selected.category}
        </div>
        <h1 className="font-sans text-2xl md:text-3xl text-[var(--text)] font-semibold leading-tight mb-1">
          {selected.name[lang]}
        </h1>
        {selected.strength && (
          <p className="text-xs text-[var(--text-muted)] font-medium mb-2">
            {selected.strength}
          </p>
        )}
        {selected.lab && (
          <p className="text-[10px] text-[var(--text-subtle)] font-bold uppercase tracking-wider mb-3">
            {selected.lab}
          </p>
        )}

        <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4">
          {selected.desc[lang]}
        </p>

        {variants.length > 1 && (
          <div className="mb-4">
            <span className="block text-[10px] font-bold text-[var(--text)] mb-2 uppercase tracking-wider">
              {t("drawerVariants")}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setActiveId(v.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors",
                    v.id === selected.id
                      ? "bg-[var(--brand-green)] text-white border-[var(--brand-green)]"
                      : "bg-transparent text-[var(--text-muted)] border-[var(--bg-border-strong)] hover:border-[var(--brand-copper)] hover:text-[var(--brand-copper)]",
                  )}
                >
                  {v.strength ?? v.name[lang]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="theme-aware bg-[var(--bg-muted)] rounded-xl p-4 border border-[var(--bg-border-strong)] mb-3">
          {selected.oldPriceUSD && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-[var(--text-subtle)] line-through tabular-nums font-medium">
                {format(selected.oldPriceUSD)}
              </span>
              {savings && savings > 0 && (
                <span className="bg-[var(--brand-red)]/10 text-[var(--brand-red)] text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {t("drawerSavings")} {format(savings)}
                </span>
              )}
            </div>
          )}
          <p className="text-3xl font-bold text-[var(--brand-green)] tabular-nums tracking-tighter">
            {format(selected.priceUSD)}
          </p>
        </div>

        <div className="flex gap-2 mb-2">
          <div className="flex items-center border-2 border-[var(--bg-border-strong)] rounded-full bg-[var(--bg-card)] overflow-hidden">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="w-8 h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <Minus size={10} weight="bold" />
            </button>
            <span className="w-8 text-center font-bold tabular-nums text-sm">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase quantity"
              className="w-8 h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)]"
            >
              <Plus size={10} weight="bold" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => add(selected, qty)}
            className="flex-grow bg-[var(--brand-copper)] hover:bg-[var(--brand-copper-dark)] text-white rounded-full font-bold text-xs transition-colors shadow-md active:scale-[0.99]"
          >
            {t("drawerAdd")}
          </button>
        </div>

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="theme-aware w-full flex items-center justify-center gap-2 text-[var(--text-muted)] font-bold text-xs py-2.5 rounded-full hover:bg-[var(--bg-muted)] transition-colors border border-transparent hover:border-[var(--bg-border-strong)]"
        >
          <WhatsappLogo size={14} weight="fill" className="text-[#25D366]" />
          {t("drawerConsult")}
        </a>

        <div className="mt-4 pt-3 border-t border-[var(--bg-border)] flex flex-wrap gap-3 text-[10px] font-medium text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-[var(--brand-green)]" />
            {t("drawerTrustGenuine")}
          </div>
          <div className="flex items-center gap-1.5">
            <Storefront size={13} className="text-[var(--brand-green)]" />
            {t("drawerTrustPickup")}
          </div>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[var(--brand-copper)] hover:text-[var(--brand-copper-dark)] transition-colors"
        >
          &larr; {t("navCatalog")}
        </Link>
      </div>
    </div>
  );
}
