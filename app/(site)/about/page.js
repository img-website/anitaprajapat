import Image from "next/image";
import { Sparkles } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { buildMetadata, personSchema, breadcrumbSchema, seoDefaultsFromSettings } from "@/lib/seo";
import { getSettings, getGalleryPreview } from "@/services/content";
import PageHeader from "@/components/ui/PageHeader";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import JsonLd from "@/components/seo/JsonLd";
import styles from "./about.module.scss";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSettings();
  return buildMetadata({
    title: "About Anita Prajapat — Sanwariya Seth & Khatu Shyam Bhajan Singer",
    description:
      "The story of Anita Prajapat, a leading Rajasthani devotional singer from Jaipur — her journey, achievements, and spiritual inspiration behind Sanwariya Seth, Khatu Shyam & Mataji bhajans.",
    path: "/about",
    defaults: seoDefaultsFromSettings(settings),
  });
}

const timeline = [
  { year: "2016", title: "The Beginning", text: "Started singing devotional bhajans at local temples and jagrans in Rajasthan." },
  { year: "2018", title: "Rising Voice", text: "Gained recognition across Marwar for soulful Sanwariya Seth, Khatu Shyam & Mataji renditions." },
  { year: "2021", title: "Digital Devotion", text: "Launched the official YouTube channel, reaching devotees worldwide." },
  { year: "2024", title: "Stage Sensation", text: "Crossed thousands of live jagran performances across India." },
];

const achievements = [
  "Sanwariya Seth Bhajan Specialist",
  "Khatu Shyam Bhajan Specialist",
  "Mataji & Marwadi Bhajan Artist",
  "10000+ Live Stage Shows",
  "Growing YouTube & Instagram Devotee Base",
  "Trusted Live Jagran Performer",
  "Spiritual Music Ambassador of Rajasthan",
];

export default async function AboutPage() {
  const [settings, gallery] = await Promise.all([
    getSettings(),
    getGalleryPreview(8),
  ]);

  return (
    <>
      <JsonLd
        data={[
          personSchema(),
          breadcrumbSchema([{ name: "About", href: "/about" }]),
        ]}
      />
      <PageHeader
        eyebrow="About the Artist"
        title="Anita Prajapat"
        subtitle={`${siteConfig.category} · ${siteConfig.city} · Performing since ${siteConfig.performingSince}`}
        crumbs={[{ name: "About" }]}
      />

      <section className="section">
        <div className="container">
          <div className={styles.bio}>
            <Reveal variant="right" className={styles.portrait}>
              <Image src={settings.artistImage || settings.logo || "/images/artist.jpg"} alt={`${siteConfig.name} — Sanwariya Seth & Khatu Shyam Bhajan Singer from ${siteConfig.city}`} title={`${siteConfig.name} — ${siteConfig.tagline}`} fill sizes="40vw" />
            </Reveal>
            <Reveal variant="left">
              <h2>A Voice Devoted to the Divine</h2>
              <p>
                {siteConfig.name} is a celebrated {siteConfig.category.toLowerCase()} from {siteConfig.city},
                Rajasthan. Since {siteConfig.performingSince}, she has dedicated her voice to the divine —
                performing Sanwariya Seth, Khatu Shyam, Mataji, Marwadi and Rajasthani bhajans that move
                thousands of devotees at live jagrans across the country.
              </p>
              <p>
                Her music blends traditional devotional roots with a cinematic, soul-stirring stage
                presence — making every jagran an unforgettable spiritual experience.
              </p>
              <div className={styles.stats}>
                <div><strong>{settings.counters?.stageShows || siteConfig.stageShows}</strong><span>Stage Shows</span></div>
                <div><strong>{new Date().getFullYear() - siteConfig.performingSince}+</strong><span>Years</span></div>
                <div><strong>6+</strong><span>Genres</span></div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={`section ${styles.altBg}`}>
        <div className="container">
          <SectionHeading eyebrow="Milestones" title="The Journey" />
          <div className={styles.timeline}>
            {timeline.map((t, i) => (
              <Reveal key={t.year} variant="up" delay={i * 0.08} className={styles.tItem}>
                <span className={styles.tYear}>{t.year}</span>
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Recognition" title="Achievements & Experience" />
          <div className={styles.achievements}>
            {achievements.map((a, i) => (
              <Reveal key={a} variant="scale" delay={i * 0.05} className={styles.achv}>
                <Sparkles size={14} aria-hidden style={{ color: "var(--magenta)", flexShrink: 0 }} /> {a}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className={`section ${styles.altBg}`}>
          <div className="container">
            <SectionHeading eyebrow="Gallery" title="Professional Moments" />
            <GalleryGrid items={gallery} />
          </div>
        </section>
      )}
    </>
  );
}
