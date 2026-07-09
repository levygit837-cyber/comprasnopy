"use client";

/**
 * Sliding-window rate limiter used to throttle user interactions on the
 * client and prevent abuse (mass-clicking "+", brute-force login attempts,
 * etc.). Lives in module scope so it persists across renders and across
 * the lifetime of the page. Resets on full page reload.
 *
 * Server-side limits still need to be enforced at the Supabase / API layer
 * — this module is the first line of defense for UI-level abuse.
 */

interface Bucket {
  /** Timestamps (ms) of recent events, oldest first. */
  hits: number[];
}

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  /** Identifier for this limit. e.g. "auth:register", "cart:add". */
  key: string;
  /** Max events allowed inside `windowMs`. */
  limit: number;
  /** Sliding-window size in ms. */
  windowMs: number;
}

export interface RateLimitResult {
  ok: boolean;
  /** How many events are still allowed in the current window. */
  remaining: number;
  /** When the oldest event in the window will expire (ms), or 0. */
  retryAfterMs: number;
}

export function checkRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  let bucket = buckets.get(key);
  if (!bucket) {
    bucket = { hits: [] };
    buckets.set(key, bucket);
  }

  // Drop events that fell out of the window.
  const cutoff = now - windowMs;
  while (bucket.hits.length > 0 && bucket.hits[0]! < cutoff) {
    bucket.hits.shift();
  }

  if (bucket.hits.length >= limit) {
    const oldest = bucket.hits[0]!;
    return {
      ok: false,
      remaining: 0,
      retryAfterMs: Math.max(0, oldest + windowMs - now),
    };
  }

  bucket.hits.push(now);
  return {
    ok: true,
    remaining: limit - bucket.hits.length,
    retryAfterMs: 0,
  };
}

/** Convenience wrapper: returns true if the action is allowed. */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): boolean {
  return checkRateLimit({ key, limit, windowMs }).ok;
}

/** Clear all counters. Useful for tests and "reset" admin actions. */
export function resetRateLimits(): void {
  buckets.clear();
}
