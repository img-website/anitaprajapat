import { buildMetadata, musicGroupSchema, breadcrumbSchema, seoDefaultsFromSettings } from "@/lib/seo";
import { getYouTubeData } from "@/services/youtube";
import { getSettings } from "@/services/content";
import { siteConfig } from "@/lib/siteConfig";
import { youtubeSubscribeUrl } from "@/utils/helpers";
import { YoutubeIcon } from "@/components/ui/BrandIcons";
import PageHeader from "@/components/ui/PageHeader";
import VideoShowcase from "@/components/home/VideoShowcase";
import JsonLd from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSettings();
  return buildMetadata({
    title: "Sanwariya Seth, Khatu Shyam, Balaji & Mataji Bhajans",
    description:
      "Watch Anita Prajapat ke bhajan — Sanwariya Seth (सांवरिया सेठ भजन), Khatu Shyam, Balaji, Mataji & Satguru. Popular, latest & playlists, live from YouTube every week.",
    path: "/bhajans",
    defaults: seoDefaultsFromSettings(settings),
  });
}

export default async function BhajansPage() {
  const [videos, settings] = await Promise.all([getYouTubeData(), getSettings()]);
  const subscribe = youtubeSubscribeUrl(settings?.social?.youtube || siteConfig.social.youtube);

  return (
    <>
      <JsonLd data={[musicGroupSchema(), breadcrumbSchema([{ name: "Bhajans", href: "/bhajans" }])]} />
      <PageHeader
        eyebrow="Devotional Music"
        title="Bhajans"
        subtitle="Sanwariya Seth, Khatu Shyam & Mataji bhajans — popular, latest & curated playlists, streaming live from the official YouTube channel."
        crumbs={[{ name: "Bhajans" }]}
      />
      <VideoShowcase
        popular={videos.popular}
        latest={videos.latest}
        playlists={videos.playlists}
        hideHeading
      />
      <section className="section" style={{ textAlign: "center" }}>
        <div className="container-narrow">
          <h2 style={{ marginBottom: "0.5rem" }}>Never miss a new bhajan</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            Subscribe to Anita Prajapat on YouTube for fresh Sanwariya Seth &amp; Khatu Shyam
            bhajans and live Jagran videos every week.
          </p>
          <a href={subscribe} target="_blank" rel="noopener noreferrer" title="Subscribe to Anita Prajapat on YouTube for Sanwariya Seth & Khatu Shyam bhajans" className="btn btn-primary btn-lg shine">
            <YoutubeIcon size={20} /> Subscribe on YouTube
          </a>
        </div>
      </section>
    </>
  );
}
