// Lightweight in-memory fixed-window rate limiter.
// Good enough for a single-instance deployment / dev. For multi-instance
// production, swap the Map for Redis/Upstash with the same interface.
const buckets = new Map();

export function rateLimit(key, { limit = 5, windowMs = 60_000 } = {}) {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }

  entry.count += 1;
  if (entry.count > limit) {
    return { ok: false, remaining: 0, retryAfter: entry.reset - now };
  }
  return { ok: true, remaining: limit - entry.count };
}

export function clientIp(req) {
  const xff = req.headers.get("x-forwarded-for");
  return (xff ? xff.split(",")[0] : null) || req.headers.get("x-real-ip") || "anon";
}
