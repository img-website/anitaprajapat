import { siteConfig } from "@/lib/siteConfig";

// Web App Manifest — Next.js official file convention.
// Served at /manifest.webmanifest; Next auto-injects <link rel="manifest">.
export default function manifest() {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fbf6fb",
    theme_color: "#b5277d",
    lang: "en-IN",
    dir: "ltr",
    categories: ["music", "entertainment", "lifestyle"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
