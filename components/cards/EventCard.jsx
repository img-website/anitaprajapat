import Link from "next/link";
import Image from "next/image";
import styles from "./Cards.module.scss";

export default function EventCard({ event }) {
  const img = event.coverImage?.url || "/placeholder.svg";
  const d = event.date ? new Date(event.date) : null;
  return (
    <article className={styles.card}>
      <Link href={`/events/${event.slug}`} className={styles.thumb}>
        <Image
          src={img}
          alt={event.coverImage?.alt || event.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={img.startsWith("http")}
        />
        {d && (
          <span className={styles.dateBadge}>
            <span className={styles.day}>{d.getDate()}</span>
            <span className={styles.mon}>
              {d.toLocaleString("en-IN", { month: "short" })}
            </span>
          </span>
        )}
      </Link>
      <div className={styles.body}>
        <span className="badge">{event.type}</span>
        <Link href={`/events/${event.slug}`}>
          <h3 className={styles.title}>{event.title}</h3>
        </Link>
        <div className={styles.meta}>
          <span>{[event.venue, event.city].filter(Boolean).join(", ")}</span>
          <span>{event.startTime}</span>
        </div>
      </div>
    </article>
  );
}
