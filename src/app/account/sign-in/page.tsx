import Link from "next/link";

import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata = { title: "Iniciar sesion - Viana" };

export default function SignInPage() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />

      <main className="flex-grow w-full py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-6">
            <h1 className="font-sans text-3xl font-semibold text-[var(--brand-green)] tracking-tight mb-1">
              Iniciar sesion
            </h1>
            <p className="text-[var(--text-muted)] text-xs">
              Accede a tu cuenta para gestionar pedidos y direcciones.
            </p>
          </div>
          <div className="theme-aware bg-[var(--bg-card)] border border-[var(--bg-border)] rounded-2xl p-5">
            <AuthForm mode="sign-in" />
          </div>
          <p className="text-center text-[10px] text-[var(--text-subtle)] mt-5">
            <Link href="/" className="hover:text-[var(--brand-green)]">
              &larr; Volver al inicio
            </Link>
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
