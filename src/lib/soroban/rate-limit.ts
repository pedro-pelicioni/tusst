import "server-only";

// Tiny in-process token bucket per client — good for the single-VPS v1.
// build/test/audit share one bucket per client so the sandbox stays scarce.

const WINDOW_MS = 5 * 60 * 1000;
const ANON_LIMIT = 8;
const SIGNED_LIMIT = 20;

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

function sweep(now: number): void {
  if (buckets.size < 1024) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/** Returns null when allowed, or seconds until the bucket resets when not. */
export function checkRateLimit(clientKey: string, signedIn: boolean): number | null {
  const now = Date.now();
  sweep(now);
  const limit = signedIn ? SIGNED_LIMIT : ANON_LIMIT;
  const bucket = buckets.get(clientKey);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(clientKey, { count: 1, resetAt: now + WINDOW_MS });
    return null;
  }
  if (bucket.count < limit) {
    bucket.count++;
    return null;
  }
  return Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
}

/** Client key for rate limiting: user id when signed in, else best-effort IP. */
export function clientKeyFor(req: Request, userId: string | null): string {
  if (userId) return `user:${userId}`;
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  return `ip:${ip}`;
}
