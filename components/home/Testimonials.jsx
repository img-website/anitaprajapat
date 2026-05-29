"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={t._id || i}
              className={styles.quote}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.4 }}
            >
              <span className={styles.mark}>“</span>
              <p>{t.message}</p>
              <div className={styles.stars} aria-label={`${t.rating || 5} out of 5 stars`}>
                {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                  <Star key={idx} size={14} fill="currentColor" aria-hidden />
                ))}
              </div>
              <footer>
                <strong>{t.name}</strong>
                {t.role && <span>{t.role}</span>}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
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
