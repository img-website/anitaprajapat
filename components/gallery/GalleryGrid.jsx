"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";
import { youtubeThumb, youtubeEmbed } from "@/utils/helpers";
import styles from "./GalleryGrid.module.scss";

export default function GalleryGrid({ items = [] }) {
  const [active, setActive] = useState(null);

  if (!items.length)
    return <p className={styles.empty}>No media yet. Check back soon.</p>;

  return (
    <>
      <div className={styles.masonry}>
        {items.map((item, idx) => {
          const isVideo = item.mediaType !== "image";
          const src = item.image?.url || youtubeThumb(item.videoUrl) || "/placeholder.svg";
          return (
            <button
              key={item._id || idx}
              className={styles.cell}
              onClick={() => setActive(item)}
              aria-label={`Open ${item.title || (isVideo ? "video" : "photo")} — Anita Prajapat`}
              title={item.title || "Anita Prajapat gallery"}
            >
              <Image
                src={src}
                alt={item.title ? `${item.title} — Anita Prajapat` : "Anita Prajapat stage & Jagran gallery photo"}
                title={item.title || "Anita Prajapat — Sanwariya Seth & Khatu Shyam Bhajan Singer"}
                width={600}
                height={600}
                sizes="(max-width: 48rem) 50vw, 25vw"
              />
              {isVideo && <span className={styles.play}><Play size={20} fill="currentColor" aria-hidden /></span>}
              {item.title && <span className={styles.caption}>{item.title}</span>}
            </button>
          );
        })}
      </div>

      {active && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={active.title || "Anita Prajapat gallery media"}
          style={{ animation: "fadeIn 0.25s ease both" }}
          onClick={() => setActive(null)}
        >
          <button className={styles.close} aria-label="Close gallery viewer" title="Close"><X size={20} aria-hidden /></button>
          <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
            {active.mediaType !== "image" && youtubeEmbed(active.videoUrl) ? (
              <iframe
                src={youtubeEmbed(active.videoUrl)}
                title={active.title || "Video"}
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <Image
                src={active.image?.url || youtubeThumb(active.videoUrl) || "/placeholder.svg"}
                alt={active.title ? `${active.title} — Anita Prajapat` : "Anita Prajapat gallery photo"}
                title={active.title || "Anita Prajapat — Sanwariya Seth & Khatu Shyam Bhajan Singer"}
                width={1280}
                height={853}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
