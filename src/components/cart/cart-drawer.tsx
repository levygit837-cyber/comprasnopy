"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Trash, X } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import {
  buildWhatsAppMessage,
  totalUSD,
  useCartStore,
} from "@/lib/cart-store";
import { useCurrency } from "@/lib/currency-context";
import { useLanguage } from "@/lib/language-context";
import { useOverlayOpen, useOverlayStore } from "@/lib/overlay-store";
import { storeConfig } from "@/lib/store";

export function CartDrawer() {
  const lines = useCartStore((s) => s.lines);
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);
  const open = useOverlayOpen("cart");
  const close = useOverlayStore((s) => s.close);

  const { currency, format } = useCurrency();
  const { t, lang } = useLanguage();

  const subtotalUSD = totalUSD(lines);
  const intro =
    lang === "es"
      ? "Hola Farmacia Viana. Quiero enviar este pedido y coordinar el pago por WhatsApp (total {total})."
      : lang === "pt"
        ? "Ola Farmacia Viana. Quero enviar este pedido e combinar o pagamento pelo WhatsApp (total {total})."
        : "Hello Viana Pharmacy. I would like to send this order and arrange payment on WhatsApp (total {total}).";
  const whatsappUrl = buildWhatsAppMessage(
    lines,
    subtotalUSD,
    intro,
    currency,
    storeConfig.whatsappNumber,
  );

  return (
    <Dialog.Root open={open} onOpenChange={(o) => (o ? null : close("cart"))}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-[var(--brand-green)]/30 z-[60] backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <Dialog.Content className="theme-aware fixed top-0 right-0 h-full w-full max-w-[400px] bg-[var(--bg-card)] shadow-2xl z-[70] flex flex-col animate-slide-in-right">
          <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--bg-border)]">
            <Dialog.Title className="text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-widest">
              {t("cartTitle")}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label={t("cartClose")}
                className="theme-aware w-7 h-7 rounded-full bg-[var(--bg-muted)] hover:bg-[var(--brand-red)]/10 hover:text-[var(--brand-red)] flex items-center justify-center transition-colors text-[var(--text-muted)]"
              >
                <X size={12} weight="bold" />
              </button>
            </Dialog.Close>
          </header>

          <div className="flex-grow overflow-y-auto">
            {lines.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-8 py-12 gap-3">
                <span className="w-12 h-12 rounded-full bg-[var(--brand-sage)] flex items-center justify-center text-[var(--brand-green-mid)]">
                  <ShoppingBag size={22} weight="regular" />
                </span>
                <p className="text-xs text-[var(--text-muted)] max-w-xs">{t("cartEmpty")}</p>
                <Dialog.Close asChild>
                  <Link
                    href="/products"
                    className="mt-2 text-xs font-bold text-[var(--brand-copper)] hover:text-[var(--brand-copper-dark)] transition-colors"
                  >
                    {t("navCatalog")} &rarr;
                  </Link>
                </Dialog.Close>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--bg-border)]">
                {lines.map((line) => (
                  <li
                    key={line.id}
                    className="theme-aware flex items-start gap-3 p-4 hover:bg-[var(--bg-muted)] transition-colors"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center"
                      style={{ backgroundColor: "var(--image-bg)" }}
                    >
                      {line.image ? (
                        <Image
                          src={line.image}
                          alt={line.name}
                          width={48}
                          height={48}
                          loading="lazy"
                          className="w-full h-full object-contain"
                          quality={75}
                        />
                      ) : (
                        <ShoppingBag size={14} className="text-[var(--text-subtle)]" />
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-xs font-bold text-[var(--text)] truncate">
                        {line.name}
                        {line.strength && (
                          <span className="text-[var(--text-muted)] font-medium">
                            {" "}- {line.strength}
                          </span>
                        )}
                      </p>
                      {line.lab && (
                        <p className="text-[9px] text-[var(--text-subtle)] font-bold uppercase tracking-wider mt-0.5">
                          {line.lab}
                        </p>
                      )}
                      <p className="text-xs font-bold tabular-nums text-[var(--brand-green)] mt-1">
                        {format(line.priceUSD)}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border border-[var(--bg-border-strong)] rounded-full overflow-hidden">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            onClick={() => setQty(line.id, line.qty - 1)}
                            className="theme-aware w-7 h-7 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)]"
                          >
                            <Minus size={10} weight="bold" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold tabular-nums">
                            {line.qty}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            onClick={() => setQty(line.id, line.qty + 1)}
                            className="theme-aware w-7 h-7 flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)]"
                          >
                            <Plus size={10} weight="bold" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(line.id)}
                          aria-label={t("cartRemove")}
                          className="theme-aware text-[var(--text-subtle)] hover:text-[var(--brand-red)] transition-colors"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {lines.length > 0 && (
            <footer className="theme-aware border-t border-[var(--bg-border)] p-4 space-y-3 bg-[var(--bg-card)]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[var(--text-subtle)] uppercase tracking-widest">
                  {t("cartTotal")}
                </span>
                <span className="text-xl font-bold tabular-nums text-[var(--brand-green)]">
                  {format(subtotalUSD)}
                </span>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[var(--brand-copper)] hover:bg-[var(--brand-copper-dark)] text-white rounded-full font-bold text-xs py-3 transition-colors shadow-md active:scale-[0.99]"
              >
                {t("cartContinueWhatsApp")}
              </a>
              <p className="text-center text-[10px] leading-relaxed text-[var(--text-muted)]">
                {t("cartWhatsappNote")}
              </p>
            </footer>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
