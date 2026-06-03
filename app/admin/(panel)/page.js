"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays, Images, Inbox, Users, Star, Handshake,
  Music2, BookOpen, TrendingUp, ArrowRight, RefreshCw,
  AlertCircle, ChevronRight, Settings,
} from "lucide-react";
import styles from "./dashboard.module.scss";

const STAT_CARDS = [
  { key: "upcoming",     label: "Upcoming",      Icon: CalendarDays, href: "/admin/events",       color: "#8b5cf6" },
  { key: "newInquiries", label: "New Inquiries", Icon: Inbox,        href: "/admin/inquiries",    color: "#ef4444", alert: true },
  { key: "gallery",      label: "Photos",        Icon: Images,       href: "/admin/gallery",      color: "#3b82f6" },
  { key: "events",       label: "Total Events",  Icon: CalendarDays, href: "/admin/events",       color: "#22c55e" },
  { key: "testimonials", label: "Testimonials",  Icon: Star,         href: "/admin/testimonials", color: "#f59e0b" },
  { key: "inquiries",    label: "Inquiries",     Icon: Users,        href: "/admin/inquiries",    color: "#ec4899" },
  { key: "sponsors",     label: "Sponsors",      Icon: Handshake,    href: "/admin/sponsors",     color: "#06b6d4" },
  { key: "bhajans",      label: "Bhajans (DB)",  Icon: Music2,       href: "/admin",              color: "#a855f7" },
];

const QUICK = [
  { label: "Add Event",     href: "/admin/events",    Icon: CalendarDays },
  { label: "Upload Photos", href: "/admin/gallery",   Icon: Images },
  { label: "New Banner",    href: "/admin/banners",   Icon: BookOpen },
  { label: "Settings",      href: "/admin/settings",  Icon: Settings },
];

const STATUS_COLORS = { new: "#3b82f6", contacted: "#f59e0b", closed: "#94a3b8" };

function fmtDate(val) {
  if (!val) return "";
  return new Date(val).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

/**
 * Compact gradient area + bar chart — pure SVG, no library.
 * viewBox: 0 0 220 72
 * Grid lines: 3 horizontal rules at 25%, 50%, 75%
 * Bars: thin gradient-filled rounded rects
 * Line: smooth polyline with gradient fill area beneath
 */
function InquiriesChart({ data }) {
  if (!data?.length) return <p className={styles.empty}>No data yet.</p>;

  const W = 220, H = 60, BOTTOM = 52, TOP = 8;
  const max = Math.max(...data.map((d) => d.inquiries), 1);
  const bw = 18; // bar width
  const gap = (W - bw) / (data.length - 1 || 1);

  const points = data.map((d, i) => {
    const x = i * gap + bw / 2;
    const y = BOTTOM - ((d.inquiries / max) * (BOTTOM - TOP));
    return [x, y];
  });

  const polyline = points.map((p) => p.join(",")).join(" ");
  // Closed path for the filled area under the line
  const areaPath = `M ${points[0][0]},${BOTTOM} ` +
    points.map((p) => `L ${p[0]},${p[1]}`).join(" ") +
    ` L ${points[points.length - 1][0]},${BOTTOM} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H + 14}`} className={styles.svg} aria-hidden>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b5277d" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6f2bb0" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b5277d" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#b5277d" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((f) => {
        const y = BOTTOM - f * (BOTTOM - TOP);
        return <line key={f} x1={0} y1={y} x2={W} y2={y} stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.5" />;
      })}

      {/* Bars */}
      {data.map((d, i) => {
        const x = i * gap;
        const barH = Math.max((d.inquiries / max) * (BOTTOM - TOP), d.inquiries > 0 ? 1.5 : 0);
        return (
          <rect key={d.month} x={x} y={BOTTOM - barH} width={bw} height={barH}
            rx="2" fill="url(#barGrad)" opacity="0.55" />
        );
      })}

      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />

      {/* Line */}
      <polyline points={polyline} fill="none" stroke="#b5277d" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots at data points */}
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={data[i].inquiries > 0 ? 2.2 : 0}
          fill="#b5277d" stroke="white" strokeWidth="0.8" />
      ))}

      {/* Month labels */}
      {data.map((d, i) => (
        <text key={d.month} x={i * gap + bw / 2} y={H + 12}
          textAnchor="middle" className={styles.axisLabel}>
          {d.month}
        </text>
      ))}
    </svg>
  );
}

