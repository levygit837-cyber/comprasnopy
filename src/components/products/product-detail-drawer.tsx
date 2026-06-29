"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
  Minus,
  Plus,
  ShoppingBag,
  Storefront,
  ShieldCheck,
  WhatsappLogo,
  X,
} from "@phosphor-icons/react/dist/ssr";

import type { Product } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";
import { useCurrency } from "@/lib/currency-context";
import { useLanguage } from "@/lib/language-context";
import { getImageSrcs } from "@/lib/images";
import { categoryById } from "@/lib/categories";
import { waLink } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductDetailDrawer() {
  const product = useCartStore((s) => s.detailProduct);
  const variants = useCartStore((s) => s.detailVariants);
  const close = useCartStore((s) => s.closeDetail);
  const add = useCartStore((s) => s.add);

  const { format } = useCurrency();
  const { t, lang } = useLanguage();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [qty, setQty] = useState(1);

  const selected: Product | null = useMemo(() => {
    if (!product) return null;
    if (variants.length > 1) {
      return variants.find((v) => v.id === activeId) ?? variants[0] ?? product;
    }
    return product;
  }, [product, variants, activeId]);

  useEffect(() => {
    if (product) {
      setActiveId(product.id);
      setQty(1);
    }
  }, [product]);

  if (!product || !selected) return null;

  const images = getImageSrcs(selected.id) ?? [];
  const category = categoryById(selected.category);

  const savings = selected.oldPriceUSD
    ? Math.max(0, selected.oldPriceUSD - selected.priceUSD)
    : null;

  const waMessage = `Hola Farmacia Viana. Quiero consultar sobre el producto: ${selected.name.en}${
    selected.strength ? " (" + selected.strength + ")" : ""
  } (${format(selected.priceUSD)}). Esta disponible?`;
  const waUrl = waLink(waMessage);

  return (
    <Dialog.Root open={!!product} onOpenChange={(o) => (o ? null : close())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[var(--brand-green)]/30 z-[60] backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content className="theme-aware fixed top-0 right-0 h-full w-full max-w-[440px] bg-[var(--bg-card)] shadow-2xl z-[70] flex flex-col animate-slide-in-right">
          <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--bg-border)]">
            <Dialog.Title className="text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-widest">
              {t("drawerTitle")}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="theme-aware w-7 h-7 rounded-full bg-[var(--bg-muted)] hover:bg-[var(--brand-red)]/10 hover:text-[var(--brand-red)] flex items-center justify-center transition-colors text-[var(--text-muted)]"
              >
                <X size={12} weight="bold" />
              </button>
            </Dialog.Close>
          </header>

          <div className="flex-grow overflow-y-auto">
            <div
              className="w-full aspect-square relative flex items-center justify-center p-5"
              style={{ backgroundColor: "var(--image-bg)" }}
            >
              <div className="absolute top-3 left-3 z-10 flex gap-1 flex-wrap">
                {category && (
                  <span className="bg-[var(--bg-card)] text-[var(--text)] border border-[var(--bg-border-strong)] text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                    {category.name[lang]}
                  </span>
                )}
                {savings && savings > 0 && (
                  <span className="bg-[var(--brand-red)] text-white text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                    {Math.round((savings / selected.oldPriceUSD!) * 100)}% OFF
                  </span>
                )}
              </div>
              {images[0] ? (
                <Image
                  src={images[0]}
                  alt={selected.name.en}
                  fill
                  sizes="440px"
                  loading="lazy"
                  className="object-contain drop-shadow-xl p-4"
                  style={{ mixBlendMode: "var(--image-blend)" as React.CSSProperties["mixBlendMode"] }}
                  unoptimized
                />
              ) : (
                <span className="text-[var(--text-subtle)] text-xs">
                  Imagen no disponible
                </span>
              )}
            </div>

            <div className="p-4 md:p-5">
              {selected.lab && (
                <p className="mb-1 text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-widest">
                  {selected.lab}
                </p>
              )}
              <h2 className="font-sans text-xl md:text-2xl text-[var(--text)] font-semibold leading-tight mb-1.5 tracking-tight">
                {selected.name.en}
                {selected.strength && (
                  <span className="block text-sm font-medium text-[var(--text-muted)] mt-0.5">
                    {selected.strength}
                  </span>
                )}
              </h2>

              <p className="text-[var(--text-muted)] text-xs leading-relaxed mb-4">
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
                        type="button"
                        key={v.id}
                        onClick={() => setActiveId(v.id)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg border-2 font-bold text-xs transition-colors",
                          v.id === selected.id
                            ? "border-[var(--brand-green)] text-[var(--brand-green)] bg-[var(--brand-green)]/5"
                            : "border-[var(--bg-border-strong)] text-[var(--text-muted)] hover:border-[var(--brand-copper)] bg-[var(--bg-card)]",
                        )}
                      >
                        {v.strength ?? v.name.en}
                        <span className="block text-[9px] font-medium tabular-nums opacity-70 mt-0.5">
                          {format(v.priceUSD)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="theme-aware bg-[var(--bg-muted)] rounded-xl p-3.5 border border-[var(--bg-border-strong)] mb-3.5">
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
                <p className="text-2xl font-bold text-[var(--brand-green)] tabular-nums tracking-tighter">
                  {format(selected.priceUSD)}
                </p>
              </div>

              <div className="flex gap-2 mb-2">
                <div className="flex items-center border-2 border-[var(--bg-border-strong)] rounded-full bg-[var(--bg-card)] overflow-hidden">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-8 h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)]"
                  >
                    <Minus size={10} weight="bold" />
                  </button>
                  <span className="w-7 text-center font-bold text-[var(--text)] tabular-nums text-sm">
                    {qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => q + 1)}
                    className="w-8 h-10 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)]"
                  >
                    <Plus size={10} weight="bold" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => add(selected, qty)}
                  className="flex-grow bg-[var(--brand-copper)] hover:bg-[var(--brand-copper-dark)] text-white rounded-full font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md active:scale-[0.99]"
                >
                  <ShoppingBag size={14} weight="bold" />
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
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
