import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "@/styles/globals.scss";
import { siteConfig } from "@/lib/siteConfig";
import Providers from "@/components/providers/Providers";
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
  const ogImage = seo.ogImage || siteConfig.ogImage;
  const gscVerification = seo.gscVerification || undefined;

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteName} — ${tagline}`,
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
      title: `${siteName} — ${tagline}`,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} — ${tagline}`,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      noimageindex: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-image-preview": "large",
        "max-video-preview": -1,
        "max-snippet": -1,
      },
    },
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

  return (
    <html
      lang="en"
      data-theme="light"
      data-scroll-behavior="smooth"
      className={`${heading.variable} ${body.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        {gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaMeasurementId}');`}
            </Script>
          </>
        )}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
