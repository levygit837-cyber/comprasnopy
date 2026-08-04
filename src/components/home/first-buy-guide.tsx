"use client";

import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import { useLanguage } from "@/lib/language-context";

const STEPS = [
  { key: "firstBuyStep1Title", bodyKey: "firstBuyStep1Body" },
  { key: "firstBuyStep2Title", bodyKey: "firstBuyStep2Body" },
  { key: "firstBuyStep3Title", bodyKey: "firstBuyStep3Body" },
  { key: "firstBuyStep4Title", bodyKey: "firstBuyStep4Body" },
] as const;

export function FirstBuyGuide() {
  const { t } = useLanguage();

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 mt-12 md:mt-16 mb-8">
      <div className="bg-[var(--brand-footer)] rounded-3xl p-6 md:p-10 relative overflow-hidden">
        <ShieldCheck
          size={220}
          weight="regular"
          className="absolute -right-10 -top-16 text-white/5 pointer-events-none"
        />

        <div className="text-center mb-7 relative z-10">
          <h3 className="font-sans text-2xl md:text-3xl text-white font-semibold tracking-tight">
            {t("firstBuyTitle")}
          </h3>
          <p className="text-white/70 text-xs mt-1 font-medium">
            {t("firstBuySubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative z-10">
          <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-px bg-gradient-to-r from-white/0 via-white/15 to-white/0" />

          {STEPS.map((step, idx) => (
            <div
              key={step.key}
              className="flex flex-col items-center text-center group cursor-default"
            >
              <div className="w-11 h-11 rounded-full bg-white/10 text-[var(--brand-on-dark)] flex items-center justify-center text-base font-sans font-semibold mb-2.5 group-hover:bg-[var(--brand-action)] group-hover:text-white transition-colors">
                {idx + 1}
              </div>
              <h4 className="text-white font-bold text-xs mb-0.5">{t(step.key)}</h4>
              <p className="text-white/60 text-[11px]">{t(step.bodyKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
