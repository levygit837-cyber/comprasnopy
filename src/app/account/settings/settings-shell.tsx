"use client";

import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { AuthCard } from "@/components/auth/auth-popover";
import { useLanguage } from "@/lib/language-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

const MARKETING_KEY = "viana.marketing_opt_in.v1";

export function SettingsShell() {
  const { t } = useLanguage();
  const [session, setSession] = useState<Session | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [marketing, setMarketing] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setLoaded(true);
      return;
    }
    setEnabled(true);
    supabase.auth.getSession().then(({ data }) => {
      applySession(data.session);
      setLoaded(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, current) =>
      applySession(current),
    );
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(MARKETING_KEY);
      if (stored !== null) setMarketing(stored === "1");
    } catch {
      /* ignore */
    }
  }, []);

  function applySession(current: Session | null) {
    setSession(current);
    if (!current) return;
    const meta = current.user.user_metadata ?? {};
    const full = (meta.full_name as string | undefined) ?? "";
    const parts = full.split(/\s+/).filter(Boolean);
    setFirstName(parts[0] ?? "");
    setLastName(parts.slice(1).join(" "));
    setEmail(current.user.email ?? "");
    setPhone((meta.phone as string | undefined) ?? "");
  }

  if (!loaded) {
    return <p className="text-[var(--text-muted)] text-sm">{t("settingsLoading")}</p>;
  }

  if (!enabled || !session) {
    return (
      <div className="theme-aware bg-[var(--bg-card)] border border-[var(--bg-border)] rounded-2xl p-5 max-w-md mx-auto">
        <h1 className="font-sans text-2xl font-semibold text-[var(--brand-green)] tracking-tight mb-2">
          {t("authConfigTitle")}
        </h1>
        <p className="text-xs text-[var(--text-muted)] mb-4">{t("authConfigSubtitle")}</p>
        <AuthCard mode="login" onChangeMode={() => {}} onClose={() => {}} />
      </div>
    );
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setSaving(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const updates: { data?: Record<string, unknown>; email?: string } = {
        data: { full_name: fullName, first_name: firstName, last_name: lastName, phone },
      };
      if (email && email !== session?.user.email) updates.email = email;
      const { error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      try {
        window.localStorage.setItem(MARKETING_KEY, marketing ? "1" : "0");
      } catch {
        /* ignore */
      }
      setMessage({ kind: "ok", text: t("authSaved") });
    } catch (err) {
      setMessage({
        kind: "err",
        text: err instanceof Error ? err.message : t("settingsSaveFailed"),
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-sans text-2xl md:text-3xl font-semibold text-[var(--brand-green)] tracking-tight">
          {t("authConfigTitle")}
        </h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">{t("authConfigSubtitle")}</p>
      </div>

      <form onSubmit={handleSave} className="theme-aware bg-[var(--bg-card)] border border-[var(--bg-border)] rounded-2xl p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field
            label={t("authFirstName")}
            value={firstName}
            onChange={setFirstName}
            required
          />
          <Field
            label={t("authLastName")}
            value={lastName}
            onChange={setLastName}
            required
          />
        </div>
        <Field
          label={t("authEmail")}
          type="email"
          value={email}
          onChange={setEmail}
          required
          hint={
            email !== session.user.email
              ? t("authEmail") + " " + t("authSaved")
              : undefined
          }
        />
        <Field
          label={t("authPhone")}
          type="tel"
          value={phone}
          onChange={setPhone}
        />

        <div className="pt-3 border-t border-[var(--bg-border)]">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={marketing}
              onChange={(e) => setMarketing(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-[var(--bg-border-strong)] accent-[var(--brand-green)]"
            />
            <span className="flex-1">
              <span className="block text-xs font-bold text-[var(--text)]">
                {t("authMarketingLabel")}
              </span>
              <span className="block text-[11px] text-[var(--text-muted)] mt-0.5">
                {t("authMarketingHint")}
              </span>
            </span>
          </label>
        </div>

        {message && (
          <p
            className={
              "text-[11px] font-medium " +
              (message.kind === "ok" ? "text-[var(--brand-green)]" : "text-[var(--brand-red)]")
            }
          >
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-[var(--brand-green)] hover:bg-[var(--brand-green-mid)] disabled:opacity-50 text-white font-bold rounded-lg py-2 text-xs transition-colors active:scale-[0.99]"
        >
          {saving ? "..." : t("authSave")}
        </button>
      </form>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  hint?: string;
}

function Field({ label, value, onChange, type = "text", required, hint }: FieldProps) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
        {label}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="theme-aware w-full h-10 px-3 rounded-lg border border-[var(--bg-border-strong)] bg-[var(--bg)] text-sm text-[var(--text)] focus:border-[var(--brand-copper)] focus:ring-2 focus:ring-[var(--brand-copper)]/15 outline-none"
      />
      {hint && <p className="text-[10px] text-[var(--text-subtle)] mt-1">{hint}</p>}
    </div>
  );
}
