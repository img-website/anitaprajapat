"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/siteConfig";
import { youtubeSubscribeUrl } from "@/utils/helpers";
import { ArrowRight, Star, Mic2, Sparkles, PlayCircle, MessageCircle } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import styles from "./Hero.module.scss";

export default function Hero({ banner, settings = {} }) {
  const title = banner?.title || siteConfig.name;
  const subtitle = banner?.subtitle || siteConfig.tagline;
  const description =
    banner?.description ||
    "Sanwariya Seth · Khatu Shyam · Mataji bhajan & live Jagran — devotion brought to life on stage across India.";
  const img = banner?.image?.url || "/images/hero.jpg";
  const youtube = settings.social?.youtube || siteConfig.social.youtube;
  const subscribe = youtubeSubscribeUrl(youtube);
  const whatsapp = settings.whatsapp || siteConfig.whatsapp;

  const ease = [0.22, 1, 0.36, 1];

  return (
    <section className={`${styles.hero} section-aurora`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <motion.span
            className="chip"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <span className={styles.dot} /> {subtitle} · {siteConfig.city}
          </motion.span>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
          >
            <span>Voice of&nbsp;</span>
            <span className="gold-text">Devotion</span>
            <span className={styles.name}> {title}</span>
          </motion.h1>

          <motion.p
            className={styles.lead}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease }}
          >
            {description}
          </motion.p>

          <motion.div
            className={styles.cta}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.32, ease }}
          >
            <a href={subscribe} target="_blank" rel="noopener noreferrer" title="Subscribe to Anita Prajapat on YouTube for Sanwariya Seth & Khatu Shyam bhajans" className="btn btn-primary btn-lg shine">
              <PlayCircle size={20} /> Subscribe on YouTube
            </a>
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" title="Book Anita Prajapat for Jagran on WhatsApp" className="btn btn-outline btn-lg">
              <MessageCircle size={18} /> Book for Jagran <ArrowRight size={18} />
            </a>
          </motion.div>

          <motion.div
            className={styles.stats}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div>
              <strong><AnimatedCounter className={styles.statValue} value={settings.counters?.stageShows || siteConfig.stageShows} /></strong>
              <span className={styles.statLabel}>Stage Shows</span>
            </div>
            <div>
              <strong><AnimatedCounter className={styles.statValue} value={`${new Date().getFullYear() - siteConfig.performingSince}+`} /></strong>
              <span className={styles.statLabel}>Years</span>
            </div>
            <div>
              <strong><AnimatedCounter className={styles.statValue} value={`${siteConfig.genres.length}+`} /></strong>
              <span className={styles.statLabel}>Genres</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease }}
        >
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
              preload
              fetchPriority="high"
              sizes="(max-width:56.25rem) 80vw, 40vw"
            />
          </div>

          <motion.div
            className={`${styles.badge} ${styles.badgeTop}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Mic2 size={14} /> Live Jagran
          </motion.div>
          <motion.div
            className={`${styles.badge} ${styles.badgeBottom}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85 }}
          >
            <Star size={14} /> {settings.counters?.stageShows || siteConfig.stageShows} shows
          </motion.div>
        </motion.div>
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
