import "server-only";
import { cache } from "react";
import { connectDB } from "@/lib/db";
import { serialize } from "@/lib/serialize";
import Settings from "@/models/Settings";
import Banner from "@/models/Banner";
import Bhajan from "@/models/Bhajan";
import Blog from "@/models/Blog";
import Event from "@/models/Event";
import Gallery from "@/models/Gallery";
import Testimonial from "@/models/Testimonial";
import Quote from "@/models/Quote";
import Sponsor from "@/models/Sponsor";
import Category from "@/models/Category";
import MediaCoverage from "@/models/MediaCoverage";

/**
 * Server-side data access used by React Server Components.
 * Every function is defensive: if the DB is unreachable it returns a safe
 * empty value so the site still renders (and the build never hard-fails).
 */
async function safe(fn, fallback) {
  try {
    await connectDB();
    return serialize(await fn());
  } catch (err) {
    console.error("[content service]", err.message);
    return fallback;
  }
}

// Wrapped with React cache() so multiple RSC calls within one request
// (layout + generateMetadata + page component) share a single DB fetch.
export const getSettings = cache(function getSettings() {
  return safe(async () => {
    const s = await Settings.findOne({ key: "global" }).lean();
    return s || {};
  }, {});
});

export function getHeroBanners() {
  return safe(
    () =>
      Banner.find({ placement: "hero", isActive: true })
        .sort("order")
        .lean(),
    []
  );
}

export function getFeaturedBhajans(limit = 6) {
  return safe(
    () =>
      Bhajan.find({ status: "published", isFeatured: true })
        .sort("-createdAt")
        .limit(limit)
        .populate("category", "name slug")
        .lean(),
    []
  );
}

export function getLatestBhajans(limit = 8) {
  return safe(
    () =>
      Bhajan.find({ status: "published" })
        .sort("-createdAt")
        .limit(limit)
        .lean(),
    []
  );
}

export function getTrendingBhajans(limit = 6) {
  return safe(
    () =>
      Bhajan.find({ status: "published", isTrending: true })
        .sort("-views")
        .limit(limit)
        .lean(),
    []
  );
}

export function getUpcomingEvents(limit = 4) {
  return safe(
    () =>
      Event.find({ date: { $gte: new Date() } })
        .sort("date")
        .limit(limit)
        .lean(),
    []
  );
}

export function getGalleryPreview(limit = 8) {
  return safe(
    () => Gallery.find({ isActive: true }).sort("order -createdAt").limit(limit).lean(),
    []
  );
}

export function getTestimonials(limit = 8) {
  return safe(
    () => Testimonial.find({ isActive: true }).sort("order").limit(limit).lean(),
    []
  );
}

export function getQuotes(limit = 8) {
  return safe(
    () => Quote.find({ isActive: true }).sort("order").limit(limit).lean(),
    []
  );
}

export function getSponsors() {
  return safe(
    () => Sponsor.find({ isActive: true }).sort("order").lean(),
    []
  );
}

export function getLatestBlogs(limit = 3) {
  return safe(
    () =>
      Blog.find({ status: "published" })
        .sort("-publishedAt -createdAt")
        .limit(limit)
        .populate("category", "name slug")
        .lean(),
    []
  );
}

export function getMediaCoverage(limit = 6) {
  return safe(
    () =>
      MediaCoverage.find({ isActive: true })
        .sort("-publishedAt -createdAt")
        .limit(limit)
        .lean(),
    []
  );
}

export function getCategories(type) {
  const filter = { isActive: true };
  if (type) filter.type = type;
  return safe(() => Category.find(filter).sort("order name").lean(), []);
}

// ─── Single-record + filtered listings for inner pages ──────

export function getBhajanBySlug(slug) {
  return safe(async () => {
    const doc = await Bhajan.findOneAndUpdate(
      { slug, status: "published" },
      { $inc: { views: 1 } },
      { returnDocument: "after" }
    )
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .lean();
    return doc;
  }, null);
}

export function getRelatedBhajans(categoryId, excludeId, limit = 4) {
  return safe(
    () =>
      Bhajan.find({
        status: "published",
        _id: { $ne: excludeId },
        ...(categoryId ? { category: categoryId } : {}),
      })
        .sort("-views")
        .limit(limit)
        .lean(),
    []
  );
}

export function getBlogBySlug(slug) {
  return safe(async () => {
    const doc = await Blog.findOneAndUpdate(
      { slug, status: "published" },
      { $inc: { views: 1 } },
      { returnDocument: "after" }
    )
      .populate("category", "name slug")
      .populate("tags", "name slug")
      .lean();
    return doc;
  }, null);
}

export function getEventBySlug(slug) {
  return safe(() => Event.findOne({ slug }).lean(), null);
}

export function getMediaBySlug(slug) {
  return safe(() => MediaCoverage.findOne({ slug, isActive: true }).lean(), null);
}

export function listBhajans({ q, category, page = 1, limit = 12 } = {}) {
  return safe(async () => {
    const filter = { status: "published" };
    if (q) filter.$text = { $search: q };
    if (category) {
      const cat = await Category.findOne({ slug: category }).lean();
      if (cat) filter.category = cat._id;
    }
    const [items, total] = await Promise.all([
      Bhajan.find(filter)
        .sort("-createdAt")
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Bhajan.countDocuments(filter),
    ]);
    return { items, total };
  }, { items: [], total: 0 });
}

export function listEvents(phase) {
  // `phase` is "upcoming" | "past" | undefined — derived from the date field
  // so admins don't need to flip a status flag manually.
  return safe(
    () => {
      const now = new Date();
      const filter =
        phase === "upcoming" ? { date: { $gte: now } }
        : phase === "past" ? { date: { $lt: now } }
        : {};
      return Event.find(filter)
        .sort(phase === "past" ? "-date" : "date")
        .lean();
    },
    []
  );
}

export function listBlogs({ q, category, page = 1, limit = 9 } = {}) {
  return safe(async () => {
    const filter = { status: "published" };
    if (q) filter.$text = { $search: q };
    if (category) {
      const cat = await Category.findOne({ slug: category }).lean();
      if (cat) filter.category = cat._id;
    }
    const [items, total] = await Promise.all([
      Blog.find(filter)
        .sort("-publishedAt -createdAt")
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("category", "name slug")
        .lean(),
      Blog.countDocuments(filter),
    ]);
    return { items, total };
  }, { items: [], total: 0 });
}
