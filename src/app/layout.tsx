import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

import { CurrencyProvider } from "@/lib/currency-context";
import { LanguageProvider } from "@/lib/language-context";
import { ThemeProvider } from "@/lib/theme-context";
import { CartHydrator } from "@/components/cart/cart-hydrator";
import { CartNotifier } from "@/components/cart/cart-notifier";
import { isLang, LANGUAGE_REQUEST_HEADER } from "@/lib/language";
import { DEFAULT_LANG } from "@/lib/store";

export const metadata: Metadata = {
  title: "Compraspy - Produtos do Paraguai para todo o Brasil",
  description:
    "Marketplace de produtos selecionados no Paraguai com entrega para todo o Brasil.",
  icons: {
    icon: "/brand/compraspy-mark-orange.png",
    apple: "/brand/compraspy-mark-orange.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const detectedLanguage = requestHeaders.get(LANGUAGE_REQUEST_HEADER);
  const initialLang = isLang(detectedLanguage) ? detectedLanguage : DEFAULT_LANG;

  return (
    <html lang={initialLang === "pt" ? "pt-BR" : initialLang} suppressHydrationWarning>
      <body className="min-h-[100dvh] flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <ThemeProvider>
          <LanguageProvider initialLang={initialLang}>
            <CurrencyProvider>
              <CartHydrator />
              <CartNotifier />
              {children}
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
