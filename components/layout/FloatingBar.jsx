"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import { brandMap, WhatsappIcon } from "@/components/ui/BrandIcons";
import { youtubeSubscribeUrl } from "@/utils/helpers";
import styles from "./FloatingBar.module.scss";

export default function FloatingBar({ settings = {} }) {
  const [showTop, setShowTop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const social = { ...siteConfig.social, ...(settings.social || {}) };
  if (social.youtube) social.youtube = youtubeSubscribeUrl(social.youtube);
  const whatsapp = settings.whatsapp || siteConfig.whatsapp;

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    const mq = window.matchMedia("(max-width: 63.9375rem)");
    const syncViewport = () => setIsMobile(mq.matches);
    syncViewport();
    mq.addEventListener("change", syncViewport);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", syncViewport);
    };
  }, []);

  return (
    <>
      <aside className={styles.socialBar} aria-label="Social links">
        {["youtube", "instagram", "facebook", "pinterest"].map((k) => {
          const Icon = brandMap[k];
          return social[k] && Icon ? (
            <a key={k} href={social[k]} data-net={k} target="_blank" rel="noopener noreferrer" title={k} aria-label={k}>
              <Icon size={19} />
            </a>
          ) : null;
        })}
      </aside>

      {!isMobile && (
        <a
          href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
            "Hello, I would like to book Anita Prajapat for a Jagran / event."
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.whatsapp}
          aria-label="Chat on WhatsApp"
        >
          <span className={styles.waIcon}><WhatsappIcon size={22} /></span>
          <span className={styles.waLabel}>Book Now</span>
        </a>
      )}

      {showTop && (
        <button
          className={styles.toTop}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}
