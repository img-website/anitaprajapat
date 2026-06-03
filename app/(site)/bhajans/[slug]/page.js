import { notFound } from "next/navigation";
import { getBhajanBySlug, getSettings } from "@/services/content";
import { buildMetadata, breadcrumbSchema, musicGroupSchema, seoDefaultsFromSettings, videoObjectSchema } from "@/lib/seo";
import PageHeader from "@/components/ui/PageHeader";
import JsonLd from "@/components/seo/JsonLd";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";

// ISR: revalidate every 5 min; view count increments on server so still works.
export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [settings, bhajan] = await Promise.all([getSettings(), getBhajanBySlug(slug)]);
  const defaults = seoDefaultsFromSettings(settings);
  if (!bhajan) return buildMetadata({ title: "Bhajan not found", path: `/bhajans/${slug}`, noindex: true, defaults });
  return buildMetadata({
    title: bhajan.seo?.metaTitle || `${bhajan.title} — Bhajan`,
    description: bhajan.seo?.metaDescription || bhajan.description,
    path: `/bhajans/${bhajan.slug}`,
    image: bhajan.thumbnail?.url,
    defaults,
  });
}

export default async function BhajanDetailPage({ params }) {
  const { slug } = await params;
  const bhajan = await getBhajanBySlug(slug);
  if (!bhajan) notFound();

  return (
    <>
      <JsonLd
        data={[
          musicGroupSchema(),
          videoObjectSchema({
            name: bhajan.title,
            description: bhajan.description,
            thumbnailUrl: bhajan.thumbnail?.url,
            uploadDate: bhajan.createdAt,
            embedUrl: bhajan.youtubeUrl,
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
        subtitle={bhajan.description || "Watch this devotional bhajan by Anita Prajapat."}
        crumbs={[{ name: "Bhajans", href: "/bhajans" }, { name: bhajan.title }]}
      />
      <section className="section">
        <div className="container-narrow">
          <YouTubeEmbed url={bhajan.youtubeUrl} title={bhajan.title} />
          {bhajan.lyrics && (
            <article className="card" style={{ padding: "1.25rem", marginTop: "1rem" }}>
              <h2 style={{ marginBottom: "0.75rem" }}>Lyrics</h2>
              <p style={{ whiteSpace: "pre-line", color: "var(--text)" }}>{bhajan.lyrics}</p>
            </article>
          )}
        </div>
      </section>
    </>
  );
}
