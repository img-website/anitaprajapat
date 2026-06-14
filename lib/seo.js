import { siteConfig } from "@/lib/siteConfig";

/**
 * Shared robots directive for indexable pages. Used by the root layout AND by
 * buildMetadata so EVERY page emits an explicit robots/googlebot meta tag
 * (child generateMetadata does not inherit the parent's robots config).
 */
export const robotsIndex = {
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
};

export const robotsNoindex = { index: false, follow: false };

/**
 * Build a Next.js Metadata object from partial input, merged with site defaults.
 */
export function buildMetadata({
  title,
  titleAbsolute = false,
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
    // `titleAbsolute` skips the root layout's "%s | Anita Prajapat" template,
    // so titles that already contain the brand don't duplicate it.
    title: titleAbsolute && title ? { absolute: title } : title,
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
    robots: noindex ? robotsNoindex : robotsIndex,
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
    "@id": `${siteConfig.url}/#person`,
    name: siteConfig.name,
    // Devanagari + channel-brand variants — GSC shows Hindi-script queries,
    // and her YouTube/Facebook presence uses the "Superstar" prefix.
    alternateName: ["अनीता प्रजापत", "Superstar Anita Prajapat", siteConfig.stageName],
    gender: "Female",
    jobTitle: siteConfig.category,
    description: siteConfig.description,
    knowsAbout: siteConfig.genres,
    knowsLanguage: ["Hindi", "Rajasthani", "Marwari"],
    nationality: { "@type": "Country", name: "India" },
    url: siteConfig.url,
    image: {
      "@type": "ImageObject",
      url: `${siteConfig.url}${siteConfig.ogImage}`,
      width: siteConfig.ogImageWidth,
      height: siteConfig.ogImageHeight,
    },
    address: { "@type": "PostalAddress", addressLocality: siteConfig.city, addressRegion: "Rajasthan", addressCountry: "IN" },
    // Explicit home city (Jaipur) with coordinates — strongest local signal for
    // the primary market. workLocation expresses the all-India touring footprint.
    homeLocation: {
      "@type": "Place",
      name: `${siteConfig.city}, Rajasthan, India`,
      address: {
        "@type": "PostalAddress",
        addressLocality: siteConfig.city,
        addressRegion: "Rajasthan",
        addressCountry: "IN",
      },
      geo: { "@type": "GeoCoordinates", latitude: 26.9124, longitude: 75.7873 },
    },
    workLocation: { "@type": "Place", name: "India" },
    sameAs: Object.values(siteConfig.social),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.tagline,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      "@id": `${siteConfig.url}/#logo`,
      url: `${siteConfig.url}${siteConfig.ogImage}`,
      width: siteConfig.ogImageWidth,
      height: siteConfig.ogImageHeight,
      caption: siteConfig.name,
    },
    sameAs: Object.values(siteConfig.social),
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
    areaServed: { "@type": "Country", name: "India" },
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
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    alternateName: `${siteConfig.name} — ${siteConfig.tagline}`,
    url: siteConfig.url,
    inLanguage: "en-IN",
    publisher: {
      "@id": `${siteConfig.url}/#organization`,
    },
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

export function videoObjectSchema({ name, description, thumbnailUrl, uploadDate, embedUrl, views }) {
  const ytMatch = embedUrl?.match(/(?:youtu\.be\/|[?&]v=|\/embed\/)([A-Za-z0-9_-]{11})/);
  const videoId = ytMatch?.[1];
  // thumbnailUrl is REQUIRED for Google's video rich result — fall back to the
  // YouTube-hosted thumbnail when no custom one was uploaded.
  const thumb = thumbnailUrl || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : null);
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: thumb ? [thumb] : undefined,
    uploadDate,
    embedUrl,
    ...(videoId ? { contentUrl: `https://www.youtube.com/watch?v=${videoId}` } : {}),
    ...(views > 0
      ? {
          interactionStatistic: {
            "@type": "InteractionCounter",
            interactionType: { "@type": "WatchAction" },
            userInteractionCount: views,
          },
        }
      : {}),
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
    // Single-evening Jagran/concert — endDate mirrors startDate (Google
    // recommends always sending endDate; omitting it triggers a GSC warning).
    endDate: ev.date,
    eventStatus:
      ev.status === "cancelled"
        ? "https://schema.org/EventCancelled"
        : "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
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
    image: ev.coverImage?.url ? [ev.coverImage.url] : undefined,
    performer: { "@type": "Person", "@id": `${siteConfig.url}/#person`, name: siteConfig.name, url: siteConfig.url },
    organizer: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    ...(ev.ticketUrl
      ? {
          offers: {
            "@type": "Offer",
            url: ev.ticketUrl,
            availability: "https://schema.org/InStock",
            validFrom: ev.createdAt || undefined,
          },
        }
      : {}),
    description: ev.description,
  };
}

/**
 * ProfilePage for /about — Google's supported markup for pages about a single
 * person/creator. Embeds the full Person as mainEntity so the about page is
 * recognized as the canonical profile.
 */
export function profilePageSchema({ dateModified } = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteConfig.url}/about#profilepage`,
    url: `${siteConfig.url}/about`,
    name: `About ${siteConfig.name}`,
    inLanguage: "en-IN",
    ...(dateModified ? { dateModified } : {}),
    mainEntity: personSchema(),
  };
}

/**
 * FAQPage — `faqs` is an array of { question, answer }. The same questions
 * MUST be visible on the page (Google requires content parity).
 */
export function faqSchema(faqs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
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
