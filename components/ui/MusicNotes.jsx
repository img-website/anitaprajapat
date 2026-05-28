"use client";

import { Music, Music2, Music4 } from "lucide-react";
import styles from "./MusicNotes.module.scss";

const ICONS = [Music, Music2, Music4, Music2, Music];

// Decorative floating music notes layer (purely visual).
export default function MusicNotes({ count = 5, tone = "brand" }) {
  return (
    <div className={`${styles.layer} ${styles[tone]}`} aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const Icon = ICONS[i % ICONS.length];
        return (
          <span key={i} className={styles.note} style={{ "--i": i }}>
            <Icon size={22 + (i % 3) * 10} />
          </span>
        );
      })}
    </div>
  );
}
