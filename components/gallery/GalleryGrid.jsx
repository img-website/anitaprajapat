"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
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
            <motion.button
              key={item._id || idx}
              className={styles.cell}
              onClick={() => setActive(item)}
              aria-label={`Open ${item.title || (isVideo ? "video" : "photo")} — Anita Prajapat`}
              title={item.title || "Anita Prajapat gallery"}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: (idx % 6) * 0.04 }}
            >
              <Image
                src={src}
                alt={item.title ? `${item.title} — Anita Prajapat` : "Anita Prajapat stage & jagran gallery photo"}
                title={item.title || "Anita Prajapat — Sanwariya Seth & Khatu Shyam Bhajan Singer"}
                width={600}
                height={600}
                sizes="(max-width: 48rem) 50vw, 25vw"
              />
              {isVideo && <span className={styles.play}>▶</span>}
              {item.title && <span className={styles.caption}>{item.title}</span>}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className={styles.lightbox}
            role="dialog"
            aria-modal="true"
            aria-label={active.title || "Anita Prajapat gallery media"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <button className={styles.close} aria-label="Close gallery viewer" title="Close">✕</button>
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
