"use client";

import { useState } from "react";
import { youtubeId, youtubeThumb } from "@/utils/helpers";
import styles from "./YouTubeEmbed.module.scss";

// Lazy YouTube facade: loads the iframe only after click (better LCP/perf).
export default function YouTubeEmbed({ url, title = "YouTube video" }) {
  const [active, setActive] = useState(false);
  const id = youtubeId(url);
  if (!id) return null;

  if (active) {
    return (
      <div className={styles.wrap}>
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <button
      className={styles.facade}
      onClick={() => setActive(true)}
      style={{ backgroundImage: `url(${youtubeThumb(id)})` }}
      aria-label={`Play ${title}`}
    >
      <span className={styles.play}>▶</span>
    </button>
  );
}
