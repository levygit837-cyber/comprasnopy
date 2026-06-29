"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Returns true only when both NEXT_PUBLIC_SUPABASE_URL and
 * NEXT_PUBLIC_SUPABASE_ANON_KEY are configured. Components that need auth
 * (popover, account pages) should check this before mounting so the build
 * works without credentials.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && url.length > 0 && key.length > 0);
}

/**
 * Returns a Supabase browser client. If the env vars are not configured,
 * returns `null` so callers can fall back to a disabled UI instead of
 * crashing the whole page.
 */
export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) return null;
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
