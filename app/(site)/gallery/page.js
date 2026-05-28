import { buildMetadata, breadcrumbSchema, seoDefaultsFromSettings } from "@/lib/seo";
import { getGalleryPreview, getSettings } from "@/services/content";
import PageHeader from "@/components/ui/PageHeader";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import JsonLd from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSettings();
  return buildMetadata({
    title: "Gallery — Photos, Reels & Stage Moments | Anita Prajapat",
    description:
      "Photos, videos, reels and live stage moments of Rajasthani devotional singer Anita Prajapat.",
    path: "/gallery",
    defaults: seoDefaultsFromSettings(settings),
  });
}

export default async function GalleryPage() {
  const items = await getGalleryPreview(60);
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Gallery", href: "/gallery" }])} />
      <PageHeader
        eyebrow="Moments"
        title="Gallery"
        subtitle="Stage performances, reels and devotional moments."
        crumbs={[{ name: "Gallery" }]}
      />
      <section className="section">
        <div className="container">
          <GalleryGrid items={items} />
        </div>
      </section>
    </>
  );
}
