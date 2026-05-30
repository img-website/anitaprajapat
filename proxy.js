import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

// Next.js 16 renamed "middleware" to "proxy" (same functionality).
// This single proxy does two jobs:
//   1) NextAuth gates /admin/** (via authConfig's `authorized` callback).
//   2) Adds a per-request nonce + Content-Security-Policy on every page so the
//      script-src is strict (nonce + strict-dynamic) — effective against XSS.
const { auth } = NextAuth(authConfig);

const isDev = process.env.NODE_ENV === "development";

function cspFor(nonce) {
  return [
    "default-src 'self'",
    // Strict script policy — only nonce'd scripts (and what they load) run.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // Styles allow inline (Next inlines CSS + components use style attributes);
    // style injection is low-risk and does not affect the XSS (script) check.
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https://res.cloudinary.com https://i.ytimg.com https://img.youtube.com https://images.unsplash.com",
    "font-src 'self' data:",
    "media-src 'self' blob: https://res.cloudinary.com",
    "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com https://res.cloudinary.com",
    "frame-src https://www.google.com https://www.youtube.com https://www.youtube-nocookie.com",
    "worker-src 'self' blob:",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

export default auth((req) => {
  // `authorized` in auth.config has already allowed/denied this request.
  // Skip CSP in development — Turbopack/HMR inject scripts that a strict
  // `strict-dynamic` policy blocks (causes ChunkLoadError). CSP is a production
  // hardening feature; auth protection still runs in dev.
  if (isDev) return;

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = cspFor(nonce);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("content-security-policy", csp);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("content-security-policy", csp);
  return res;
});

export const config = {
  // Run on all pages, but skip static assets, image optimization and API routes
  // (they don't need a nonce/CSP and would only add overhead).
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|sw.js|manifest.webmanifest|icon-|logo|images/).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
