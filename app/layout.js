import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import "@/styles/globals.scss";
import { siteConfig } from "@/lib/siteConfig";
import { robotsIndex } from "@/lib/seo";
import Providers from "@/components/providers/Providers";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import { getSettings } from "@/services/content";

// Display: Bricolage Grotesque (expressive, modern). Body: Plus Jakarta Sans.
const heading = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const body = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export async function generateMetadata() {
  const settings = await getSettings();
  const siteName = settings?.siteName || siteConfig.name;
  const tagline = settings?.tagline || siteConfig.tagline;
  const seo = settings?.seo || {};
  const description = seo.defaultDescription || siteConfig.description;
  const gscVerification = seo.gscVerification || undefined;
  const defaultTitle = seo.defaultTitle?.trim() || `${siteName} — ${tagline}`;
  // Social card: admin-uploaded custom image wins; otherwise the branded
  // /og generator renders a card with the site name + tagline.
  const ogImageUrl =
    seo.ogImage ||
    `${siteConfig.url}/og?title=${encodeURIComponent(siteName)}&subtitle=${encodeURIComponent(tagline)}`;
  const ogImages = seo.ogImage
    ? [{ url: ogImageUrl }]
    : [{ url: ogImageUrl, width: 1200, height: 630 }];

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: defaultTitle,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: seo.keywords?.length ? seo.keywords : siteConfig.keywords,
    authors: [{ name: siteName }],
    creator: siteName,
    alternates: {
      canonical: "/",
      languages: {
        "en-IN": "/",
        en: "/",
        "x-default": "/",
      },
    },
    verification: {
      google: gscVerification,
    },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: siteConfig.url,
      siteName,
      title: defaultTitle,
      description,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} — ${tagline}`,
      description,
      images: [ogImageUrl],
    },
    robots: robotsIndex,
  };
}

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf4ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0c0a12" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Avoid theme flash: apply data-theme before hydration (default light).
const themeInit = `
(function(){try{
  var t = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', t);
}catch(e){document.documentElement.setAttribute('data-theme','light');}})();
`;

export default async function RootLayout({ children }) {
  const settings = await getSettings();
  const gaMeasurementId = settings?.seo?.gaMeasurementId || "";
  // CSP nonce injected by proxy.js — applied to our inline scripts so they pass
  // the strict script-src policy.
  const nonce = (await headers()).get("x-nonce") || undefined;

  return (
    <html
      lang="en-IN"
      data-theme="light"
      data-scroll-behavior="smooth"
      className={`${heading.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Warm up connections to the image CDNs used above the fold / in lists. */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
        {/* Browsers strip the nonce attribute from the DOM (anti-exfiltration),
            so the hydrated value differs from SSR — suppress that false mismatch. */}
        <script nonce={nonce} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        {gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
              nonce={nonce}
            />
            <Script id="ga-init" strategy="afterInteractive" nonce={nonce}>
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaMeasurementId}');`}
            </Script>
          </>
        )}
        <Providers>{children}</Providers>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
