"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, Mic2, ArrowRight, Play } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { youtubeThumb, youtubeEmbed } from "@/utils/helpers";
import { YoutubeIcon, WhatsappIcon } from "@/components/ui/BrandIcons";
import styles from "./BentoHighlights.module.scss";

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0 },
};

export default function BentoHighlights({ settings = {} }) {
  const whatsapp = settings.whatsapp || siteConfig.whatsapp;
  const youtube = settings.social?.youtube || siteConfig.social.youtube;
  const shows = settings.counters?.stageShows || siteConfig.stageShows;

  const featuredVideo = settings.featuredVideo || "";
  const featuredTitle = settings.featuredVideoTitle || "Bhakti that fills the stage";
  const [playing, setPlaying] = useState(false);
  const poster = youtubeThumb(featuredVideo) || "/images/g2.jpg";
  const embed = youtubeEmbed(featuredVideo);

  return (
    <section id="explore" className="section">
      <div className="container">
        <motion.div
          className={styles.bento}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ show: { transition: { staggerChildren: 0.07 } } }}
        >
          {/* Featured video (admin-managed) */}
          <motion.div className={`${styles.tile} ${styles.feature}`} variants={item}>
            {playing && embed ? (
              <iframe
                className={styles.featureFrame}
                src={`${embed}?autoplay=1&rel=0`}
                title={featuredTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <Image src={poster} alt={featuredTitle} fill sizes="50vw" />
                {embed && (
                  <button
                    className={styles.playBtn}
                    onClick={() => setPlaying(true)}
                    aria-label={`Play ${featuredTitle}`}
                  >
                    <span className={styles.wave} />
                    <span className={styles.wave} />
                    <span className={styles.playCore}><Play size={26} fill="currentColor" /></span>
                  </button>
                )}
                <div className={styles.featureText}>
                  <span className="chip"><Sparkles size={15} /> Live Devotional Experience</span>
                  <p className={styles.featureTitle}>{featuredTitle}</p>
                </div>
              </>
            )}
          </motion.div>

          {/* Shows counter */}
          <motion.div className={`${styles.tile} ${styles.stat}`} variants={item}>
            <strong className="grad-head">{shows}</strong>
            <span>Stage shows & live jagrans</span>
          </motion.div>

          {/* Book CTA */}
          <motion.a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.tile} ${styles.book}`}
            variants={item}
          >
            <span className={styles.bookIcon}><Mic2 size={26} /></span>
            <p className={styles.bookTitle}>Book for your Jagran</p>
            <span className={styles.arrow}><WhatsappIcon size={16} /> Chat on WhatsApp <ArrowRight size={16} /></span>
          </motion.a>

          {/* Genres list */}
          <motion.div className={`${styles.tile} ${styles.genres}`} variants={item}>
            <span className="chip">Repertoire</span>
            <ul>
              {siteConfig.genres.slice(0, 5).map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </motion.div>

          {/* YouTube */}
          <motion.a
            href={youtube}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.tile} ${styles.youtube}`}
            variants={item}
          >
            <span className={styles.ytIcon}><YoutubeIcon size={22} /></span>
            <div>
              <strong>Watch on YouTube</strong>
              <span>New bhajans every week</span>
            </div>
          </motion.a>

          {/* Portrait */}
          <motion.div className={`${styles.tile} ${styles.portrait}`} variants={item}>
            <Image src="/images/g4.jpg" alt={siteConfig.name} fill sizes="25vw" />
            <span className={styles.portraitTag}>{siteConfig.city}</span>
          </motion.div>

          {/* Fill right-side gap */}
          <motion.a href="/about" className={`${styles.tile} ${styles.story}`} variants={item}>
            <span className="chip"><Sparkles size={14} /> Artist Journey</span>
            <p className={styles.storyTitle}>Traditional roots, modern stage presence</p>
            <p>Explore Anita Prajapat’s story, live journey and devotional milestones.</p>
            <span className={styles.storyLink}>Read full story <ArrowRight size={15} /></span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
