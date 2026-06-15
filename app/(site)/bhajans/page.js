import { buildMetadata, musicGroupSchema, breadcrumbSchema, itemListSchema, seoDefaultsFromSettings } from "@/lib/seo";
import { getYouTubeData } from "@/services/youtube";
import { getSettings, getLatestBhajans } from "@/services/content";
import { siteConfig } from "@/lib/siteConfig";
import { youtubeSubscribeUrl } from "@/utils/helpers";
import { YoutubeIcon } from "@/components/ui/BrandIcons";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import VideoShowcase from "@/components/home/VideoShowcase";
import BhajanCard from "@/components/cards/BhajanCard";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import s from "@/components/home/home.module.scss";

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
  const [videos, settings, bhajans] = await Promise.all([
    getYouTubeData(),
    getSettings(),
    getLatestBhajans(24),
  ]);
  const subscribe = youtubeSubscribeUrl(settings?.social?.youtube || siteConfig.social.youtube);

  const listItems = bhajans.map((b) => ({
    name: b.title,
    url: `${siteConfig.url}/bhajans/${b.slug}`,
  }));

  return (
    <>
      <JsonLd
        data={[
          musicGroupSchema(),
          breadcrumbSchema([{ name: "Bhajans", href: "/bhajans" }]),
          ...(listItems.length ? [itemListSchema(listItems, { name: "Bhajans" })] : []),
        ]}
      />
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

      {/* Owned bhajan pages (with lyrics) — indexable, internally linked song pages. */}
      {bhajans.length > 0 && (
        <section className={`section ${s.altBg}`}>
          <div className="container">
            <SectionHeading
              eyebrow="Watch & Read"
              title="Bhajans with Lyrics"
              subtitle="Full video and lyrics for each bhajan — tap any track to read along and share."
            />
            <StaggerGroup className={s.cardGrid}>
              {bhajans.map((b) => (
                <StaggerItem key={b._id}>
                  <BhajanCard bhajan={b} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}

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
