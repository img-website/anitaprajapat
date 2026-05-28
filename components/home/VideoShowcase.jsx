"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Flame, Clock, Eye, ListVideo } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import YouTubeEmbed from "@/components/ui/YouTubeEmbed";
import { StaggerGroup, StaggerItem } from "@/components/ui/Reveal";
import styles from "./VideoShowcase.module.scss";

function fmtViews(n) {
  if (!n) return null;
  if (n >= 1e7) return `${(n / 1e7).toFixed(1)} Cr`;
  if (n >= 1e5) return `${(n / 1e5).toFixed(1)} L`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

export default function VideoShowcase({
  popular = [],
  latest = [],
  playlists = [],
  heading = "Watch Sanwariya Seth & Khatu Shyam Bhajans",
  eyebrow = "From the Channel",
  subtitle = "Fresh Sanwariya Seth, Khatu Shyam & Mataji bhajan uploads, all-time favourites & curated playlists — straight from YouTube.",
  hideHeading = false,
}) {
  const tabsRef = useRef(null);

  // Translate vertical mouse-wheel into horizontal scroll over the tab strip.
  // Native non-passive listener so we can preventDefault (stops page scroll).
  useEffect(() => {
    const el = tabsRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (el.scrollWidth <= el.clientWidth) return; // nothing to scroll
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; // already horizontal
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const tabs = useMemo(() => {
    const t = [];
    if (popular.length) t.push({ key: "popular", label: "Popular", Icon: Flame, items: popular });
    if (latest.length) t.push({ key: "latest", label: "Latest", Icon: Clock, items: latest });
    playlists.forEach((p) => {
      if (p.videos?.length) t.push({ key: p.id, label: p.title, Icon: ListVideo, items: p.videos });
    });
    return t;
  }, [popular, latest, playlists]);

  const [active, setActive] = useState(tabs[0]?.key);
  if (!tabs.length) return null;

  const current = tabs.find((t) => t.key === active) || tabs[0];

  return (
    <section className={`section ${styles.wrap}`}>
      <div className="container">
        {!hideHeading && <SectionHeading eyebrow={eyebrow} title={heading} subtitle={subtitle} />}

        <div className={styles.tabsWrap} ref={tabsRef}>
          <div className={styles.tabs}>
            {tabs.map((t) => (
              <button
                key={t.key}
                className={active === t.key ? styles.active : ""}
                onClick={() => setActive(t.key)}
              >
                <t.Icon size={15} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        <StaggerGroup className={styles.grid} key={current.key}>
          {current.items.map((v) => (
            <StaggerItem key={v.id} className={styles.card}>
              <YouTubeEmbed url={v.url} title={v.title} />
              <div className={styles.meta}>
                <h3>{v.title}</h3>
                {v.views > 0 && (
                  <span className={styles.views}>
                    <Eye size={14} /> {fmtViews(v.views)} views
                  </span>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