/** Horizontal bar with gradient fill — top bhajans. */
function HBar({ value, max }) {
  const pct = Math.round((value / Math.max(max, 1)) * 100);
  return (
    <div className={styles.hBarTrack}>
      <div className={styles.hBarFill} style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    import("@/services/apiClient").then(({ default: api }) =>
      api.get("/admin/stats")
        .then((res) => { setStats(res.data); setLoading(false); })
        .catch((e) => { setError(e.message); setLoading(false); })
    );
  };

  useEffect(() => { load(); }, []);

  const maxViews = Math.max(...(stats?.topBhajans?.map((b) => b.views) || [1]), 1);

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.head}>
        <div>
          <h1>Dashboard</h1>
          <p>Overview of Anita Prajapat&apos;s site activity.</p>
        </div>
        <button type="button" className="adm-btn" onClick={load} disabled={loading}>
          <RefreshCw size={13} className={loading ? styles.spin : ""} aria-hidden /> Refresh
        </button>
      </div>

      {error && (
        <div className={styles.errBanner} role="alert">
          <AlertCircle size={14} aria-hidden /> {error}
        </div>
      )}

      {/* Stat cards */}
      <div className={styles.statsGrid}>
        {STAT_CARDS.map(({ key, label, Icon, href, color, alert }) => (
          <Link key={key} href={href}
            className={`${styles.statCard} ${alert && stats?.counts?.[key] > 0 ? styles.statAlert : ""}`}
            style={{ "--accent": color }}>
            <span className={styles.statIcon}><Icon size={15} aria-hidden /></span>
            <div className={styles.statBody}>
              {loading
                ? <><div className={styles.skNum} /><div className={styles.skLbl} /></>
                : <><b>{stats?.counts?.[key] ?? 0}</b><span>{label}</span></>
              }
            </div>
            <ChevronRight size={12} className={styles.statChev} aria-hidden />
          </Link>
        ))}
      </div>

      {/* Charts row */}
      <div className={styles.chartsRow}>

        {/* Inquiries chart */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <TrendingUp size={14} aria-hidden /><h2>Inquiries — Last 6 Months</h2>
          </div>
          {loading ? <div className={styles.chartSkel} />
            : <InquiriesChart data={stats?.chart} />}
        </div>

        {/* Top bhajans */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <Music2 size={14} aria-hidden /><h2>Top Bhajans by Views</h2>
          </div>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <div key={i} className={styles.rowSkel} />)
            : stats?.topBhajans?.length
              ? stats.topBhajans.map((b) => (
                  <div key={b._id} className={styles.bhItem}>
                    <div className={styles.bhRow}>
                      <span className={styles.bhTitle}>{b.title}</span>
                      <span className={styles.bhViews}>{(b.views || 0).toLocaleString("en-IN")}</span>
                    </div>
                    <HBar value={b.views || 0} max={maxViews} />
                  </div>
                ))
              : <p className={styles.empty}>No bhajans with views yet.</p>
          }
        </div>
      </div>

      {/* Bottom row */}
      <div className={styles.bottomRow}>

        {/* Recent inquiries */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <Inbox size={14} aria-hidden />
            <h2>Recent Inquiries</h2>
            <Link href="/admin/inquiries" className={styles.seeAll}>
              See all <ArrowRight size={11} aria-hidden />
            </Link>
          </div>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <div key={i} className={styles.rowSkel} />)
            : stats?.recentInquiries?.length
              ? stats.recentInquiries.map((inq) => {
                  const c = STATUS_COLORS[inq.status] || "var(--text-muted)";
                  return (
                    <div key={inq._id} className={styles.inqRow}>
                      <div className={styles.inqInfo}>
                        <span className={styles.inqName}>{inq.name}</span>
                        <span className={styles.inqMeta}>{inq.type} · {inq.city || "—"} · {fmtDate(inq.createdAt)}</span>
                      </div>
                      <span className={styles.badge}
                        style={{ background: `color-mix(in srgb,${c} 16%,transparent)`, color: c }}>
                        {inq.status || "new"}
                      </span>
                    </div>
                  );
                })
              : <p className={styles.empty}>No inquiries yet.</p>
          }
        </div>

        {/* Quick actions */}
        <div className={styles.panel}>
          <div className={styles.panelHead}><h2>Quick Actions</h2></div>
          <div className={styles.quickList}>
            {QUICK.map(({ label, href, Icon }) => (
              <Link key={href} href={href} className={styles.quickItem}>
                <span className={styles.quickIcon}><Icon size={15} aria-hidden /></span>
                <span>{label}</span>
                <ArrowRight size={12} className={styles.quickArrow} aria-hidden />
              </Link>
            ))}
          </div>
          <p className={styles.ytHint}>
            <Music2 size={12} aria-hidden /> Bhajan videos are pulled live from YouTube — no manual upload needed.
          </p>
        </div>
      </div>
    </div>
  );
}
