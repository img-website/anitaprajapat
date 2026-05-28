import { siteConfig } from "@/lib/siteConfig";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";
import Bhajan from "@/models/Bhajan";
import Gallery from "@/models/Gallery";
import MediaCoverage from "@/models/MediaCoverage";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const base = siteConfig.url;
  const now = new Date();
  const staticRoutes = [
    "",
    "/about",
    "/bhajans",
    "/events",
    "/gallery",
    "/media",
    "/contact",
  ].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  let dynamicRoutes = [];
  try {
    await connectDB();
    const [events, bhajans, mediaItems, latestEvent, latestBhajan, latestGallery, latestMedia] =
      await Promise.all([
        Event.find().select("slug updatedAt").lean(),
        Bhajan.find({ status: "published" }).select("slug updatedAt").lean(),
        MediaCoverage.find({ isActive: true }).select("slug updatedAt").lean(),
        Event.findOne().sort("-updatedAt").select("updatedAt").lean(),
        Bhajan.findOne({ status: "published" }).sort("-updatedAt").select("updatedAt").lean(),
        Gallery.findOne({ isActive: true }).sort("-updatedAt").select("updatedAt").lean(),
        MediaCoverage.findOne({ isActive: true }).sort("-updatedAt").select("updatedAt").lean(),
      ]);
    dynamicRoutes = events.map((e) => ({
      url: `${base}/events/${e.slug}`,
      lastModified: e.updatedAt,
      priority: 0.6,
    }));
    dynamicRoutes.push(
      ...bhajans.map((b) => ({
        url: `${base}/bhajans/${b.slug}`,
        lastModified: b.updatedAt,
        priority: 0.6,
      })),
      ...mediaItems.map((m) => ({
        url: `${base}/media/${m.slug}`,
        lastModified: m.updatedAt,
        priority: 0.55,
      }))
    );

    // Keep listing pages fresh using latest content update timestamps.
    const routeLastModified = {
      "/events": latestEvent?.updatedAt,
      "/bhajans": latestBhajan?.updatedAt,
      "/gallery": latestGallery?.updatedAt,
      "/media": latestMedia?.updatedAt,
    };
    for (const route of staticRoutes) {
      const pathname = route.url.replace(base, "") || "/";
      const lm = routeLastModified[pathname];
      if (lm) route.lastModified = lm;
    }
  } catch (e) {
    console.error("[sitemap]", e.message);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
