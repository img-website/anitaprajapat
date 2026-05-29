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
  const url = `${siteConfig.url}${path}`;
  // Page-specific image (event cover, bhajan thumbnail, …) or an admin-uploaded
  // custom default. When neither exists, generate a branded 1200×630 card via
  // /og carrying THIS page's title, so every page gets its own social preview.
  const pageImage = image || defaults.ogImage || null;
  const cardTitle = title || siteConfig.name;
  const generatedOg = `${siteConfig.url}/og?title=${encodeURIComponent(cardTitle)}`;
  const ogImages = pageImage
    ? [{ url: pageImage }]
    : [{ url: generatedOg, width: 1200, height: 630 }];
  const twitterImage = pageImage || generatedOg;
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
      images: ogImages,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: title || siteConfig.name,
      description: description || defaultsDescription,
      images: [twitterImage],
    },
  };
}

export function seoDefaultsFromSettings(settings = {}) {
  const seo = settings?.seo || {};
  return {
    description: seo.defaultDescription || siteConfig.description,
    keywords: seo.keywords?.length ? seo.keywords : siteConfig.keywords,
    // null → fall back to the branded opengraph-image file convention.
    ogImage: seo.ogImage || null,
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
    image: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${siteConfig.ogImage}`,
      width: siteConfig.ogImageWidth,
      height: siteConfig.ogImageHeight,
    },
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
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${siteConfig.ogImage}`,
      width: siteConfig.ogImageWidth,
      height: siteConfig.ogImageHeight,
    },
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
    image: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${siteConfig.ogImage}`,
      width: siteConfig.ogImageWidth,
      height: siteConfig.ogImageHeight,
    },
    sameAs: Object.values(siteConfig.social),
  };
}

export function videoObjectSchema({ name, description, thumbnailUrl, uploadDate, embedUrl }) {
  const ytMatch = embedUrl?.match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([A-Za-z0-9_-]{11})/);
  const videoId = ytMatch?.[1];
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: thumbnailUrl ? [thumbnailUrl] : undefined,
    uploadDate,
    embedUrl,
    ...(videoId ? { contentUrl: `https://www.youtube.com/watch?v=${videoId}` } : {}),
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.ogImage}`,
      },
    },
  };
}

export function newsArticleSchema({ title, description, image, datePublished, dateModified, url, outlet }) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    image: image ? [image] : undefined,
    datePublished,
    dateModified: dateModified || datePublished,
    about: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    author: { "@type": "Organization", name: outlet || siteConfig.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.ogImage}`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url || siteConfig.url },
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
      address: {
        "@type": "PostalAddress",
        streetAddress: ev.address || undefined,
        addressLocality: ev.city,
        addressRegion: ev.state,
        addressCountry: "IN",
      },
    },
    image: ev.coverImage?.url,
    performer: { "@type": "Person", name: siteConfig.name, url: siteConfig.url },
    organizer: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    description: ev.description,
  };
}

export function breadcrumbSchema(items) {
  const allItems = [{ name: "Home", href: "/" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      ...(it.href ? { item: `${siteConfig.url}${it.href}` } : {}),
    })),
  };
}

/**
 * ImageGallery for the /gallery page — helps Google Images understand the
 * collection. `images` is an array of { url, caption? }.
 */
export function imageGallerySchema(images = [], { path = "/gallery", name = "Gallery" } = {}) {
  const associated = images
    .filter((img) => img?.url && /^https?:\/\//.test(img.url))
    .map((img) => ({
      "@type": "ImageObject",
      contentUrl: img.url,
      ...(img.caption ? { caption: img.caption } : {}),
    }));
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `${name} — ${siteConfig.name}`,
    url: `${siteConfig.url}${path}`,
    ...(associated.length ? { image: associated } : {}),
  };
}

/**
 * ItemList for listing pages (e.g. /media) — gives Google an ordered list of
 * the page's entries. `items` is an array of { name, url }.
 */
export function itemListSchema(items = [], { name = "List" } = {}) {
  const elements = items
    .filter((it) => it?.name && it?.url)
    .map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: it.url,
    }));
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${name} — ${siteConfig.name}`,
    numberOfItems: elements.length,
    itemListElement: elements,
  };
}
