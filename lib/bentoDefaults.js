import { siteConfig } from "@/lib/siteConfig";

/** Default copy for the homepage bento grid (overridable via Settings → Bento). */
export const defaultBento = {
  featureChip: "Live Devotional Experience",
  statLabel: "Stage shows & live jagrans",
  bookTitle: "Book for your Jagran",
  bookCta: "Chat on WhatsApp",
  repertoireLabel: "Repertoire",
  repertoireItems: siteConfig.genres.slice(0, 5),
  youtubeTitle: "Subscribe on YouTube",
  youtubeSubtitle: "New Sanwariya Seth & Khatu Shyam bhajans every week",
  portraitImage: "/images/g4.jpg",
  portraitTag: siteConfig.city,
  storyChip: "Artist Journey",
  storyTitle: "Traditional roots, modern stage presence",
  storyDescription:
    "Explore Anita Prajapat's story, live journey and devotional milestones.",
  storyLinkLabel: "Read full story",
  storyHref: "/about",
};

export function mergeBento(settings = {}) {
  const raw = settings.bento || {};
  const items = Array.isArray(raw.repertoireItems)
    ? raw.repertoireItems.filter(Boolean)
    : defaultBento.repertoireItems;
  return {
    ...defaultBento,
    ...raw,
    repertoireItems: items.length ? items : defaultBento.repertoireItems,
  };
}
