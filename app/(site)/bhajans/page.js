import { buildMetadata, musicGroupSchema, breadcrumbSchema, seoDefaultsFromSettings } from "@/lib/seo";
import { getYouTubeData } from "@/services/youtube";
import { getSettings } from "@/services/content";
import PageHeader from "@/components/ui/PageHeader";
import VideoShowcase from "@/components/home/VideoShowcase";
import JsonLd from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSettings();
  return buildMetadata({
    title: "Bhajans — Khatu Shyam, Mataji & Rajasthani Devotional Songs",
    description:
      "Watch Anita Prajapat's devotional bhajans — Khatu Shyam, Mataji, Marwadi & Rajasthani bhajans. Popular, latest and curated playlists, live from YouTube.",
    path: "/bhajans",
    defaults: seoDefaultsFromSettings(settings),
  });
}

export default async function BhajansPage() {
  const videos = await getYouTubeData();

  return (
    <>
      <JsonLd data={[musicGroupSchema(), breadcrumbSchema([{ name: "Bhajans", href: "/bhajans" }])]} />
      <PageHeader
        eyebrow="Devotional Music"
        title="Bhajans"
        subtitle="Popular, latest & curated playlists — streaming live from the official YouTube channel."
        crumbs={[{ name: "Bhajans" }]}
      />
      <VideoShowcase
        popular={videos.popular}
        latest={videos.latest}
        playlists={videos.playlists}
        hideHeading
      />
    </>
  );
}
