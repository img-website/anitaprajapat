import { formatDate } from "@/utils/helpers";

/** Format date for display in admin cards/tables (Indian locale, readable). */
function fmtDate(val) {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return String(val); }
}

function fmtDateTime(val) {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  } catch { return String(val); }
}

// Shared badge color palettes
const STATUS_COLORS = {
  upcoming: "#22c55e",
  past: "#94a3b8",
  cancelled: "#ef4444",
  draft: "#f59e0b",
  published: "#22c55e",
  active: "#22c55e",
  inactive: "#94a3b8",
  new: "#3b82f6",
  contacted: "#f59e0b",
  closed: "#94a3b8",
};

/** Derive an event's lifecycle from its date (no manual status field needed). */
function eventLifecycle(ev) {
  if (!ev?.date) return "upcoming";
  return new Date(ev.date) >= new Date() ? "upcoming" : "past";
}

const TIER_COLORS = {
  partner: "#8b5cf6",
  sponsor: "#3b82f6",
  media: "#ec4899",
};

const TYPE_COLORS = {
  jagran: "#f59e0b",
  concert: "#8b5cf6",
  private: "#3b82f6",
  temple: "#22c55e",
  other: "#94a3b8",
  news: "#3b82f6",
  article: "#22c55e",
  interview: "#8b5cf6",
  press: "#f59e0b",
  video: "#ef4444",
};

