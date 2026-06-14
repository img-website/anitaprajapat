// Global next/image loader.
//
// Cloudinary is our image host and is itself an optimizing CDN, so we let
// Cloudinary do the resizing/format negotiation (f_auto, q_auto) via URL
// transforms and have the browser load it DIRECTLY. This removes the round-trip
// through Next's server-side image optimizer — which was timing out and
// returning 500s when the upstream was slow (`/_next/image … 500`) — and is
// faster and cheaper (no Vercel image-optimization units).
//
// Non-Cloudinary sources (local /public assets, YouTube thumbnails) are returned
// untouched and loaded directly by the browser.
export default function imageLoader({ src, width, quality }) {
  if (src.includes("res.cloudinary.com") && src.includes("/upload/")) {
    const transforms = ["f_auto", `q_${quality || "auto"}`, "c_limit", `w_${width}`].join(",");
    return src.replace("/upload/", `/upload/${transforms}/`);
  }
  // Passthrough sources (local /public assets, YouTube thumbnails) can't be
  // resized via URL. The loader contract still requires `width` to affect the
  // returned URL, so add it as a harmless hint — keeps srcset entries distinct
  // and silences Next's "loader does not implement width" warning. Static files
  // and ytimg ignore the unknown query param and serve normally.
  const sep = src.includes("?") ? "&" : "?";
  return `${src}${sep}w=${width}`;
}
