import { notFound } from "next/navigation";
import Link from "next/link";
import { getBhajanBySlug, getRelatedBhajans, getSettings } from "@/services/content";
import {
  buildMetadata,
  breadcrumbSchema,
  musicGroupSchema,
  musicRecordingSchema,
  seoDefaultsFromSettings,
  videoObjectSchema,
} from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import { youtubeSubscribeUrl, youtubeWatchUrl } from "@/utils/helpers";
import PageHeader from "@/components/ui/PageHeader";
import JsonLd from "@/components/seo/JsonLd";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";
import BhajanCard from "@/components/cards/BhajanCard";
import ShareButtons from "@/components/ui/ShareButtons";
import { YoutubeIcon } from "@/components/ui/BrandIcons";
import SectionHeading from "@/components/ui/SectionHeading";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import s from "@/components/home/home.module.scss";

// ISR: revalidate every 5 min; view count increments on server so still works.
export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [settings, bhajan] = await Promise.all([getSettings(), getBhajanBySlug(slug)]);
  const defaults = seoDefaultsFromSettings(settings);
  if (!bhajan) return buildMetadata({ title: "Bhajan not found", path: `/bhajans/${slug}`, noindex: true, defaults });
  // Keyword-rich title targeting "<bhajan> lyrics" + "<bhajan> video" intent.
  const hasLyrics = !!bhajan.lyrics;
  const autoTitle = `${bhajan.title} Bhajan${hasLyrics ? " — Lyrics & Video" : " — Video"}`;
  return buildMetadata({
    title: bhajan.seo?.metaTitle || autoTitle,
    description:
      bhajan.seo?.metaDescription ||
      bhajan.description ||
      `${bhajan.title} — ${bhajan.genre || "devotional"} bhajan${hasLyrics ? " with full lyrics" : ""} sung by ${siteConfig.name}. Watch the video and subscribe for new bhajans every week.`,
    path: `/bhajans/${bhajan.slug}`,
    image: bhajan.thumbnail?.url,
    keywords: [
      bhajan.title,
      `${bhajan.title} lyrics`,
      `${bhajan.title} bhajan`,
      `${bhajan.title} ${siteConfig.name}`,
      bhajan.genre,
    ].filter(Boolean),
    noindex: bhajan.seo?.noindex || false,
    defaults,
  });
}

export default async function BhajanDetailPage({ params }) {
  const { slug } = await params;
  const bhajan = await getBhajanBySlug(slug);
  if (!bhajan) notFound();

  const related = await getRelatedBhajans(bhajan.category?._id, bhajan._id, 4);
  const subscribe = youtubeSubscribeUrl(siteConfig.social.youtube);
  const watch = youtubeWatchUrl(bhajan.youtubeUrl);

  return (
    <>
      <JsonLd
        data={[
          musicGroupSchema(),
          musicRecordingSchema(bhajan),
          videoObjectSchema({
            name: bhajan.title,
            description: bhajan.description,
            thumbnailUrl: bhajan.thumbnail?.url,
            uploadDate: bhajan.createdAt,
            embedUrl: bhajan.youtubeUrl,
            views: bhajan.views,
          }),
          breadcrumbSchema([
            { name: "Bhajans", href: "/bhajans" },
            { name: bhajan.title, href: `/bhajans/${bhajan.slug}` },
          ]),
        ]}
      />
      <PageHeader
        eyebrow={bhajan.genre || "Bhajan"}
        title={bhajan.title}
        subtitle={bhajan.description || `Watch this devotional bhajan by ${siteConfig.name}.`}
        crumbs={[{ name: "Bhajans", href: "/bhajans" }, { name: bhajan.title }]}
      />

      <section className="section">
        <div className="container-narrow">
          <YouTubeEmbed url={bhajan.youtubeUrl} title={bhajan.title} />

          {/* Intro / context — helps the page rank for the song name + artist. */}
          <p style={{ marginTop: "1.25rem", color: "var(--text)" }}>
            <strong>{bhajan.title}</strong> is a {bhajan.genre ? `${bhajan.genre.toLowerCase()} ` : ""}
            bhajan sung by {siteConfig.name}, a {siteConfig.categoryInline} from {siteConfig.city}.
            Watch the full video above{bhajan.lyrics ? " and read the complete lyrics below" : ""}, then
            subscribe on YouTube for new Sanwariya Seth &amp; Khatu Shyam bhajans every week.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.25rem" }}>
            <a
              href={subscribe}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary shine"
              title={`Subscribe to ${siteConfig.name} on YouTube for new bhajans`}
            >
              <YoutubeIcon size={18} /> Subscribe on YouTube
            </a>
            {watch && (
              <a href={watch} target="_blank" rel="noopener noreferrer" className="btn btn-outline" title={`Watch ${bhajan.title} on YouTube`}>
                Watch on YouTube
              </a>
            )}
          </div>

          {bhajan.lyrics && (
            <article className="card" style={{ padding: "1.5rem", marginTop: "1.5rem" }}>
              <h2 style={{ marginBottom: "0.75rem" }}>{bhajan.title} — Lyrics</h2>
              <p style={{ whiteSpace: "pre-line", color: "var(--text)", lineHeight: 1.9 }}>{bhajan.lyrics}</p>
            </article>
          )}

          <div style={{ marginTop: "1.5rem" }}>
            <ShareButtons path={`/bhajans/${bhajan.slug}`} title={`${bhajan.title} — bhajan by ${siteConfig.name}`} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className={`section ${s.altBg}`}>
          <div className="container">
            <SectionHeading eyebrow="Keep Listening" title="More Bhajans" />
            <StaggerGroup className={s.cardGrid}>
              {related.map((r) => (
                <StaggerItem key={r._id}>
                  <BhajanCard bhajan={r} />
                </StaggerItem>
              ))}
            </StaggerGroup>
            <div className={s.viewAll}>
              <Link href="/bhajans" className="btn btn-outline" title="All bhajans by Anita Prajapat">
                All bhajans
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
