import Link from "next/link";
import Image from "next/image";
import { youtubeThumb } from "@/utils/helpers";
import styles from "./Cards.module.scss";

export default function BhajanCard({ bhajan }) {
  const thumb =
    bhajan.thumbnail?.url ||
    youtubeThumb(bhajan.youtubeUrl) ||
    "/placeholder.svg";

  return (
    <article className={styles.card}>
      <Link href={`/bhajans/${bhajan.slug}`} className={styles.thumb}>
        <Image
          src={thumb}
          alt={bhajan.thumbnail?.alt || bhajan.title}
          fill
          sizes="(max-width: 48rem) 100vw, 33vw"
        />
        <span className={styles.play}>
          <span className={styles.playBtn}>▶</span>
        </span>
      </Link>
      <div className={styles.body}>
        <div className={styles.tagRow}>
          {bhajan.isTrending && <span className="badge">Trending</span>}
          {bhajan.genre && <span className="badge">{bhajan.genre}</span>}
        </div>
        <Link href={`/bhajans/${bhajan.slug}`}>
          <h3 className={styles.title}>{bhajan.title}</h3>
        </Link>
        <div className={styles.meta}>
          <span>{bhajan.category?.name || "Bhajan"}</span>
          <span>{bhajan.views || 0} views</span>
        </div>
      </div>
    </article>
  );
}
