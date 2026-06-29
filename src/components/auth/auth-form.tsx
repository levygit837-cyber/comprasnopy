"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useLanguage } from "@/lib/language-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSignUp = mode === "sign-up";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Auth not configured. Add Supabase env vars to .env.local.");
      return;
    }
    setSubmitting(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name, phone } },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.push("/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {isSignUp && (
        <>
          <div>
            <label
              htmlFor="name"
              className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5"
            >
              {t("authName")}
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="theme-aware w-full h-10 px-3 rounded-lg border border-[var(--bg-border-strong)] bg-[var(--bg)] text-sm text-[var(--text)] focus:border-[var(--brand-copper)] focus:ring-2 focus:ring-[var(--brand-copper)]/10 outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5"
            >
              {t("authPhone")}
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="theme-aware w-full h-10 px-3 rounded-lg border border-[var(--bg-border-strong)] bg-[var(--bg)] text-sm text-[var(--text)] focus:border-[var(--brand-copper)] focus:ring-2 focus:ring-[var(--brand-copper)]/10 outline-none"
            />
          </div>
        </>
      )}
      <div>
        <label
          htmlFor="email"
          className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5"
        >
          {t("authEmail")}
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="theme-aware w-full h-10 px-3 rounded-lg border border-[var(--bg-border-strong)] bg-[var(--bg)] text-sm text-[var(--text)] focus:border-[var(--brand-copper)] focus:ring-2 focus:ring-[var(--brand-copper)]/10 outline-none"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5"
        >
          {t("authPassword")}
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="theme-aware w-full h-10 px-3 rounded-lg border border-[var(--bg-border-strong)] bg-[var(--bg)] text-sm text-[var(--text)] focus:border-[var(--brand-copper)] focus:ring-2 focus:ring-[var(--brand-copper)]/10 outline-none"
        />
      </div>

      {error && (
        <p className="text-xs text-[var(--brand-red)] font-medium">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green-mid)] disabled:opacity-50 text-white font-bold rounded-full py-2.5 text-sm transition-colors shadow-md active:scale-[0.99]"
      >
        {submitting
          ? "..."
          : isSignUp
          ? t("authSubmitRegister")
          : t("authSubmitLogin")}
      </button>

      <p className="text-xs text-center text-[var(--text-muted)]">
        {isSignUp ? t("authHaveAccount") : t("authNoAccount")}{" "}
        <Link
          href={isSignUp ? "/account/sign-in" : "/account/sign-up"}
          className="font-bold text-[var(--brand-copper)] hover:text-[var(--brand-copper-dark)]"
        >
          {isSignUp ? t("authSignIn") : t("authSignUp")}
        </Link>
      </p>
    </form>
  );
}
