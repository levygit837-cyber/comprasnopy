"use client";

import { useLanguage } from "@/lib/language-context";
import { formatFromUSD, DEFAULT_RATES } from "@/lib/store";
import { tpl } from "@/lib/translations";
import type { Order } from "@/lib/orders";

interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const { t, lang } = useLanguage();
  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <li
          key={order.id}
          className="theme-aware bg-[var(--bg-card)] border border-[var(--bg-border)] rounded-2xl p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-[10px] text-[var(--text-subtle)] uppercase tracking-wider font-bold">
                {tpl("ordersOrderNumber", lang, { id: order.id.slice(0, 8) })}
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                {new Date(order.createdAt).toLocaleDateString(
                  lang === "pt" ? "pt-BR" : lang === "en" ? "en-US" : "es-PY",
                )}
              </p>
            </div>
            <span
              className={
                "text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full " +
                (order.status === "completed"
                  ? "bg-[var(--brand-sage)] text-[var(--brand-green)]"
                  : "bg-[var(--brand-copper)]/10 text-[var(--brand-copper)]")
              }
            >
              {order.status === "completed" ? t("ordersStatusCompleted") : t("ordersStatusPaid")}
            </span>
          </div>
          <ul className="divide-y divide-[var(--bg-border)]">
            {order.lines.map((line, idx) => (
              <li
                key={`${order.id}-${idx}`}
                className="py-1.5 flex items-center justify-between text-xs"
              >
                <span className="truncate">
                  <span className="font-bold text-[var(--text)]">{line.name}</span>
                  {line.strength && (
                    <span className="text-[var(--text-muted)]"> - {line.strength}</span>
                  )}
                  <span className="text-[var(--text-subtle)] ml-1">x{line.qty}</span>
                </span>
                <span className="tabular-nums font-bold text-[var(--brand-green)]">
                  {formatFromUSD(line.priceUSD * line.qty, order.currency, lang, DEFAULT_RATES)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-2 pt-2 border-t border-[var(--bg-border)] flex items-center justify-between">
            <span className="text-[10px] text-[var(--text-subtle)] uppercase tracking-wider font-bold">
              {t("cartTotal")}
            </span>
            <span className="font-bold text-sm tabular-nums text-[var(--brand-green)]">
              {formatFromUSD(order.totalUSD, order.currency, lang, DEFAULT_RATES)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
