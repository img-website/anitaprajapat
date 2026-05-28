import { siteConfig } from "@/lib/siteConfig";
import { connectDB } from "@/lib/db";
import Event from "@/models/Event";

export const dynamic = "force-dynamic";

export default async function sitemap() {
  const base = siteConfig.url;
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
    lastModified: new Date(),
    changeFrequency: p === "" ? "daily" : "weekly",
    priority: p === "" ? 1 : 0.7,
  }));

  let dynamicRoutes = [];
  try {
    await connectDB();
    const events = await Event.find().select("slug updatedAt").lean();
    dynamicRoutes = events.map((e) => ({
      url: `${base}/events/${e.slug}`,
      lastModified: e.updatedAt,
      priority: 0.6,
    }));
  } catch (e) {
    console.error("[sitemap]", e.message);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
