"use client";

import { Music } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { youtubeSubscribeUrl } from "@/utils/helpers";
import Reveal from "@/components/ui/Reveal";
import { YoutubeIcon, InstagramIcon, FacebookIcon } from "@/components/ui/BrandIcons";
import { ArrowUpRight } from "lucide-react";
import MusicNotes from "@/components/ui/MusicNotes";
import styles from "./Counters.module.scss";

export default function Counters({ settings = {} }) {
  const c = settings.counters || {};
  const social = { ...siteConfig.social, ...(settings.social || {}) };

  const items = [
    { label: "YouTube Subscribers", value: c.youtubeSubscribers || "Subscribe", href: youtubeSubscribeUrl(social.youtube), key: "yt", Icon: YoutubeIcon, cta: "Subscribe", title: "Subscribe to Anita Prajapat on YouTube for Sanwariya Seth & Khatu Shyam bhajans" },
    { label: "Instagram Followers", value: c.instagramFollowers || "Follow", href: social.instagram, key: "ig", Icon: InstagramIcon, title: "Follow Anita Prajapat on Instagram" },
    { label: "Facebook Followers", value: c.facebookFollowers || "Follow", href: social.facebook, key: "fb", Icon: FacebookIcon, title: "Follow Anita Prajapat on Facebook" },
    { label: "Stage Shows", value: c.stageShows || siteConfig.stageShows, href: null, key: "shows", Icon: Music },
  ];

  return (
    <section className={`section ${styles.wrap}`}>
      <MusicNotes count={5} />
      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className={styles.grid}>
          {items.map((it, i) => (
            <Reveal key={it.key} variant="scale" delay={i * 0.08} className={styles.item}>
              <span className={`${styles.icon} ${styles[it.key]}`}>
                <it.Icon size={22} />
              </span>
              <strong>{it.value}</strong>
              <span className={styles.label}>{it.label}</span>
              {it.href && (
                <a href={it.href} target="_blank" rel="noopener noreferrer" title={it.title || it.label} aria-label={it.title || `${it.cta || "Connect"} — ${it.label}`} className={styles.link}>
                  {it.cta || "Connect"} <ArrowUpRight size={14} />
                </a>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
