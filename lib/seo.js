import { siteConfig } from "@/lib/siteConfig";

/**
 * Build a Next.js Metadata object from partial input, merged with site defaults.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  keywords,
  type = "website",
  noindex = false,
  publishedTime,
  defaults = {},
} = {}) {
  const defaultsDescription = defaults.description || siteConfig.description;
  const defaultsKeywords = defaults.keywords || siteConfig.keywords;
  const defaultsOgImage = defaults.ogImage || siteConfig.ogImage;
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || defaultsOgImage;
  return {
    title,
    description: description || defaultsDescription,
    keywords: keywords || defaultsKeywords,
    alternates: {
      canonical: path,
      languages: {
        "en-IN": path,
        en: path,
        "x-default": path,
      },
    },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url,
      title: title || siteConfig.name,
      description: description || defaultsDescription,
      images: [{ url: ogImage, width: siteConfig.ogImageWidth, height: siteConfig.ogImageHeight }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title || siteConfig.name,
      description: description || defaultsDescription,
      images: [ogImage],
    },
  };
}

export function seoDefaultsFromSettings(settings = {}) {
  const seo = settings?.seo || {};
  return {
    description: seo.defaultDescription || siteConfig.description,
    keywords: seo.keywords?.length ? seo.keywords : siteConfig.keywords,
    ogImage: seo.ogImage || siteConfig.ogImage,
  };
}

// ─── JSON-LD builders ───────────────────────────────────────

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    alternateName: siteConfig.stageName,
    jobTitle: siteConfig.category,
    description: siteConfig.description,
    knowsAbout: siteConfig.genres,
    knowsLanguage: ["Hindi", "Rajasthani", "Marwari"],
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    address: { "@type": "PostalAddress", addressLocality: siteConfig.city, addressRegion: "Rajasthan", addressCountry: "IN" },
    sameAs: Object.values(siteConfig.social),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.ogImage}`,
    sameAs: Object.values(siteConfig.social),
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: `+${siteConfig.whatsapp}`,
        email: siteConfig.email,
        areaServed: "IN",
        availableLanguage: ["en", "hi"],
      },
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/bhajans?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function musicGroupSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: siteConfig.name,
    genre: siteConfig.genres,
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    sameAs: Object.values(siteConfig.social),
  };
}

export function videoObjectSchema({ name, description, thumbnailUrl, uploadDate, embedUrl }) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: thumbnailUrl ? [thumbnailUrl] : undefined,
    uploadDate,
    embedUrl,
  };
}

export function blogPostingSchema({ title, description, image, datePublished, dateModified, slug }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { "@type": "Person", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    mainEntityOfPage: `${siteConfig.url}/blog/${slug}`,
  };
}

export function eventSchema(ev) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: ev.title,
    startDate: ev.date,
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: ev.venue || ev.city,
      address: [ev.address, ev.city, ev.state].filter(Boolean).join(", "),
    },
    image: ev.coverImage?.url,
    performer: { "@type": "Person", name: siteConfig.name },
    description: ev.description,
  };
}

export function breadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${siteConfig.url}${it.href}`,
    })),
  };
}
