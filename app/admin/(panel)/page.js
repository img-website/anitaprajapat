"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/services/apiClient";
import styles from "./dashboard.module.scss";

const cards = [
  { key: "events", label: "Events", href: "/admin/events" },
  { key: "upcoming", label: "Upcoming Events", href: "/admin/events" },
  { key: "gallery", label: "Gallery Photos", href: "/admin/gallery" },
  { key: "newInquiries", label: "New Inquiries", href: "/admin/inquiries" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/admin/stats")
      .then((res) => setStats(res.data))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>
        Overview of your devotional content & bookings.
      </p>

      {error && <p style={{ color: "#ff8a85" }}>{error}</p>}

      <div className={styles.grid}>
        {stats
          ? cards.map((c) => (
              <Link key={c.key} href={c.href} className={styles.stat}>
                <span className={styles.num}>{stats.counts?.[c.key] ?? 0}</span>
                <span className={styles.label}>{c.label}</span>
              </Link>
            ))
          : cards.map((c) => (
              <div key={c.key} className={`${styles.stat} ${styles.statSkeleton}`} aria-hidden>
                <span className={styles.skNum} />
                <span className={styles.skLabel} />
              </div>
            ))}
      </div>

      {stats ? (
        <div className={styles.note}>
          🎬 Bhajan videos are pulled automatically from YouTube (popular, latest
          &amp; playlists) — no manual video entry needed.
        </div>
      ) : (
        <div className={`${styles.note} ${styles.noteSkeleton}`} aria-hidden />
      )}

      {stats ? (
        <div className={styles.quick}>
          <Link href="/admin/events" className="adm-btn primary">+ Add Event</Link>
          <Link href="/admin/gallery" className="adm-btn">+ Add Photo</Link>
          <Link href="/admin/banners" className="adm-btn">+ Banner</Link>
          <Link href="/admin/settings" className="adm-btn">Site Settings</Link>
        </div>
      ) : (
        <div className={styles.quick} aria-hidden>
          <div className={styles.quickSk} />
          <div className={styles.quickSk} />
          <div className={styles.quickSk} />
          <div className={styles.quickSk} />
        </div>
      )}
    </div>
  );
}
