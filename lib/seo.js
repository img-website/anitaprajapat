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
} = {}) {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || siteConfig.ogImage;
  return {
    title,
    description: description || siteConfig.description,
    keywords: keywords || siteConfig.keywords,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type,
      url,
      title: title || siteConfig.name,
      description: description || siteConfig.description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title || siteConfig.name,
      description: description || siteConfig.description,
      images: [ogImage],
    },
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
    url: siteConfig.url,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    address: { "@type": "PostalAddress", addressLocality: siteConfig.city, addressRegion: "Rajasthan", addressCountry: "IN" },
    sameAs: Object.values(siteConfig.social),
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
