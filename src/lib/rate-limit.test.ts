import { afterEach, describe, expect, it } from "vitest";

import { checkRateLimit, rateLimit, resetRateLimits } from "./rate-limit";

afterEach(() => {
  resetRateLimits();
});

describe("rate limiter", () => {
  it("allows events up to the limit", () => {
    for (let i = 0; i < 5; i++) {
      expect(rateLimit("auth:register", 5, 60_000)).toBe(true);
    }
  });

  it("blocks events past the limit", () => {
    for (let i = 0; i < 3; i++) {
      rateLimit("cart:add", 3, 60_000);
    }
    expect(rateLimit("cart:add", 3, 60_000)).toBe(false);
  });

  it("returns retry info when blocked", () => {
    for (let i = 0; i < 2; i++) {
      rateLimit("k", 2, 100);
    }
    const result = checkRateLimit({ key: "k", limit: 2, windowMs: 100 });
    expect(result.ok).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.retryAfterMs).toBeGreaterThanOrEqual(0);
    expect(result.retryAfterMs).toBeLessThanOrEqual(100);
  });

  it("isolates counters per key", () => {
    for (let i = 0; i < 3; i++) rateLimit("k1", 3, 60_000);
    expect(rateLimit("k1", 3, 60_000)).toBe(false);
    expect(rateLimit("k2", 3, 60_000)).toBe(true);
  });

  it("resets the window after the time passes", async () => {
    for (let i = 0; i < 2; i++) rateLimit("short", 2, 30);
    expect(rateLimit("short", 2, 30)).toBe(false);
    await new Promise((r) => setTimeout(r, 40));
    expect(rateLimit("short", 2, 30)).toBe(true);
  });

  it("resetRateLimits clears all counters", () => {
    for (let i = 0; i < 2; i++) rateLimit("a", 2, 60_000);
    expect(rateLimit("a", 2, 60_000)).toBe(false);
    resetRateLimits();
    expect(rateLimit("a", 2, 60_000)).toBe(true);
  });
});
