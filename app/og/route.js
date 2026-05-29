import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/lib/siteConfig";

// Parameterized social card generator. Each page references this with its own
// title so social previews are page-specific:  /og?title=...&subtitle=...
// Uses the project's brand fonts (Bricolage Grotesque + Plus Jakarta Sans) and
// the site logo. Rendered on demand and cached per-URL at the CDN edge.

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

  // Brand fonts + logo (read from project root; process.cwd() = project dir).
  const [heading, body, logo] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/BricolageGrotesque-Bold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/PlusJakartaSans-SemiBold.ttf")),
    readFile(join(process.cwd(), "public/logo.png")).then(
      (d) => `data:image/png;base64,${d.toString("base64")}`
    ),
  ]);

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
          fontFamily: "Plus Jakarta Sans",
        }}
      >
        {/* logo inside a gold ring */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "116px",
            height: "116px",
            borderRadius: "50%",
            border: "3px solid #d4af37",
            overflow: "hidden",
            marginBottom: "30px",
            background: "#1a0610",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo}
            alt=""
            width={116}
            height={116}
            style={{ objectFit: "cover", borderRadius: "50%" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            fontFamily: "Bricolage Grotesque",
            fontSize: `${titleSize}px`,
            fontWeight: 700,
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
      fonts: [
        { name: "Bricolage Grotesque", data: heading, style: "normal", weight: 700 },
        { name: "Plus Jakarta Sans", data: body, style: "normal", weight: 600 },
      ],
      headers: {
        "cache-control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    }
  );
}
