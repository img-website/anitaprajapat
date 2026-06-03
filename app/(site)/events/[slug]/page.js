import { notFound } from "next/navigation";
import Image from "next/image";
import { getEventBySlug, getSettings } from "@/services/content";
import { buildMetadata, eventSchema, breadcrumbSchema, seoDefaultsFromSettings } from "@/lib/seo";
import { formatDate } from "@/utils/helpers";
import { siteConfig } from "@/lib/siteConfig";
import PageHeader from "@/components/ui/PageHeader";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import ShareButtons from "@/components/ui/ShareButtons";
import JsonLd from "@/components/seo/JsonLd";
import styles from "./event.module.scss";

// ISR: revalidate every 2 min for event detail pages.
export const revalidate = 120;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const settings = await getSettings();
  const defaults = seoDefaultsFromSettings(settings);
  const ev = await getEventBySlug(slug);
  if (!ev) return buildMetadata({ title: "Event not found", path: `/events/${slug}`, noindex: true, defaults });
  return buildMetadata({
    title: ev.seo?.metaTitle || `${ev.title} — ${ev.city || ""}`.trim(),
    description: ev.seo?.metaDescription || ev.description,
    path: `/events/${ev.slug}`,
    image: ev.coverImage?.url,
    type: "article",
    defaults,
  });
}

export default async function EventSinglePage({ params }) {
  const { slug } = await params;
  const ev = await getEventBySlug(slug);
  if (!ev) notFound();

  const gallery = (ev.gallery || []).map((g, i) => ({
    _id: `g${i}`,
    mediaType: "image",
    image: g,
    title: ev.title,
  }));

  return (
    <>
      <JsonLd
        data={[
          eventSchema(ev),
          breadcrumbSchema([
            { name: "Events", href: "/events" },
            { name: ev.title, href: `/events/${ev.slug}` },
          ]),
        ]}
      />
      <PageHeader
        eyebrow={ev.type}
        title={ev.title}
        crumbs={[{ name: "Events", href: "/events" }, { name: ev.title }]}
      />

      <section className="section">
        <div className="container">
          <div className={styles.layout}>
            <div className={styles.main}>
              {ev.coverImage?.url && (
                <div className={styles.cover}>
                  <Image src={ev.coverImage.url} alt={ev.coverImage.alt || `${ev.title} — Anita Prajapat live Jagran in ${ev.city || siteConfig.city}`} title={ev.title} fill preload fetchPriority="high" sizes="66vw" />
                </div>
              )}
              {ev.description && <p className={styles.desc}>{ev.description}</p>}
              <ShareButtons path={`/events/${ev.slug}`} title={ev.title} />

              {gallery.length > 0 && (
                <div className={styles.gallery}>
                  <h2>Event Gallery</h2>
                  <GalleryGrid items={gallery} />
                </div>
              )}
            </div>

            <aside className={styles.aside}>
              <div className={styles.infoCard}>
                <h3>Event Details</h3>
                <dl>
                  <div><dt>Date</dt><dd>{formatDate(ev.date, { weekday: "long" })}</dd></div>
                  {ev.startTime && <div><dt>Time</dt><dd>{ev.startTime}</dd></div>}
                  {ev.venue && <div><dt>Venue</dt><dd>{ev.venue}</dd></div>}
                  <div><dt>Location</dt><dd>{[ev.city, ev.state].filter(Boolean).join(", ")}</dd></div>
                  <div><dt>Type</dt><dd style={{ textTransform: "capitalize" }}>{ev.type}</dd></div>
                </dl>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
                    `Inquiry about event: ${ev.title}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Inquire &amp; book Anita Prajapat for ${ev.title}`}
                  className="btn btn-gold"
                  style={{ width: "100%", marginTop: "1rem" }}
                >
                  Inquire / Book
                </a>
              </div>

              {ev.mapEmbed && (
                <div className={styles.map} dangerouslySetInnerHTML={{ __html: ev.mapEmbed }} />
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
