"use client";

import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Envelope, Lock, Phone, User } from "@phosphor-icons/react/dist/ssr";
import type { Session } from "@supabase/supabase-js";

import { useLanguage } from "@/lib/language-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function AuthPopover() {
  const { t, lang } = useLanguage();
  const [mode, setMode] = useState<"register" | "login">("register");
  const [open, setOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, current) => setSession(current));
    return () => sub.subscription.unsubscribe();
  }, []);

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
      if (mode === "register") {
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
      setOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (!enabled) {
    return (
      <Link
        href="/account/sign-in"
        className="hidden sm:flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--brand-green)] transition-colors text-xs font-bold"
      >
        <User size={16} />
        <span className="hidden lg:inline">{t("navRegister")}</span>
      </Link>
    );
  }

  if (session) {
    return (
      <Popover.Root>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--brand-green)] transition-colors text-xs font-bold"
          >
            <User size={16} />
            <span className="hidden lg:inline max-w-[120px] truncate">
              {session.user.user_metadata?.full_name ?? session.user.email}
            </span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="end"
            sideOffset={8}
            className="theme-aware z-[80] bg-[var(--bg-card)] rounded-xl shadow-lg border border-[var(--bg-border-strong)] p-2 w-[200px] animate-fade-in"
          >
            <p className="text-[10px] text-[var(--text-subtle)] uppercase tracking-wider px-3 pt-2 pb-1">
              {session.user.email}
            </p>
            <Popover.Close asChild>
              <button
                type="button"
                onClick={async () => {
                  const sb = getSupabaseBrowserClient();
                  if (sb) await sb.auth.signOut();
                }}
                className="theme-aware w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-[var(--brand-red)] hover:bg-[var(--bg-muted)] transition-colors"
              >
                {t("authSignOut")}
              </button>
            </Popover.Close>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }

  const greeting = lang === "es" ? "Bienvenido a Viana" : lang === "pt" ? "Bem-vindo a Viana" : "Welcome to Viana";
  const switchToLoginLabel = t("authSwitchToLogin");
  const switchToRegisterLabel = t("authSwitchToRegister");

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="hidden sm:flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--brand-green)] transition-colors text-xs font-bold"
        >
          <User size={16} />
          <span className="hidden lg:inline">{t("navRegister")}</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={10}
          className="theme-aware z-[80] bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--bg-border-strong)] p-4 w-[320px] animate-fade-in"
        >
          <div className="mb-3">
            <h3 className="font-sans text-base font-semibold text-[var(--brand-green)] tracking-tight leading-tight">
              {greeting}
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              {mode === "register"
                ? lang === "es"
                  ? "Crea tu cuenta en segundos."
                  : lang === "pt"
                  ? "Crie sua conta em segundos."
                  : "Create your account in seconds."
                : lang === "es"
                ? "Entra con tu correo y contrasena."
                : lang === "pt"
                ? "Entre com seu e-mail e senha."
                : "Sign in with email and password."}
            </p>
          </div>

          <div className="flex bg-[var(--bg-muted)] rounded-lg p-0.5 mb-3">
            <button
              type="button"
              onClick={() => setMode("register")}
              className={cn(
                "theme-aware flex-1 text-[11px] font-bold py-1.5 rounded-md transition-colors",
                mode === "register"
                  ? "bg-[var(--bg-card)] text-[var(--brand-green)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]",
              )}
            >
              {t("navRegister")}
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className={cn(
                "theme-aware flex-1 text-[11px] font-bold py-1.5 rounded-md transition-colors",
                mode === "login"
                  ? "bg-[var(--bg-card)] text-[var(--brand-green)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text)]",
              )}
            >
              {t("navAccount")}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            {mode === "register" && (
              <>
                <FieldRow
                  icon={<User size={12} weight="regular" />}
                  type="text"
                  required
                  value={name}
                  onChange={setName}
                  placeholder={t("authName")}
                />
                <FieldRow
                  icon={<Phone size={12} weight="regular" />}
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  placeholder={t("authPhone")}
                />
              </>
            )}
            <FieldRow
              icon={<Envelope size={12} weight="regular" />}
              type="email"
              required
              value={email}
              onChange={setEmail}
              placeholder={t("authEmail")}
            />
            <FieldRow
              icon={<Lock size={12} weight="regular" />}
              type="password"
              required
              minLength={6}
              value={password}
              onChange={setPassword}
              placeholder={t("authPassword")}
            />

            {error && (
              <p className="text-[11px] text-[var(--brand-red)] font-medium pt-0.5">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green-mid)] disabled:opacity-50 text-white font-bold rounded-lg py-2 text-xs transition-colors active:scale-[0.99]"
            >
              {submitting
                ? "..."
                : mode === "register"
                ? t("authSubmitRegister")
                : t("authSubmitLogin")}
            </button>
          </form>

          <p className="text-[10px] text-center text-[var(--text-muted)] mt-2.5">
            {mode === "register" ? switchToLoginLabel : switchToRegisterLabel}
            <button
              type="button"
              onClick={() => setMode(mode === "register" ? "login" : "register")}
              className="ml-1 font-bold text-[var(--brand-copper)] hover:text-[var(--brand-copper-dark)]"
            >
              {mode === "register" ? t("navAccount") : t("navRegister")}
            </button>
          </p>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

interface FieldRowProps {
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  minLength?: number;
}

function FieldRow({ icon, type, value, onChange, placeholder, required, minLength }: FieldRowProps) {
  return (
    <div className="relative">
      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-subtle)] pointer-events-none">
        {icon}
      </span>
      <input
        type={type}
        required={required}
        minLength={minLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="theme-aware w-full h-9 pl-8 pr-3 rounded-lg border border-[var(--bg-border-strong)] bg-[var(--bg)] text-xs text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:border-[var(--brand-copper)] focus:ring-2 focus:ring-[var(--brand-copper)]/15 outline-none transition-colors"
      />
    </div>
  );
}
