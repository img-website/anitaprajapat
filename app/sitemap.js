import { siteConfig } from "@/lib/siteConfig";
import { connectDB } from "@/lib/db";
import { youtubeThumb } from "@/utils/helpers";
import Event from "@/models/Event";
import Bhajan from "@/models/Bhajan";
import Gallery from "@/models/Gallery";
import MediaCoverage from "@/models/MediaCoverage";

export const dynamic = "force-dynamic";

/** Keep only absolute http(s) URLs — Google rejects relative image entries. */
const httpsOnly = (urls) =>
  urls.filter((u) => typeof u === "string" && /^https?:\/\//.test(u));

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
    const [events, bhajans, mediaItems, galleryItems, latestEvent, latestBhajan, latestGallery, latestMedia] =
      await Promise.all([
        Event.find().select("slug updatedAt coverImage").lean(),
        Bhajan.find({ status: "published" }).select("slug updatedAt thumbnail youtubeUrl").lean(),
        MediaCoverage.find({ isActive: true }).select("slug updatedAt image").lean(),
        Gallery.find({ isActive: true, mediaType: "image" }).select("image videoUrl").lean(),
        Event.findOne().sort("-updatedAt").select("updatedAt").lean(),
        Bhajan.findOne({ status: "published" }).sort("-updatedAt").select("updatedAt").lean(),
        Gallery.findOne({ isActive: true }).sort("-updatedAt").select("updatedAt").lean(),
        MediaCoverage.findOne({ isActive: true }).sort("-updatedAt").select("updatedAt").lean(),
      ]);
    dynamicRoutes = events.map((e) => ({
      url: `${base}/events/${e.slug}`,
      lastModified: e.updatedAt,
      changeFrequency: "weekly",
      priority: 0.6,
      images: httpsOnly([e.coverImage?.url]),
    }));
    dynamicRoutes.push(
      ...bhajans.map((b) => ({
        url: `${base}/bhajans/${b.slug}`,
        lastModified: b.updatedAt,
        changeFrequency: "weekly",
        priority: 0.6,
        images: httpsOnly([b.thumbnail?.url || youtubeThumb(b.youtubeUrl)]),
      })),
      ...mediaItems.map((m) => ({
        url: `${base}/media/${m.slug}`,
        lastModified: m.updatedAt,
        changeFrequency: "monthly",
        priority: 0.55,
        images: httpsOnly([m.image?.url]),
      }))
    );

    // Keep listing pages fresh using latest content update timestamps.
    const routeLastModified = {
      "/events": latestEvent?.updatedAt,
      "/bhajans": latestBhajan?.updatedAt,
      "/gallery": latestGallery?.updatedAt,
      "/media": latestMedia?.updatedAt,
    };
    // Surface gallery photos on the /gallery entry for Google Images.
    const galleryImages = httpsOnly(
      galleryItems.map((g) => g.image?.url || youtubeThumb(g.videoUrl))
    ).slice(0, 1000);
    for (const route of staticRoutes) {
      const pathname = route.url.replace(base, "") || "/";
      const lm = routeLastModified[pathname];
      if (lm) route.lastModified = lm;
      if (pathname === "/gallery" && galleryImages.length) {
        route.images = galleryImages;
      }
    }
  } catch (e) {
    console.error("[sitemap]", e.message);
  }

  return [...staticRoutes, ...dynamicRoutes];
}
