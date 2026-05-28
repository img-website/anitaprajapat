// Central brand + site constants. Used for SEO defaults, footer, schema, etc.
// Most of these are overridable at runtime via the Settings model (CMS).

export const siteConfig = {
  name: "Anita Prajapat",
  stageName: "Anita Prajapat",
  tagline: "Rajasthani Devotional Singer",
  category: "Rajasthani Devotional Singer",
  description:
    "Official website of Anita Prajapat — Rajasthani devotional singer known for Khatu Shyam Bhajan, Mataji Bhajan, Marwadi & Rajasthani Bhajan and live Jagran across India.",
  city: "Jaipur",
  performingSince: 2016,
  stageShows: "4389+",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  genres: [
    "Khatu Shyam Bhajan",
    "Mataji Bhajan",
    "Rajasthani Bhajan",
    "Marwadi Bhajan",
    "Live Jagran",
    "Spiritual Music",
  ],
  keywords: [
    "Anita Prajapat",
    "Singer Anita Prajapat",
    "Khatu Shyam Bhajan",
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
  ogImage: "/og-default.svg",
};

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Bhajans", href: "/bhajans" },
  { label: "Events", href: "/events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Media", href: "/media" },
  { label: "Contact", href: "/contact" },
];

export const adminNav = [
  { label: "Dashboard", href: "/admin", icon: "grid" },
  { label: "Banners", href: "/admin/banners", icon: "image" },
  { label: "Events", href: "/admin/events", icon: "calendar" },
  { label: "Gallery", href: "/admin/gallery", icon: "camera" },
  { label: "Testimonials", href: "/admin/testimonials", icon: "quote" },
  { label: "Quotes", href: "/admin/quotes", icon: "sparkle" },
  { label: "Sponsors", href: "/admin/sponsors", icon: "handshake" },
  { label: "Categories", href: "/admin/categories", icon: "folder" },
  { label: "Inquiries", href: "/admin/inquiries", icon: "inbox" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

export default siteConfig;
