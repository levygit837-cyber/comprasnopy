import type { Metadata } from "next";
import "./globals.css";

import { CurrencyProvider } from "@/lib/currency-context";
import { LanguageProvider } from "@/lib/language-context";
import { ThemeProvider } from "@/lib/theme-context";
import { CartHydrator } from "@/components/cart/cart-hydrator";

export const metadata: Metadata = {
  title: "Farmacia Viana - Tu farmacia de confianza en Paraguay",
  description:
    "Medicamentos y cuidado personal originales, con asesoramiento y entrega por WhatsApp en toda Asuncion.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-[100dvh] flex flex-col bg-[var(--bg)] text-[var(--text)]">
        <ThemeProvider>
          <LanguageProvider>
            <CurrencyProvider>
              <CartHydrator />
              {children}
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
