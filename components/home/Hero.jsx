import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { youtubeSubscribeUrl } from "@/utils/helpers";
import { ArrowRight, Star, Mic2, Sparkles, PlayCircle, MessageCircle } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import styles from "./Hero.module.scss";

// Server component: the hero is the LCP region, so its content is rendered as
// plain server HTML (no "use client") and the entrance is pure CSS. Nothing
// here waits on JS/hydration to become visible — only the small <AnimatedCounter>
// number islands hydrate. (Previously this was a client component whose H1/lead/
// CTA started at opacity:0 behind Framer Motion, hiding the LCP text until the
// JS bundle loaded.)
export default function Hero({ banner, settings = {} }) {
  const title = banner?.title || siteConfig.name;
  const subtitle = banner?.subtitle || siteConfig.tagline;
  const description =
    banner?.description ||
    "Sanwariya Seth · Khatu Shyam · Balaji · Mataji · Satguru bhajan & live Jagran — devotion brought to life on stage across India.";
  const img = banner?.image?.url || "/images/hero.jpg";
  const youtube = settings.social?.youtube || siteConfig.social.youtube;
  const subscribe = youtubeSubscribeUrl(youtube);
  const whatsapp = settings.whatsapp || siteConfig.whatsapp;

  return (
    <section className={`${styles.hero} section-aurora`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <span className={`chip ${styles.reveal} ${styles.d1}`}>
            <span className={styles.dot} /> {subtitle} · {siteConfig.city}
          </span>

          <h1 className={`${styles.title} ${styles.reveal} ${styles.d2}`}>
            <span>Voice of&nbsp;</span>
            <span className="gold-text">Devotion</span>
            <span className={styles.name}> {title}</span>
          </h1>

          <p className={`${styles.lead} ${styles.reveal} ${styles.d3}`}>{description}</p>

          <div className={`${styles.cta} ${styles.reveal} ${styles.d4}`}>
            <a
              href={subscribe}
              target="_blank"
              rel="noopener noreferrer"
              title="Subscribe to Anita Prajapat on YouTube for Sanwariya Seth & Khatu Shyam bhajans"
              className="btn btn-primary btn-lg shine"
            >
              <PlayCircle size={20} /> Subscribe on YouTube
            </a>
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Book Anita Prajapat for Jagran on WhatsApp"
              className="btn btn-outline btn-lg"
            >
              <MessageCircle size={18} /> Book for Jagran <ArrowRight size={18} />
            </a>
          </div>

          <div className={`${styles.stats} ${styles.reveal} ${styles.d5}`}>
            <div>
              <strong>
                <AnimatedCounter
                  className={styles.statValue}
                  value={settings.counters?.stageShows || siteConfig.stageShows}
                />
              </strong>
              <span className={styles.statLabel}>Stage Shows</span>
            </div>
            <div>
              <strong>
                <AnimatedCounter
                  className={styles.statValue}
                  value={`${new Date().getFullYear() - siteConfig.performingSince}+`}
                />
              </strong>
              <span className={styles.statLabel}>Years</span>
            </div>
            <div>
              <strong>
                <AnimatedCounter className={styles.statValue} value={`${siteConfig.genres.length}+`} />
              </strong>
              <span className={styles.statLabel}>Genres</span>
            </div>
          </div>
        </div>

        <div className={`${styles.visual} ${styles.visualReveal}`}>
          <div className={styles.ring} aria-hidden />
          <div className={styles.blob} aria-hidden />
          <div className={styles.sparkles} aria-hidden>
            {[...Array(7)].map((_, i) => (
              <span key={i} style={{ "--i": i }} />
            ))}
          </div>
          <div className={styles.photo}>
            <Image
              src={img}
              alt={`${siteConfig.name} — Sanwariya Seth & Khatu Shyam Bhajan Singer performing live`}
              title={`${siteConfig.name} — ${siteConfig.tagline}`}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width:36rem) 66vw, (max-width:56.25rem) 60vw, 27rem"
            />
          </div>

          <div className={`${styles.badge} ${styles.badgeTop}`}>
            <Mic2 size={14} /> Live Jagran
          </div>
          <div className={`${styles.badge} ${styles.badgeBottom}`}>
            <Star size={14} /> {settings.counters?.stageShows || siteConfig.stageShows} shows
          </div>

          {/* Rotating sticker — editorial flourish + one-click subscribe CTA */}
          <a
            href={subscribe}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sticker}
            aria-label="Subscribe on YouTube — new bhajans every week"
            title="Subscribe to Anita Prajapat on YouTube — new bhajans every week"
          >
            <svg className={styles.stickerRing} viewBox="0 0 100 100" aria-hidden>
              <defs>
                <path id="heroStickerPath" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
              </defs>
              <text>
                <textPath href="#heroStickerPath" startOffset="0">
                  NEW BHAJANS WEEKLY · SUBSCRIBE · NEW BHAJANS WEEKLY · SUBSCRIBE ·
                </textPath>
              </text>
            </svg>
            <span className={styles.stickerCore}>
              <PlayCircle size={22} aria-hidden />
            </span>
          </a>
        </div>
      </div>

      {/* genre marquee */}
      <div className={styles.marquee} aria-hidden>
        <div className={styles.track}>
          {[...siteConfig.genres, ...siteConfig.genres].map((g, i) => (
            <span key={i}>
              {g} <em><Sparkles size={11} aria-hidden /></em>
            </span>
          ))}
        </div>
      </div>

      <a href="#explore" className={styles.scrollCue} aria-label="Scroll to explore">
        <span className={styles.mouse}><span /></span>
        <span className={styles.cueText}>Scroll</span>
      </a>
    </section>
  );
}
