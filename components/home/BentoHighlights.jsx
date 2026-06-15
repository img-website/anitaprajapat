"use client";

import Image from "next/image";
import { Sparkles, Mic2, ArrowRight, Play, Clock } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { youtubeSubscribeUrl } from "@/utils/helpers";
import { mergeBento } from "@/lib/bentoDefaults";
import { YoutubeIcon, WhatsappIcon } from "@/components/ui/BrandIcons";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import styles from "./BentoHighlights.module.scss";

export default function BentoHighlights({ settings = {}, featuredVideo = null }) {
  const bento = mergeBento(settings);
  const whatsapp = settings.whatsapp || siteConfig.whatsapp;
  const youtube = settings.social?.youtube || siteConfig.social.youtube;
  const subscribe = youtubeSubscribeUrl(youtube);
  const shows = settings.counters?.stageShows || siteConfig.stageShows;

  const watchUrl = featuredVideo?.url;
  const poster =
    featuredVideo?.thumbnail || "/images/g2.jpg";
  const title =
    settings.featuredVideoTitle?.trim() ||
    featuredVideo?.title ||
    "Bhakti that fills the stage";
  const duration = featuredVideo?.duration;

  return (
    <section id="explore" className="section">
      <div className="container">
        <StaggerGroup className={styles.bento}>
          {/* Featured YouTube video — metadata from API, link from admin */}
          <StaggerItem className={`${styles.tile} ${styles.feature}`}>
            {watchUrl ? (
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.featureLink}
                aria-label={`Watch ${title} on YouTube`}
                title={`Watch ${title} on Anita Prajapat's YouTube channel`}
              >
                <Image src={poster} alt={`${title} — Anita Prajapat bhajan video`} title={title} fill sizes="50vw" />
                {duration && (
                  <span className={styles.duration}>
                    <Clock size={12} /> {duration}
                  </span>
                )}
                <span className={styles.playBtn} aria-hidden>
                  <span className={styles.wave} />
                  <span className={styles.wave} />
                  <span className={styles.wave} />
                  <span className={styles.playCore}>
                    <Play size={18} fill="currentColor" />
                  </span>
                </span>
                <div className={styles.featureText}>
                  <span className="chip">
                    <Sparkles size={15} /> {bento.featureChip}
                  </span>
                  <p className={styles.featureTitle}>{title}</p>
                </div>
              </a>
            ) : (
              <>
                <Image src={poster} alt={`${title} — Anita Prajapat bhajan`} title={title} fill sizes="50vw" />
                <div className={styles.featureText}>
                  <span className="chip">
                    <Sparkles size={15} /> {bento.featureChip}
                  </span>
                  <p className={styles.featureTitle}>{title}</p>
                </div>
              </>
            )}
          </StaggerItem>

          <StaggerItem className={`${styles.tile} ${styles.stat}`}>
            <strong className="grad-head">{shows}</strong>
            <span>{bento.statLabel}</span>
          </StaggerItem>

          <StaggerItem
            as="a"
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Book Anita Prajapat for your Jagran on WhatsApp"
            className={`${styles.tile} ${styles.book}`}
          >
            <span className={styles.bookIcon}>
              <Mic2 size={26} />
            </span>
            <p className={styles.bookTitle}>{bento.bookTitle}</p>
            <span className={styles.arrow}>
              <WhatsappIcon size={16} /> {bento.bookCta} <ArrowRight size={16} />
            </span>
          </StaggerItem>

          <StaggerItem className={`${styles.tile} ${styles.genres}`}>
            <span className="chip">{bento.repertoireLabel}</span>
            <ul>
              {bento.repertoireItems.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem
            as="a"
            href={subscribe}
            target="_blank"
            rel="noopener noreferrer"
            title="Subscribe to Anita Prajapat on YouTube for Sanwariya Seth & Khatu Shyam bhajans"
            className={`${styles.tile} ${styles.youtube}`}
          >
            <span className={styles.ytIcon}>
              <YoutubeIcon size={22} />
            </span>
            <div>
              <strong>{bento.youtubeTitle}</strong>
              <span>{bento.youtubeSubtitle}</span>
            </div>
          </StaggerItem>

          <StaggerItem className={`${styles.tile} ${styles.portrait}`}>
            <Image
              src={bento.portraitImage || "/images/g4.jpg"}
              alt={`${siteConfig.name} — devotional bhajan singer from ${siteConfig.city}`}
              title={`${siteConfig.name} — ${siteConfig.tagline}`}
              fill
              sizes="25vw"
            />
            <span className={styles.portraitTag}>{bento.portraitTag}</span>
          </StaggerItem>

          <StaggerItem
            as="a"
            href={bento.storyHref || "/about"}
            title="Read the story of Anita Prajapat — Rajasthani devotional bhajan singer"
            className={`${styles.tile} ${styles.story}`}
          >
            <span className="chip">
              <Sparkles size={14} /> {bento.storyChip}
            </span>
            <p className={styles.storyTitle}>{bento.storyTitle}</p>
            <p>{bento.storyDescription}</p>
            <span className={styles.storyLink}>
              {bento.storyLinkLabel} <ArrowRight size={15} />
            </span>
          </StaggerItem>
        </StaggerGroup>
      </div>
    </section>
  );
}
