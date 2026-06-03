import { notFound } from "next/navigation";
import { getMediaBySlug, getSettings } from "@/services/content";
import { buildMetadata, breadcrumbSchema, newsArticleSchema, seoDefaultsFromSettings } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import PageHeader from "@/components/ui/PageHeader";
import JsonLd from "@/components/seo/JsonLd";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const [settings, item] = await Promise.all([getSettings(), getMediaBySlug(slug)]);
  const defaults = seoDefaultsFromSettings(settings);
  if (!item) return buildMetadata({ title: "Media item not found", path: `/media/${slug}`, noindex: true, defaults });
  return buildMetadata({
    title: item.title,
    description: item.excerpt || "Media coverage featuring Anita Prajapat.",
    path: `/media/${item.slug}`,
    image: item.image?.url,
    defaults,
  });
}

export default async function MediaDetailPage({ params }) {
  const { slug } = await params;
  const item = await getMediaBySlug(slug);
  if (!item) notFound();

  return (
    <>
      <JsonLd
        data={[
          newsArticleSchema({
            title: item.title,
            description: item.excerpt,
            image: item.image?.url,
            datePublished: item.createdAt,
            dateModified: item.updatedAt,
            url: `${siteConfig.url}/media/${item.slug}`,
            outlet: item.outlet,
          }),
          breadcrumbSchema([
            { name: "Media", href: "/media" },
            { name: item.title, href: `/media/${item.slug}` },
          ]),
        ]}
      />
      <PageHeader
        eyebrow={item.outlet || item.type}
        title={item.title}
        subtitle={item.excerpt || "Media coverage and press mention."}
        crumbs={[{ name: "Media", href: "/media" }, { name: item.title }]}
      />
      <section className="section">
        <div className="container-narrow">
          <article className="card" style={{ padding: "1.25rem" }}>
            {item.excerpt && <p style={{ marginBottom: "1rem" }}>{item.excerpt}</p>}
            {item.externalUrl && (
              <a href={item.externalUrl} target="_blank" rel="noopener noreferrer" title={`Read original coverage: ${item.title}`} className="btn btn-outline">
                Read original coverage
              </a>
            )}
            {!item.externalUrl && item.embedUrl && (
              <a href={item.embedUrl} target="_blank" rel="noopener noreferrer" title={`Open coverage: ${item.title}`} className="btn btn-outline">
                Open coverage
              </a>
            )}
          </article>
        </div>
      </section>
    </>
  );
}
