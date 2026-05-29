import { buildMetadata, breadcrumbSchema, seoDefaultsFromSettings } from "@/lib/seo";
import { getSettings, listEvents } from "@/services/content";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import EventCard from "@/components/cards/EventCard";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import { siteConfig } from "@/lib/siteConfig";
import s from "@/components/home/home.module.scss";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSettings();
  return buildMetadata({
    title: "Events & Live Jagran — Anita Prajapat",
    description:
      "Upcoming and past live Jagran events & devotional concerts by Anita Prajapat across Rajasthan and India. Book her for your event.",
    path: "/events",
    defaults: seoDefaultsFromSettings(settings),
  });
}

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    listEvents("upcoming"),
    listEvents("past"),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Events", href: "/events" }])} />
      <PageHeader
        eyebrow="Live Jagran"
        title="Events"
        subtitle="Experience devotion live — upcoming Jagrans and past performances."
        crumbs={[{ name: "Events" }]}
      />

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Don't Miss" title="Upcoming Events" align="left" />
          {upcoming.length ? (
            <StaggerGroup className={s.cardGrid}>
              {upcoming.map((e) => (
                <StaggerItem key={e._id}>
                  <EventCard event={e} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          ) : (
            <p style={{ color: "var(--text-muted)" }}>
              No upcoming events announced yet. To book Anita Prajapat,{" "}
              <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer" title="Book Anita Prajapat for Jagran on WhatsApp" style={{ color: "var(--gold)" }}>
                message on WhatsApp
              </a>
              .
            </p>
          )}
        </div>
      </section>

      {past.length > 0 && (
        <section className={`section ${s.altBg}`}>
          <div className="container">
            <SectionHeading eyebrow="Memories" title="Past Performances" align="left" />
            <StaggerGroup className={s.cardGrid}>
              {past.map((e) => (
                <StaggerItem key={e._id}>
                  <EventCard event={e} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </section>
      )}
    </>
  );
}
