import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/siteConfig";

// Parameterized social card generator. Each page references this with its own
// title so social previews are page-specific:  /og?title=...&subtitle=...
// Returns a branded 1200×630 PNG. Rendered on demand (varies by query) and
// cached per-URL at the CDN edge via the cache-control header below.

const SIZE = { width: 1200, height: 630 };

function clamp(str, max) {
  const s = (str || "").trim();
  return s.length > max ? `${s.slice(0, max - 1).trim()}…` : s;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = clamp(searchParams.get("title") || siteConfig.name, 90);
  const subtitle = clamp(searchParams.get("subtitle") || siteConfig.tagline, 70);

  // Scale the headline down for longer titles so it always fits.
  const titleSize = title.length > 60 ? 56 : title.length > 38 ? 68 : 80;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "72px 90px",
          textAlign: "center",
          background:
            "linear-gradient(135deg, #2a0822 0%, #0c0a12 55%, #1a0610 100%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        {/* gold monogram ring */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "104px",
            height: "104px",
            borderRadius: "50%",
            border: "3px solid #d4af37",
            marginBottom: "30px",
            color: "#d4af37",
            fontSize: "40px",
            fontWeight: 800,
            letterSpacing: "1px",
          }}
        >
          AP
        </div>

        <div
          style={{
            display: "flex",
            fontSize: `${titleSize}px`,
            fontWeight: 800,
            letterSpacing: "-1px",
            color: "#ffffff",
            lineHeight: 1.08,
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "30px",
            fontWeight: 600,
            color: "#e7b6d6",
            marginTop: "22px",
            maxWidth: "940px",
          }}
        >
          {subtitle}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "23px",
            color: "#c9bcae",
            marginTop: "38px",
            letterSpacing: "1px",
          }}
        >
          anitaprajapat.com · {siteConfig.city}, Rajasthan
        </div>
      </div>
    ),
    {
      ...SIZE,
      headers: {
        "cache-control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    }
  );
}
