import styles from "./QuotesMarquee.module.scss";

export default function QuotesMarquee({ quotes = [] }) {
  if (!quotes.length) return null;
  const loop = [...quotes, ...quotes];
  return (
    <section className={styles.band} aria-label="Devotional quotes">
      <div className={styles.track}>
        {loop.map((q, i) => (
          <span key={i} className={styles.item}>
            <span className={styles.om}>ॐ</span>
            {q.text}
            {q.author && <em>— {q.author}</em>}
          </span>
        ))}
      </div>
    </section>
  );
}
