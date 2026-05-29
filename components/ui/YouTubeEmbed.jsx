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
      style={{ backgroundImage: `url(${youtubeThumb(id)})`, aspectRatio: aspect }}
      aria-label={`Watch ${title} on YouTube`}
      title={`Watch ${title} on Anita Prajapat's YouTube channel`}
    >
      <span className={styles.play}><Play size={18} fill="currentColor" aria-hidden /></span>
    </a>
  );
}
