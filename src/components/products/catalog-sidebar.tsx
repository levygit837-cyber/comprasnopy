"use client";

import * as Slider from "@radix-ui/react-slider";
import {
  SquaresFour,
  Dna,
  Gauge,
  Pill,
  Pulse,
  ShieldCheck,
  SlidersHorizontal,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";

import { categories } from "@/lib/categories";
import { products } from "@/lib/products";
import { uniqueProductCount } from "@/lib/variants";
import { useLanguage } from "@/lib/language-context";
import { useCurrency } from "@/lib/currency-context";
import { formatFromUSD, DEFAULT_RATES, MIN_PRICE_USD } from "@/lib/store";
import { cn } from "@/lib/utils";

type IconComponent = React.ComponentType<{ size?: number; weight?: "fill" | "regular" | "bold"; className?: string }>;

const ICON_MAP: Record<string, IconComponent> = {
  Dna,
  Gauge,
  Pill,
  Pulse,
  ShieldCheck,
  SlidersHorizontal,
  Sparkle,
};

interface CatalogSidebarProps {
  category: string;
  onCategoryChange: (id: string) => void;
  maxPriceUSD: number;
  onMaxPriceChange: (value: number) => void;
  mobile?: boolean;
}

export function CatalogSidebar({
  category,
  onCategoryChange,
  maxPriceUSD,
  onMaxPriceChange,
  mobile = false,
}: CatalogSidebarProps) {
  const { t, lang } = useLanguage();
  const { currency, format } = useCurrency();
  const minLabel = formatFromUSD(MIN_PRICE_USD, currency, lang, DEFAULT_RATES);

  return (
    <aside
      className={cn(
        "theme-aware flex flex-col",
        mobile
          ? "w-full px-4 pb-6"
          : "sticky top-[100px] hidden h-[calc(100vh-120px)] w-[220px] flex-shrink-0 overflow-y-auto pb-8 pr-4 lg:flex",
      )}
    >
      <div className="mb-5">
        <h3 className="text-[10px] uppercase font-bold text-[var(--text-subtle)] tracking-wider mb-2 px-3">
          {t("catalogExplore")}
        </h3>
        <nav className="flex flex-col gap-0.5">
          <CategoryItem
            active={category === "all"}
            onClick={() => onCategoryChange("all")}
            icon={<SquaresFour size={15} weight="fill" />}
            label={t("navAllCategories")}
            count={uniqueProductCount(products)}
          />
          {categories.map((c) => {
            const Icon = ICON_MAP[c.icon] ?? Pill;
            return (
              <CategoryItem
                key={c.id}
                active={category === c.id}
                onClick={() => onCategoryChange(c.id)}
                icon={<Icon size={15} weight="fill" />}
                label={c.name[lang]}
                count={uniqueProductCount(products, c.id)}
              />
            );
          })}
        </nav>
      </div>

      <div className="mb-5">
        <h3 className="text-[10px] uppercase font-bold text-[var(--text-subtle)] tracking-wider mb-2 px-3">
          {t("catalogPriceRange")}
        </h3>
        <div className="px-3">
          <Slider.Root
            value={[maxPriceUSD]}
            onValueChange={(v) => onMaxPriceChange(v[0] ?? 500)}
            min={MIN_PRICE_USD}
            max={500}
            step={5}
            className="relative flex items-center select-none touch-none w-full h-5"
          >
            <Slider.Track className="bg-[var(--bg-border)] relative grow rounded-full h-1.5">
              <Slider.Range className="absolute bg-[var(--brand-action)] rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb
              aria-label="Maximum price"
              className="block w-4 h-4 bg-white border-2 border-[var(--brand-primary)] rounded-full focus:outline-none focus:ring-4 focus:ring-[var(--brand-primary)]/15"
            />
          </Slider.Root>
          <div className="flex items-center justify-between text-[10px] font-bold text-[var(--text-muted)] mt-2 tabular-nums">
            <span>{minLabel}</span>
            <span className="text-[var(--brand-primary)]">
              {t("catalogMaxPrice")} {format(maxPriceUSD)}
            </span>
          </div>
        </div>
      </div>

      <div className="theme-aware mt-auto bg-[var(--bg-card)] rounded-2xl p-3 shadow-sm border border-[var(--bg-border)] text-[11px]">
        <div className="flex items-center gap-2 mb-2 text-[var(--brand-primary)] font-bold">
          <span className="w-7 h-7 rounded-full bg-[var(--brand-soft)] flex items-center justify-center text-[var(--brand-primary-hover)]">
            <ShieldCheck size={14} weight="fill" />
          </span>
          {lang === "es" ? "Compra con confianza" : lang === "pt" ? "Compre com confianca" : "Buy with confidence"}
        </div>
        <ul className="text-[var(--text-muted)] space-y-1 text-[10px]">
          <li className="flex items-start gap-1">
            {lang === "es" ? "Puntos de retiro en Asuncion" : lang === "pt" ? "Pontos de retirada em Assuncao" : "Pickup points in Asuncion"}
          </li>
          <li className="flex items-start gap-1">
            {lang === "es"
              ? "Pedido y pago coordinados por WhatsApp"
              : lang === "pt"
                ? "Pedido e pagamento combinados pelo WhatsApp"
                : "Order and payment arranged on WhatsApp"}
          </li>
          <li className="flex items-start gap-1">
            {lang === "es" ? "Asesoramiento profesional" : lang === "pt" ? "Orientacao profissional" : "Professional advice"}
          </li>
        </ul>
      </div>
    </aside>
  );
}

interface CategoryItemProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}

function CategoryItem({ active, onClick, icon, label, count }: CategoryItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "theme-aware flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left w-full",
        active
          ? "bg-[var(--brand-soft)] text-[var(--brand-primary)]"
          : "text-[var(--text-muted)] hover:bg-[var(--bg-muted)] hover:text-[var(--text)]",
      )}
    >
      <span
        className={cn(
          "transition-colors",
          active ? "text-[var(--brand-primary)]" : "text-[var(--text-subtle)]",
        )}
      >
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {typeof count === "number" && (
        <span className="text-[10px] text-[var(--text-subtle)] tabular-nums">{count}</span>
      )}
    </button>
  );
}
