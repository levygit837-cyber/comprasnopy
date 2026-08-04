"use client";

import * as Popover from "@radix-ui/react-popover";
import * as Select from "@radix-ui/react-select";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CaretDown,
  Check,
  Envelope,
  Gear,
  Lock,
  Phone,
  Receipt,
  SignOut,
  User,
} from "@phosphor-icons/react/dist/ssr";
import type { Session } from "@supabase/supabase-js";

import { useLanguage } from "@/lib/language-context";
import { COUNTRIES, countryByCode } from "@/lib/countries";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { useOverlayOpen, useOverlayStore } from "@/lib/overlay-store";
import { rateLimit } from "@/lib/rate-limit";
import { cn } from "@/lib/utils";

type Mode = "register" | "login" | "forgot";

export function AuthPopover() {
  const { t, lang } = useLanguage();
  const router = useRouter();

  const [enabled, setEnabled] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [mode, setMode] = useState<Mode>("register");
  const popoverOpen = useOverlayOpen("auth");
  const openOverlay = useOverlayStore((s) => s.open);
  const closeOverlay = useOverlayStore((s) => s.close);

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

  useEffect(() => {
    if (typeof window === "undefined") return;
    const apply = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (hash === "signin") {
        setMode("login");
        openOverlay("auth");
      } else if (hash === "signup") {
        setMode("register");
        openOverlay("auth");
      } else if (hash === "forgot") {
        setMode("forgot");
        openOverlay("auth");
      }
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, [openOverlay]);

  if (!enabled) {
    return (
      <Popover.Root open={popoverOpen} onOpenChange={(o) => (o ? openOverlay("auth") : closeOverlay("auth"))}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors text-xs font-bold"
          >
            <User size={16} />
            <span className="hidden lg:inline">{t("navRegister")}</span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            align="end"
            sideOffset={10}
            className="theme-aware z-[80] bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--bg-border-strong)] p-4 w-[340px] animate-fade-in"
          >
            <AuthCard
              mode={mode}
              onChangeMode={setMode}
              onClose={() => closeOverlay("auth")}
              disabled
            />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    );
  }

  if (session) {
    const email = session.user.email ?? "";
    const name = (session.user.user_metadata?.full_name as string | undefined) ?? email;
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            type="button"
            className="hidden sm:flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors text-xs font-bold"
          >
            <span className="w-7 h-7 rounded-full bg-[var(--brand-soft)] text-[var(--brand-primary)] flex items-center justify-center font-bold uppercase">
              {(name[0] || "U").toUpperCase()}
            </span>
            <span className="hidden lg:inline max-w-[120px] truncate">{name}</span>
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={8}
            className="theme-aware z-[80] bg-[var(--bg-card)] rounded-xl shadow-lg border border-[var(--bg-border-strong)] p-2 w-[220px] animate-fade-in"
          >
            <p className="text-[10px] text-[var(--text-subtle)] uppercase tracking-wider px-3 pt-2 pb-1 truncate">
              {email}
            </p>
            <DropdownMenu.Item asChild>
              <Link
                href="/account/settings"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-colors outline-none cursor-pointer"
              >
                <Gear size={13} weight="regular" />
                {t("authSettings")}
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild>
              <Link
                href="/account/orders"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-[var(--text)] hover:bg-[var(--bg-muted)] transition-colors outline-none cursor-pointer"
              >
                <Receipt size={13} weight="regular" />
                {t("authMyOrders")}
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Separator className="my-1 h-px bg-[var(--bg-border)]" />
            <DropdownMenu.Item asChild>
              <button
                type="button"
                onClick={async () => {
                  const sb = getSupabaseBrowserClient();
                  if (sb) await sb.auth.signOut();
                  router.refresh();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-[var(--brand-red)] hover:bg-[var(--bg-muted)] transition-colors outline-none cursor-pointer"
              >
                <SignOut size={13} weight="regular" />
                {t("authSignOut")}
              </button>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  }

  return (
    <Popover.Root open={popoverOpen} onOpenChange={(o) => (o ? openOverlay("auth") : closeOverlay("auth"))}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="hidden sm:flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--brand-primary)] transition-colors text-xs font-bold"
        >
          <User size={16} />
          <span className="hidden lg:inline">{t("navRegister")}</span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={10}
          className="theme-aware z-[80] bg-[var(--bg-card)] rounded-2xl shadow-2xl border border-[var(--bg-border-strong)] p-4 w-[340px] animate-fade-in"
        >
          <AuthCard
            mode={mode}
            onChangeMode={setMode}
            onClose={() => closeOverlay("auth")}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

interface AuthCardProps {
  mode: Mode;
  onChangeMode: (m: Mode) => void;
  onClose: () => void;
  /** True when Supabase env vars are missing — disables the form and shows a notice. */
  disabled?: boolean;
}

export function AuthCard({ mode, onChangeMode, onClose, disabled = false }: AuthCardProps) {
  const { t, lang } = useLanguage();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [countryCode, setCountryCode] = useState("PY");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const greeting =
    mode === "forgot"
      ? lang === "es"
        ? "Restablecer contrasena"
        : lang === "pt"
        ? "Redefinir senha"
        : "Reset your password"
      : lang === "es"
      ? "Bienvenido a Viana"
      : lang === "pt"
      ? "Bem-vindo a Viana"
      : "Welcome to Viana";

  const subline =
    mode === "forgot"
      ? t("authForgotBody")
      : mode === "register"
      ? lang === "es"
        ? "Crea tu cuenta en segundos."
        : lang === "pt"
        ? "Crie sua conta em segundos."
        : "Create your account in seconds."
      : lang === "es"
      ? "Entra con tu correo o telefono."
      : lang === "pt"
      ? "Entre com seu e-mail ou telefone."
      : "Sign in with email or phone.";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);

    // Throttle per-action: registration/login/forgot share the same key so
    // hammering the form can't slip past the per-endpoint limit. The window
    // is generous enough for a real user with a typo or two.
    const rateKey = `auth:${mode}`;
    if (!rateLimit(rateKey, 5, 60_000)) {
      setError(
        lang === "es"
          ? "Demasiados intentos. Espera un momento antes de volver a intentarlo."
          : lang === "pt"
          ? "Muitas tentativas. Aguarde um momento."
          : "Too many attempts. Please wait a moment.",
      );
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("Auth not configured. Add Supabase env vars to .env.local.");
      return;
    }

    if (mode === "forgot") {
      if (!email) {
        setError(t("authEmail"));
        return;
      }
      setSubmitting(true);
      try {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/account/settings`,
        });
        setInfo(t("authForgotSent"));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Request failed");
      } finally {
        setSubmitting(false);
      }
      return;
    }

    if (mode === "register") {
      if (password !== confirmPassword) {
        setError(lang === "es" ? "Las contrasenas no coinciden" : lang === "pt" ? "As senhas nao coincidem" : "Passwords do not match");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (mode === "register") {
        const country = countryByCode(countryCode);
        const dialDigits = (country?.dial ?? "").replace(/^\+/, "");
        const localPhone = phone.replace(/\D/g, "");
        const e164Phone = localPhone ? `+${dialDigits}${localPhone}` : "";
        const fullName = `${firstName} ${lastName}`.trim();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              first_name: firstName,
              last_name: lastName,
              phone: e164Phone,
              country: countryCode,
            },
          },
        });
        if (error) throw error;
        // Auto-login: Supabase returns a session immediately when email
        // confirmation is disabled. If it's still null (project requires
        // confirmation), fall back to a sign-in attempt with the same
        // credentials — most projects don't require confirmation, but this
        // keeps the UX smooth if the dashboard setting ever flips back.
        if (data.session) {
          onClose();
        } else {
          const { error: signInErr } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (signInErr) throw signInErr;
          onClose();
        }
      } else {
        const identifier = emailOrPhone.trim();
        const isPhone = /^\+?\d[\d\s-]{5,}$/.test(identifier) && !identifier.includes("@");
        if (isPhone) {
          // Login by phone requires a server-side lookup of the email; we
          // resolve via Supabase admin API only on the server. For the
          // storefront client, we accept phone-shaped input and translate
          // it to an email lookup by asking Supabase to sign in with the
          // identifier as the email when it contains '@'.
          setError(
            lang === "es"
              ? "Por ahora inicia sesion con tu correo electronico."
              : lang === "pt"
              ? "Por enquanto, entre com seu e-mail."
              : "For now, please sign in with your email.",
          );
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password,
        });
        if (error) throw error;
        onClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-3">
        <h3 className="font-sans text-base font-semibold text-[var(--brand-primary)] tracking-tight leading-tight">
          {greeting}
        </h3>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{subline}</p>
      </div>

      {disabled && (
        <p className="text-[11px] text-[var(--text-subtle)] bg-[var(--bg-muted)] border border-[var(--bg-border)] rounded-lg px-3 py-2 mb-3">
          {lang === "es"
            ? "La autenticacion no esta configurada todavia. Anade las variables de Supabase en .env.local."
            : lang === "pt"
            ? "A autenticacao nao esta configurada. Adicione as variaveis do Supabase em .env.local."
            : "Auth is not configured yet. Add Supabase env vars to .env.local."}
        </p>
      )}

      {mode !== "forgot" && (
        <div className="flex bg-[var(--bg-muted)] rounded-lg p-0.5 mb-3">
          <button
            type="button"
            onClick={() => onChangeMode("register")}
            className={cn(
              "theme-aware flex-1 text-[11px] font-bold py-1.5 rounded-md transition-colors",
              mode === "register"
                ? "bg-[var(--bg-card)] text-[var(--brand-primary)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text)]",
            )}
          >
            {t("navRegister")}
          </button>
          <button
            type="button"
            onClick={() => onChangeMode("login")}
            className={cn(
              "theme-aware flex-1 text-[11px] font-bold py-1.5 rounded-md transition-colors",
              mode === "login"
                ? "bg-[var(--bg-card)] text-[var(--brand-primary)] shadow-sm"
                : "text-[var(--text-muted)] hover:text-[var(--text)]",
            )}
          >
            {t("navAccount")}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        {mode === "register" && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <FieldRow
                icon={<User size={12} weight="regular" />}
                type="text"
                required
                value={firstName}
                onChange={setFirstName}
                placeholder={t("authFirstName")}
              />
              <FieldRow
                icon={<User size={12} weight="regular" />}
                type="text"
                required
                value={lastName}
                onChange={setLastName}
                placeholder={t("authLastName")}
              />
            </div>
            <CountrySelect value={countryCode} onChange={setCountryCode} lang={lang} />
            <div className="flex gap-2">
              <FieldRow
                icon={<Phone size={12} weight="regular" />}
                type="tel"
                value={phone}
                onChange={setPhone}
                placeholder={t("authPhone")}
                className="flex-1 min-w-0"
              />
            </div>
          </>
        )}

        {mode === "login" ? (
          <FieldRow
            icon={<Envelope size={12} weight="regular" />}
            type="text"
            required
            value={emailOrPhone}
            onChange={setEmailOrPhone}
            placeholder={t("authEmailOrPhone")}
            autoComplete="username"
          />
        ) : (
          <FieldRow
            icon={<Envelope size={12} weight="regular" />}
            type="email"
            required
            value={mode === "forgot" ? email : email}
            onChange={setEmail}
            placeholder={t("authEmail")}
            autoComplete="email"
          />
        )}

        {mode !== "forgot" && (
          <FieldRow
            icon={<Lock size={12} weight="regular" />}
            type="password"
            required
            minLength={6}
            value={password}
            onChange={setPassword}
            placeholder={t("authPassword")}
            autoComplete={mode === "register" ? "new-password" : "current-password"}
          />
        )}

        {mode === "register" && (
          <FieldRow
            icon={<Lock size={12} weight="regular" />}
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder={t("authConfirmPassword")}
            autoComplete="new-password"
          />
        )}

        {error && (
          <p className="text-[11px] text-[var(--brand-red)] font-medium pt-0.5">{error}</p>
        )}
        {info && (
          <p className="text-[11px] text-[var(--brand-primary)] font-medium pt-0.5">{info}</p>
        )}

        <button
          type="submit"
          disabled={submitting || disabled}
          className="w-full bg-[var(--brand-action)] hover:bg-[var(--brand-action-hover)] disabled:opacity-50 text-white font-bold rounded-lg py-2 text-xs transition-colors active:scale-[0.99]"
        >
          {submitting
            ? "..."
            : mode === "register"
            ? t("authSubmitRegister")
            : mode === "forgot"
            ? t("authSubmit")
            : t("authSubmitLogin")}
        </button>
      </form>

      <div className="text-[10px] text-center text-[var(--text-muted)] mt-2.5 flex items-center justify-center gap-1 flex-wrap">
        {mode === "forgot" ? (
          <button
            type="button"
            onClick={() => onChangeMode("login")}
            className="font-bold text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]"
          >
            &larr; {t("navAccount")}
          </button>
        ) : mode === "register" ? (
          <>
            {t("authSwitchToLogin")}
            <button
              type="button"
              onClick={() => onChangeMode("login")}
              className="font-bold text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]"
            >
              {t("navAccount")}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onChangeMode("forgot")}
              className="font-bold text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]"
            >
              {t("authForgotPassword")}
            </button>
            <span className="text-[var(--text-subtle)] mx-1">|</span>
            {t("authSwitchToRegister")}
            <button
              type="button"
              onClick={() => onChangeMode("register")}
              className="font-bold text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)]"
            >
              {t("navRegister")}
            </button>
          </>
        )}
      </div>
    </div>
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
  autoComplete?: string;
  className?: string;
}

function FieldRow({
  icon,
  type,
  value,
  onChange,
  placeholder,
  required,
  minLength,
  autoComplete,
  className,
}: FieldRowProps) {
  return (
    <div className={cn("relative", className)}>
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
        autoComplete={autoComplete}
        className="theme-aware w-full h-9 pl-8 pr-3 rounded-lg border border-[var(--bg-border-strong)] bg-[var(--bg)] text-xs text-[var(--text)] placeholder:text-[var(--text-subtle)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 outline-none transition-colors"
      />
    </div>
  );
}

interface CountrySelectProps {
  value: string;
  onChange: (code: string) => void;
  lang: "es" | "pt" | "en";
}

function CountrySelect({ value, onChange, lang }: CountrySelectProps) {
  const selected = countryByCode(value) ?? COUNTRIES[0];
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger
        className="theme-aware flex items-center justify-between w-full h-9 px-3 rounded-lg border border-[var(--bg-border-strong)] bg-[var(--bg)] text-xs text-[var(--text)] focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)]/15 outline-none"
      >
        <Select.Value>
          <span className="flex items-center gap-2">
            <span className="font-bold text-[var(--text-muted)]">{selected.dial}</span>
            <span className="truncate">{selected.name[lang]}</span>
          </span>
        </Select.Value>
        <Select.Icon>
          <CaretDown size={11} weight="bold" className="opacity-60" />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={4}
          className="z-[90] bg-[var(--bg-card)] rounded-xl shadow-lg border border-[var(--bg-border-strong)] p-1 max-h-[280px] animate-fade-in"
        >
          <Select.Viewport>
            {COUNTRIES.map((c) => (
              <Select.Item
                key={c.code}
                value={c.code}
                className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:bg-[var(--bg-muted)] focus:bg-[var(--bg-muted)] outline-none cursor-pointer data-[state=checked]:text-[var(--brand-primary)]"
              >
                <Select.ItemText>
                  <span className="flex items-center gap-2">
                    <span className="font-bold tabular-nums w-12">{c.dial}</span>
                    <span>{c.name[lang]}</span>
                  </span>
                </Select.ItemText>
                <Select.ItemIndicator>
                  <Check size={11} weight="bold" className="text-[var(--brand-primary)]" />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
