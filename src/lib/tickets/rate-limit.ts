/**
 * A deliberately small in-memory limiter: one festival contact form does not justify a
 * Redis dependency, and Vercel's per-instance memory is enough to blunt a naive flood.
 *
 * The tradeoff is honest — serverless instances don't share this map, so the effective
 * limit is per-instance rather than global. If the form ever gets seriously abused, swap
 * this for a durable store; until then it costs nothing and stops the obvious cases.
 */
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

export function rateLimit(key: string): { ok: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_PER_WINDOW) {
    const oldest = recent[0] ?? now;
    return { ok: false, retryAfterSeconds: Math.ceil((WINDOW_MS - (now - oldest)) / 1000) };
  }

  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup, so the map can't grow without bound on a long-lived instance.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }

  return { ok: true, retryAfterSeconds: 0 };
}
