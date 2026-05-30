import Image from "next/image";
import { Play } from "lucide-react";
import { youtubeId, youtubeThumb, youtubeWatchUrl } from "@/utils/helpers";
import styles from "./YouTubeEmbed.module.scss";

/** Thumbnail card that opens the video on YouTube in a new tab. */
export default function YouTubeEmbed({ url, title = "YouTube video", aspect = "16/9" }) {
  const id = youtubeId(url);
  const href = youtubeWatchUrl(url);
  if (!id || !href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.facade}
      style={{ aspectRatio: aspect }}
      aria-label={`Watch ${title} on YouTube`}
      title={`Watch ${title} on Anita Prajapat's YouTube channel`}
    >
      {/* next/image optimizes the YouTube thumbnail → WebP/AVIF + long edge cache. */}
      <Image
        src={youtubeThumb(id)}
        alt={`${title} — Anita Prajapat bhajan`}
        fill
        sizes="(max-width: 48rem) 100vw, 33vw"
        className={styles.thumb}
      />
      <span className={styles.play}><Play size={18} fill="currentColor" aria-hidden /></span>
    </a>
  );
}
