import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import {
  getSettings,
  getHeroBanners,
  getUpcomingEvents,
  getTestimonials,
  getGalleryPreview,
  getSponsors,
  getMediaCoverage,
} from "@/services/content";
import { getYouTubeVideos, getYouTubeVideoMeta } from "@/services/youtube";
import { ArrowRight, Phone } from "lucide-react";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
import MusicNotes from "@/components/ui/MusicNotes";
import Hero from "@/components/home/Hero";
import BentoHighlights from "@/components/home/BentoHighlights";
import VideoShowcase from "@/components/home/VideoShowcase";
import Counters from "@/components/home/Counters";
import Testimonials from "@/components/home/Testimonials";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal, { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import EventCard from "@/components/cards/EventCard";
import JsonLd from "@/components/seo/JsonLd";
import { personSchema, musicGroupSchema, organizationSchema, websiteSchema } from "@/lib/seo";
import s from "@/components/home/home.module.scss";

// Always render with fresh CMS data.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getSettings();
  const [
    banners,
    events,
    testimonials,
    gallery,
    sponsors,
    media,
    videos,
    featuredVideo,
  ] = await Promise.all([
    getHeroBanners(),
    getUpcomingEvents(3),
    getTestimonials(),
    getGalleryPreview(8),
    getSponsors(),
    getMediaCoverage(3),
    getYouTubeVideos(),
    settings?.featuredVideo ? getYouTubeVideoMeta(settings.featuredVideo) : null,
  ]);

  return (
    <>
      <JsonLd data={[personSchema(), musicGroupSchema(), organizationSchema(), websiteSchema()]} />

      <Hero banner={banners[0]} settings={settings} />

      <BentoHighlights settings={settings} featuredVideo={featuredVideo} />

      {/* All bhajan videos come live from YouTube (popular · latest · playlists) */}
      <VideoShowcase
        popular={videos.popular}
        latest={videos.latest}
        playlists={videos.playlists}
      />

      {/* About teaser */}
      <section className={`section ${s.altBg}`}>
        <div className="container">
          <div className={s.about}>
            <Reveal variant="right" className={s.media}>
              <Image
                src={settings.artistImage || settings.logo || "/images/artist.jpg"}
                alt={siteConfig.name}
                fill
                sizes="(max-width: 48rem) 100vw, 50vw"
              />
              <span className={s.badge2}>
                <strong>{settings.counters?.stageShows || siteConfig.stageShows}</strong>
                <span>Live Performances</span>
              </span>
            </Reveal>
            <Reveal variant="left">
              <span className="eyebrow" style={{ color: "var(--gold)" }}>
                About the Artist
              </span>
              <h2>Voice of Devotion from {siteConfig.city}</h2>
              <p>
                {siteConfig.name} is a celebrated {siteConfig.category.toLowerCase()},
                performing soul-stirring Sanwariya Seth, Khatu Shyam, Mataji and
                Rajasthani bhajans since {siteConfig.performingSince}. Her live Jagran
                shows bring communities together in devotion across India.
              </p>
              <ul>
                <li>Sanwariya Seth & Khatu Shyam Bhajan specialist</li>
                <li>{siteConfig.stageShows} stage shows & live Jagrans</li>
                <li>Growing devotional audience on YouTube & Instagram</li>
              </ul>
              <Link href="/about" className="btn btn-gold">
                Read full story
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Upcoming events */}
      {events.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Live Jagran"
              title="Upcoming Events"
              subtitle="Catch Anita Prajapat live at a Jagran near you."
            />
            <StaggerGroup className={s.cardGrid}>
              {events.map((e) => (
                <StaggerItem key={e._id}>
                  <EventCard event={e} />
                </StaggerItem>
              ))}
            </StaggerGroup>
            <div className={s.viewAll}>
              <Link href="/events" className="btn btn-outline">
                All events <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Social counters */}
      <Counters settings={settings} />

      {/* Gallery preview */}
      {gallery.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Moments" title="Stage & Gallery Highlights" />
            <GalleryGrid items={gallery} />
            <div className={s.viewAll}>
              <Link href="/gallery" className="btn btn-outline">
                View full gallery <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <div className={s.altBg}>
          <Testimonials items={testimonials} />
        </div>
      )}

      {/* Booking CTA */}
      <section className="section">
        <div className="container">
          <Reveal variant="scale" className={s.bookingCta}>
            <MusicNotes count={5} tone="light" />
            <h2>Book Anita Prajapat for Your Jagran</h2>
            <p>
              Invite the divine through music. Reach out to manager{" "}
              {settings.manager || siteConfig.manager} for bookings & availability.
            </p>
            <div className={s.ctaRow}>
              <a
                href={`https://wa.me/${settings.whatsapp || siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass btn-lg"
              >
                <WhatsappIcon size={18} /> WhatsApp Booking
              </a>
              <a href={`tel:${settings.phone || siteConfig.phone}`} className="btn btn-light btn-lg">
                <Phone size={18} /> Call {settings.phone || siteConfig.phone}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Media coverage */}
      {media.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="In the Press" title="Media Coverage" />
            <div className={s.mediaGrid}>
              {media.map((m) => (
                <Reveal key={m._id} variant="up" className={s.mediaItem}>
                  <span className={s.outlet}>{m.outlet || m.type}</span>
                  <h3>{m.title}</h3>
                  {(m.externalUrl || m.embedUrl) && (
                    <a href={m.externalUrl || m.embedUrl} target="_blank" rel="noopener noreferrer">
                      Read coverage →
                    </a>
                  )}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sponsors */}
      {sponsors.length > 0 && (
        <section className={`section ${s.altBg}`}>
          <div className="container">
            <SectionHeading eyebrow="Partners" title="Sponsors & Partners" />
            <div className={s.sponsors}>
              {sponsors.map((sp) =>
                sp.logo?.url ? (
                  <a key={sp._id} href={sp.website || "#"} target="_blank" rel="noopener noreferrer">
                    <Image src={sp.logo.url} alt={sp.name} width={140} height={54} />
                  </a>
                ) : (
                  <span key={sp._id} className="badge">{sp.name}</span>
                )
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
