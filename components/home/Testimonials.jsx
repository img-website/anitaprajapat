"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import styles from "./Testimonials.module.scss";

export default function Testimonials({ items = [] }) {
  const [i, setI] = useState(0);
  if (!items.length) return null;
  const t = items[i];
  const go = (dir) => setI((p) => (p + dir + items.length) % items.length);

  return (
    <section className="section">
      <div className="container">
        <SectionHeading eyebrow="Kind Words" title="What Devotees & Organizers Say" />
        <div className={styles.stage}>
          <button className={styles.nav} onClick={() => go(-1)} aria-label="Previous"><ChevronLeft size={22} aria-hidden /></button>
          {/* key remount replays the CSS quoteIn entrance on each slide. */}
          <blockquote
            key={t._id || i}
            className={styles.quote}
            style={{ animation: "quoteIn 0.4s ease both" }}
          >
            <span className={styles.mark}>“</span>
            <p>{t.message}</p>
            <div className={styles.stars} role="img" aria-label={`${t.rating || 5} out of 5 stars`}>
              {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                <Star key={idx} size={14} fill="currentColor" aria-hidden />
              ))}
            </div>
            <footer>
              <strong>{t.name}</strong>
              {t.role && <span>{t.role}</span>}
            </footer>
          </blockquote>
          <button className={styles.nav} onClick={() => go(1)} aria-label="Next"><ChevronRight size={22} aria-hidden /></button>
        </div>
        <div className={styles.dots}>
          {items.map((_, idx) => (
            <button
              key={idx}
              className={idx === i ? styles.activeDot : ""}
              onClick={() => setI(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
