import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { getMediaCoverage } from "@/services/content";
import { formatDate } from "@/utils/helpers";
import PageHeader from "@/components/ui/PageHeader";
import Reveal from "@/components/ui/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import s from "@/components/home/home.module.scss";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Media Coverage & Press — Anita Prajapat",
  description:
    "News, interviews, articles and press coverage featuring Rajasthani devotional singer Anita Prajapat.",
  path: "/media",
});

export default async function MediaPage() {
  const items = await getMediaCoverage(60);
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Media", href: "/media" }])} />
      <PageHeader
        eyebrow="In the Press"
        title="Media Coverage"
        subtitle="News, interviews and articles featuring Anita Prajapat."
        crumbs={[{ name: "Media" }]}
      />
      <section className="section">
        <div className="container">
          {items.length === 0 ? (
            <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
              Press coverage coming soon.
            </p>
          ) : (
            <div className={s.mediaGrid}>
              {items.map((m) => (
                <Reveal key={m._id} variant="up" className={s.mediaItem}>
                  <span className={s.outlet}>{m.outlet || m.type}</span>
                  <h4>{m.title}</h4>
                  {m.excerpt && <p style={{ fontSize: "0.88rem" }}>{m.excerpt}</p>}
                  <small style={{ color: "var(--text-muted)" }}>
                    {formatDate(m.publishedAt || m.createdAt)}
                  </small>
                  {(m.externalUrl || m.embedUrl) && (
                    <a href={m.externalUrl || m.embedUrl} target="_blank" rel="noopener noreferrer">
                      View coverage →
                    </a>
                  )}
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
