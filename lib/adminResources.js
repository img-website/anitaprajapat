import { formatDate } from "@/utils/helpers";

const statusField = {
  name: "status",
  label: "Status",
  type: "select",
  options: [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
  ],
};

// NOTE: Bhajans / videos are NOT managed here — all video content (popular,
// latest, playlists, categories) is pulled live from YouTube. The admin only
// manages non-video content.
export const resourceConfigs = {
  events: {
    resource: "events",
    label: "Event",
    defaults: { status: "upcoming", type: "jagran", state: "Rajasthan" },
    columns: [
      { key: "title", label: "Title" },
      { key: "city", label: "City" },
      { key: "date", label: "Date", render: (i) => formatDate(i.date) },
      { key: "status", label: "Status" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "type", label: "Type", type: "select", options: ["jagran", "concert", "private", "temple", "other"], required: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "startTime", label: "Start Time", type: "text", required: true },
      { name: "venue", label: "Venue", type: "text", required: true },
      { name: "city", label: "City", type: "text", required: true },
      { name: "state", label: "State", type: "text" },
      { name: "address", label: "Address", type: "text", full: true },
      { name: "coverImage", label: "Cover Image", type: "image", folder: "events" },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "mapEmbed", label: "Map Embed (iframe HTML)", type: "textarea", full: true },
      { name: "status", label: "Status", type: "select", options: ["upcoming", "past", "cancelled"] },
      { name: "isFeatured", label: "Featured", type: "boolean" },
    ],
  },

  // Photos only — videos/reels are served from YouTube, not uploaded here.
  gallery: {
    resource: "gallery",
    label: "Gallery Photo",
    defaults: { mediaType: "image", isActive: true },
    columns: [
      { key: "title", label: "Title" },
      { key: "isFeatured", label: "Featured", render: (i) => (i.isFeatured ? "Yes" : "No") },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "image", label: "Photo", type: "image", folder: "gallery", required: true },
      { name: "isFeatured", label: "Featured", type: "boolean" },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
    ],
  },

  testimonials: {
    resource: "testimonials",
    label: "Testimonial",
    defaults: { rating: 5, isActive: true },
    columns: [
      { key: "name", label: "Name" },
      { key: "rating", label: "Rating" },
      { key: "isActive", label: "Active", render: (i) => (i.isActive ? "Yes" : "No") },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "role", label: "Role / Place", type: "text" },
      { name: "rating", label: "Rating (1-5)", type: "number", required: true },
      { name: "message", label: "Message", type: "textarea", full: true, required: true },
      { name: "isFeatured", label: "Featured", type: "boolean" },
      { name: "isActive", label: "Active", type: "boolean" },
    ],
  },

  quotes: {
    resource: "quotes",
    label: "Quote",
    defaults: { isActive: true },
    columns: [
      { key: "text", label: "Quote" },
      { key: "author", label: "Author" },
    ],
    fields: [
      { name: "text", label: "Quote", type: "textarea", full: true, required: true },
      { name: "author", label: "Author", type: "text" },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
    ],
  },

  banners: {
    resource: "banners",
    label: "Banner",
    defaults: { placement: "hero", isActive: true },
    columns: [
      { key: "title", label: "Title" },
      { key: "placement", label: "Placement" },
      { key: "isActive", label: "Active", render: (i) => (i.isActive ? "Yes" : "No") },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "image", label: "Background Image", type: "image", folder: "banners" },
      { name: "placement", label: "Placement", type: "select", options: ["hero", "promo", "section"], required: true },
      { name: "primaryCtaLabel", label: "Primary CTA Label", type: "text" },
      { name: "primaryCtaUrl", label: "Primary CTA URL", type: "text" },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
    ],
  },

  sponsors: {
    resource: "sponsors",
    label: "Sponsor",
    defaults: { tier: "sponsor", isActive: true },
    columns: [
      { key: "name", label: "Name" },
      { key: "tier", label: "Tier" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "logo", label: "Logo", type: "image", folder: "sponsors", required: true },
      { name: "website", label: "Website", type: "text" },
      { name: "tier", label: "Tier", type: "select", options: ["partner", "sponsor", "media"] },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
    ],
  },

  categories: {
    resource: "categories",
    label: "Category",
    defaults: { type: "bhajan", isActive: true },
    columns: [
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "slug", label: "Slug" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "type", label: "Type", type: "select", options: ["bhajan", "blog", "event", "gallery", "general"], required: true },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
    ],
  },

  media: {
    resource: "media",
    label: "Media Coverage",
    defaults: { type: "news", isActive: true },
    columns: [
      { key: "title", label: "Title" },
      { key: "outlet", label: "Outlet" },
      { key: "type", label: "Type" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "outlet", label: "Outlet", type: "text" },
      { name: "type", label: "Type", type: "select", options: ["news", "article", "interview", "press", "video"], required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", full: true },
      { name: "externalUrl", label: "External URL", type: "text", full: true },
      { name: "image", label: "Image", type: "image", folder: "media" },
      { name: "publishedAt", label: "Published Date", type: "date" },
      { name: "isFeatured", label: "Featured", type: "boolean" },
      { name: "isActive", label: "Active", type: "boolean" },
    ],
  },

  inquiries: {
    resource: "contact",
    label: "Inquiry",
    defaults: {},
    columns: [
      { key: "name", label: "Name" },
      { key: "phone", label: "Phone" },
      { key: "type", label: "Type" },
      { key: "status", label: "Status" },
      { key: "createdAt", label: "Received", render: (i) => formatDate(i.createdAt) },
    ],
    fields: [
      { name: "status", label: "Status", type: "select", options: ["new", "contacted", "closed"] },
    ],
  },
};

export default resourceConfigs;
