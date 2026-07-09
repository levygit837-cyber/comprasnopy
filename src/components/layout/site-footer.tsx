"use client";

import Link from "next/link";
import { FacebookLogo, Heartbeat, InstagramLogo, MapPin, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";

import { useLanguage } from "@/lib/language-context";
import { categories } from "@/lib/categories";
import { storeConfig } from "@/lib/store";

export function SiteFooter() {
  const { t, lang } = useLanguage();
  const year = new Date().getFullYear();
  const footerCategories = categories.filter((c) =>
    ["hormonas-peptidos", "esteroides-anabolicos", "metabolicos-quemagrasas"].includes(c.id),
  );

  return (
    <footer className="theme-aware bg-[var(--brand-green)] text-white pt-10 pb-6 mt-auto border-t-[6px] border-[var(--brand-copper)]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-7 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white text-[var(--brand-green)] flex items-center justify-center">
                <Heartbeat size={18} weight="fill" />
              </div>
              <span className="font-sans font-semibold text-2xl tracking-tight leading-none mt-0.5">
                VIANA
              </span>
            </div>
            <p className="text-white/70 font-medium max-w-sm mb-4 leading-relaxed text-xs">
              {t("heroSubtitle")}
            </p>
            <div className="flex items-center gap-2">
              <a
                href={storeConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--brand-copper)] hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramLogo size={15} weight="fill" />
              </a>
              <a
                href={storeConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[var(--brand-copper)] hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FacebookLogo size={15} weight="fill" />
              </a>
            </div>
          </div>

          <div>
            <h5 className="font-bold mb-3 text-[var(--brand-copper)] uppercase tracking-wider text-xs">
              {t("footerCategories")}
            </h5>
            <ul className="space-y-1.5 text-white/80 font-medium text-xs">
              <li><Link href="/products" className="hover:text-white transition-colors">{t("navCatalog")}</Link></li>
              {footerCategories.map((category) => (
                <li key={category.id}>
                  <Link href={`/products?category=${category.slug}`} className="hover:text-white transition-colors">
                    {category.name[lang]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-3 text-[var(--brand-copper)] uppercase tracking-wider text-xs">
              {t("footerUseful")}
            </h5>
            <ul className="space-y-1.5 text-white/80 font-medium text-xs">
              <li><Link href="/account" className="hover:text-white transition-colors">{t("authProfile")}</Link></li>
              <li><Link href="/#signin" className="hover:text-white transition-colors">{t("authSignIn")}</Link></li>
              <li><Link href="/#signup" className="hover:text-white transition-colors">{t("authSignUp")}</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-3 text-[var(--brand-copper)] uppercase tracking-wider text-xs">
              {t("footerHelp")}
            </h5>
            <ul className="space-y-2 text-white/80 font-medium text-xs">
              <li className="flex items-start gap-2">
                <WhatsappLogo size={13} weight="fill" className="text-[#25D366] mt-0.5" />
                <div>
                  <span className="block text-white font-bold mb-0.5">{t("footerHelpWa")}</span>
                  <span className="text-[10px]">+595 {storeConfig.whatsappNumber.slice(3)}</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={13} weight="fill" className="text-white/70 mt-0.5" />
                <div>
                  <span className="block text-white font-bold mb-0.5">{t("footerHelpStore")}</span>
                  <span className="text-[10px]">{storeConfig.contact.address}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[10px] text-white/50 font-medium">
            &copy; {year} {storeConfig.storeFullName}. {t("footerRights")}
          </p>
          <p className="text-[10px] text-white/50 font-medium">
            {t("footerDisclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