export const resourceConfigs = {

  // ── Events ────────────────────────────────────────────────
  events: {
    resource: "events",
    label: "Event",
    defaults: { type: "jagran", state: "Rajasthan" },
    view: {
      mode: "cards",
      imageKey: "coverImage",
      titleKey: "title",
      subtitleKey: "city",
      badgeColors: STATUS_COLORS,
      metaRender: (i) => {
        const phase = eventLifecycle(i);
        const when = i.date ? fmtDate(i.date) + (i.startTime ? ` · ${i.startTime}` : "") : "";
        return when ? `${when}` : phase;
      },
      // Render a derived "upcoming/past" badge based on the date.
      renderBadge: (i) => {
        const phase = eventLifecycle(i);
        return { value: phase, color: STATUS_COLORS[phase] };
      },
      quickToggles: [],
    },
    columns: [
      { key: "title", label: "Title" },
      { key: "city", label: "City" },
      { key: "date", label: "Date", render: (i) => fmtDate(i.date) },
      { key: "_phase", label: "Status", render: (i) => eventLifecycle(i) },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "type", label: "Type", type: "select", options: ["jagran", "concert", "private", "temple", "other"], required: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "startTime", label: "Start Time", type: "time", required: true },
      { name: "venue", label: "Venue", type: "text", required: true },
      { name: "city", label: "City", type: "text", required: true },
      { name: "state", label: "State", type: "text" },
      { name: "address", label: "Address", type: "text", full: true },
      { name: "coverImage", label: "Cover Image (1:1 square)", type: "image", folder: "events", full: true },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "mapEmbed", label: "Map Embed (iframe HTML)", type: "textarea", full: true },
      { name: "isFeatured", label: "Featured", type: "boolean" },
    ],
  },

  // ── Gallery — handled by GalleryBulkUpload + GalleryManage ──
  gallery: {
    resource: "gallery",
    label: "Gallery Photo",
    defaults: { mediaType: "image", isActive: true },
    view: { mode: "cards", imageKey: "image", titleKey: "title", quickToggles: ["isFeatured", "isActive"] },
    columns: [
      { key: "title", label: "Title" },
      { key: "isFeatured", label: "Featured", render: (i) => (i.isFeatured ? "Yes" : "No") },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "image", label: "Photo", type: "image", folder: "gallery", required: true, full: true },
      { name: "isFeatured", label: "Featured", type: "boolean" },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
    ],
  },

  // ── Banners ───────────────────────────────────────────────
  banners: {
    resource: "banners",
    label: "Banner",
    defaults: { placement: "hero", isActive: true },
    view: {
      mode: "cards",
      imageKey: "image",
      titleKey: "title",
      subtitleKey: "subtitle",
      badgeKey: "placement",
      badgeColors: { hero: "#8b5cf6", promo: "#f59e0b", section: "#3b82f6" },
      quickToggles: ["isActive"],
    },
    columns: [
      { key: "title", label: "Title" },
      { key: "placement", label: "Placement" },
      { key: "isActive", label: "Active", render: (i) => (i.isActive ? "Yes" : "No") },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "image", label: "Background Image", type: "image", folder: "banners", full: true },
      { name: "placement", label: "Placement", type: "select", options: ["hero", "promo", "section"], required: true },
      { name: "primaryCtaLabel", label: "Primary CTA Label", type: "text" },
      { name: "primaryCtaUrl", label: "Primary CTA URL", type: "text" },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
    ],
  },

  // ── Sponsors ──────────────────────────────────────────────
  sponsors: {
    resource: "sponsors",
    label: "Sponsor",
    defaults: { tier: "sponsor", isActive: true },
    view: {
      mode: "cards",
      imageKey: "logo",
      titleKey: "name",
      badgeKey: "tier",
      badgeColors: TIER_COLORS,
      quickToggles: ["isActive"],
    },
    columns: [
      { key: "name", label: "Name" },
      { key: "tier", label: "Tier" },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "logo", label: "Logo", type: "image", folder: "sponsors", required: true, full: true },
      { name: "website", label: "Website URL", type: "text", full: true },
      { name: "tier", label: "Tier", type: "select", options: ["partner", "sponsor", "media"] },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
    ],
  },

  // ── Testimonials ──────────────────────────────────────────
  testimonials: {
    resource: "testimonials",
    label: "Testimonial",
    defaults: { rating: 5, isActive: true },
    view: {
      mode: "cards",
      titleKey: "name",
      subtitleKey: "role",
      metaKey: "message",
      quickToggles: ["isActive", "isFeatured"],
    },
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

  // ── Media ─────────────────────────────────────────────────
  media: {
    resource: "media",
    label: "Media Coverage",
    defaults: { type: "news", isActive: true },
    view: {
      mode: "cards",
      imageKey: "image",
      titleKey: "title",
      subtitleKey: "outlet",
      badgeKey: "type",
      badgeColors: TYPE_COLORS,
      quickToggles: ["isActive", "isFeatured"],
    },
    columns: [
      { key: "title", label: "Title" },
      { key: "outlet", label: "Outlet" },
      { key: "type", label: "Type" },
    ],
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "outlet", label: "Outlet / Publication", type: "text" },
      { name: "type", label: "Type", type: "select", options: ["news", "article", "interview", "press", "video"], required: true },
      { name: "excerpt", label: "Excerpt", type: "textarea", full: true },
      { name: "externalUrl", label: "External URL", type: "text", full: true },
      { name: "image", label: "Image", type: "image", folder: "media", full: true },
      { name: "publishedAt", label: "Published Date", type: "date" },
      { name: "isFeatured", label: "Featured", type: "boolean" },
      { name: "isActive", label: "Active", type: "boolean" },
    ],
  },

  // ── Categories ────────────────────────────────────────────
  categories: {
    resource: "categories",
    label: "Category",
    defaults: { type: "bhajan", isActive: true },
    view: { mode: "table" },
    columns: [
      { key: "name", label: "Name" },
      { key: "type", label: "Type" },
      { key: "slug", label: "Slug" },
      { key: "isActive", label: "Active", render: (i) => (i.isActive ? "✓" : "—") },
    ],
    fields: [
      { name: "name", label: "Name", type: "text", required: true },
      { name: "type", label: "Type", type: "select", options: ["bhajan", "blog", "event", "gallery", "general"], required: true },
      { name: "description", label: "Description", type: "textarea", full: true },
      { name: "order", label: "Order", type: "number" },
      { name: "isActive", label: "Active", type: "boolean" },
    ],
  },

  // ── Inquiries ─────────────────────────────────────────────
  inquiries: {
    resource: "contact",
    label: "Inquiry",
    defaults: {},
    searchable: true,
    noCreate: true,   // inquiries come from the contact form — no manual create
    view: {
      mode: "cards",
      titleKey: "name",
      subtitleKey: "phone",
      bodyKey: "message",
      badgeKey: "status",
      extraBadgeKey: "type",
      badgeColors: { ...STATUS_COLORS, ...TYPE_COLORS, booking: "#f59e0b", general: "#3b82f6", media: "#8b5cf6" },
      metaRender: (i) => {
        const bits = [];
        if (i.city) bits.push(i.city);
        if (i.createdAt) bits.push(fmtDateTime(i.createdAt));
        return bits.join(" · ");
      },
    },
    columns: [],
    fields: [
      { name: "status", label: "Status", type: "select", options: ["new", "contacted", "closed"], full: true },
    ],
  },
};

export default resourceConfigs;
