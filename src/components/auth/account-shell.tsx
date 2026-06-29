"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { useLanguage } from "@/lib/language-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export function AccountShell() {
  const { t } = useLanguage();
  const [session, setSession] = useState<Session | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoaded(true);
      return;
    }
    setEnabled(true);
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoaded(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, current) => {
      setSession(current);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!loaded) {
    return <p className="text-[var(--text-muted)]">Cargando...</p>;
  }

  if (!enabled) {
    return (
      <div className="theme-aware text-center py-10 bg-[var(--bg-card)] border border-[var(--bg-border)] rounded-2xl px-5">
        <p className="text-[var(--text-muted)] mb-3 text-sm">
          La autenticacion no esta configurada todavia.
        </p>
        <Link
          href="/"
          className="inline-flex bg-[var(--brand-green)] text-white font-bold px-5 py-2.5 rounded-full hover:bg-[var(--brand-green-mid)] transition-colors text-xs"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-10 space-y-3">
        <p className="text-[var(--text-muted)] text-sm">Inicia sesion para ver tu cuenta.</p>
        <Link
          href="/account/sign-in"
          className="inline-flex bg-[var(--brand-green)] text-white font-bold px-5 py-2.5 rounded-full hover:bg-[var(--brand-green-mid)] transition-colors text-xs"
        >
          {t("authSignIn")}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="theme-aware bg-[var(--bg-card)] border border-[var(--bg-border)] rounded-2xl p-4">
        <h2 className="font-sans text-lg font-semibold text-[var(--brand-green)] tracking-tight mb-1">
          {t("authProfile")}
        </h2>
        <p className="text-xs text-[var(--text-muted)]">{session.user.email}</p>
      </div>
      <button
        type="button"
        onClick={async () => {
          const sb = getSupabaseBrowserClient();
          if (sb) await sb.auth.signOut();
        }}
        className="text-xs font-bold text-[var(--brand-red)] hover:underline"
      >
        {t("authSignOut")}
      </button>
    </div>
  );
}
