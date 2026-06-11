// Central brand + site constants. Used for SEO defaults, footer, schema, etc.
// Most of these are overridable at runtime via the Settings model (CMS).

export const siteConfig = {
  name: "Anita Prajapat",
  stageName: "Anita Prajapat",
  tagline: "Sanwariya Seth & Khatu Shyam Bhajan Singer",
  category: "Rajasthani Devotional Singer",
  // Mid-sentence variant — keeps the proper noun capitalized without Title Case.
  categoryInline: "Rajasthani devotional singer",
  description:
    "Official website of Anita Prajapat — Rajasthani devotional singer known for Sanwariya Seth Bhajan, Khatu Shyam Bhajan, Mataji Bhajan, Marwadi & Rajasthani Bhajan and live Jagran across India. Subscribe on YouTube for new bhajans every week.",
  city: "Jaipur",
  performingSince: 2016,
  stageShows: "10000+",
  // Canonical production URL. NEXT_PUBLIC_SITE_URL overrides (e.g. a custom
  // domain later). On Vercel without it set, use the stable project domain —
  // NOT VERCEL_URL, which is the per-deployment URL and unsafe for canonicals.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL ? "https://singeranitaprajapat.vercel.app" : "http://localhost:3000"),
  genres: [
    "Sanwariya Seth Bhajan",
    "Khatu Shyam Bhajan",
    "Mataji Bhajan",
    "Rajasthani Bhajan",
    "Marwadi Bhajan",
    "Live Jagran",
  ],
  keywords: [
    "Anita Prajapat",
    "Singer Anita Prajapat",
    "Sanwariya Seth Bhajan",
    "Sanwaliya Seth Bhajan",
    "Khatu Shyam Bhajan",
    "Sanwariya Seth Bhajan Singer",
    "Khatu Shyam Bhajan Singer",
    "Rajasthani Bhajan Singer",
    "Live Jagran Singer Jaipur",
    "Mataji Bhajan Singer",
    "Devotional Singer Rajasthan",
  ],
  manager: "Jitendra Kumar Bijarnia",
  phone: "8302598435",
  whatsapp: "918302598435",
  email: "anitaprajapat.superstar@gmail.com",
  social: {
    youtube: "https://www.youtube.com/@SuperstarAnitaPrajapat/",
    instagram: "https://www.instagram.com/anitaprajapat.superstar",
    facebook: "https://www.facebook.com/SuperstarAnitaPrajapat/",
    pinterest: "https://in.pinterest.com/anitaprajapatsuperstar/",
  },
  ogImage: "/images/hero.jpg",
  ogImageWidth: 720,
  ogImageHeight: 720,
};

export const mainNav = [
  { label: "Home", href: "/", title: "Anita Prajapat — Sanwariya Seth & Khatu Shyam Bhajan Singer" },
  { label: "About", href: "/about", title: "About Anita Prajapat — Rajasthani Devotional Bhajan Singer" },
  { label: "Bhajans", href: "/bhajans", title: "Watch Sanwariya Seth & Khatu Shyam Bhajans on YouTube" },
  { label: "Events", href: "/events", title: "Live Jagran Events & Bhajan Performances by Anita Prajapat" },
  { label: "Gallery", href: "/gallery", title: "Anita Prajapat Photo & Stage Gallery" },
  { label: "Media", href: "/media", title: "Press & Media Coverage — Anita Prajapat" },
  { label: "Contact", href: "/contact", title: "Contact & Booking for Jagran — Anita Prajapat" },
];

export const adminNav = [
  { label: "Dashboard", href: "/admin", icon: "grid" },
  { label: "Banners", href: "/admin/banners", icon: "image" },
  { label: "Events", href: "/admin/events", icon: "calendar" },
  { label: "Gallery", href: "/admin/gallery", icon: "camera" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "quote" },
  { label: "Sponsors", href: "/admin/sponsors", icon: "handshake" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "inbox" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

export default siteConfig;
