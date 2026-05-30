import path from "node:path";

const stylesDir = path.join(process.cwd(), "styles");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Inline CSS into <style> tags — removes render-blocking stylesheet requests
  // (the CSS bundle is small and the audience is mostly first-time visitors).
  experimental: {
    inlineCss: true,
  },
  // Ensure the brand font files are bundled with the /og route on Vercel.
  outputFileTracingIncludes: {
    "/og": ["./assets/fonts/**"],
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
    // Cache optimized images at the edge for a year (fixes "efficient cache
    // lifetimes" — third-party thumbnails get re-served by Next with long TTL).
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  sassOptions: {
    // Absolute paths so `@use "abstracts" as *;` resolves from CSS Modules
    // anywhere in the tree. Both keys set for older/newer dart-sass APIs.
    includePaths: [stylesDir],
    loadPaths: [stylesDir],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Origin isolation (COOP) + tightened cross-origin policies.
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },
      {
        // Service worker must never be cached, and served as JavaScript.
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript; charset=utf-8" },
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
          { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
