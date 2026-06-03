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

function fmtViews(n) {
  if (!n) return "0";
  if (n >= 1e7) return `${(n / 1e7).toFixed(1)} Cr`;
  if (n >= 1e5) return `${(n / 1e5).toFixed(1)} L`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return String(n);
}

/**
 * Gradient area + bar chart — pure SVG, no external library.
 * Proper readable size with crisp labels.
 */
function InquiriesChart({ data }) {
  if (!data?.length) return <p className={styles.empty}>No data yet.</p>;

  const W = 300, CHART_H = 100, LABEL_H = 18, H = CHART_H + LABEL_H;
  const PAD_L = 28, PAD_R = 8, PAD_TOP = 10, PAD_BOT = 4;
  const plotW = W - PAD_L - PAD_R;
  const plotH = CHART_H - PAD_TOP - PAD_BOT;
  const max = Math.max(...data.map((d) => d.inquiries), 1);
  const n = data.length;
  const stepX = plotW / (n - 1 || 1);

  const pts = data.map((d, i) => ({
    x: PAD_L + i * stepX,
    y: PAD_TOP + plotH - (d.inquiries / max) * plotH,
    v: d.inquiries,
    month: d.month,
  }));

  const polyPts = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const areaD = `M ${pts[0].x},${PAD_TOP + plotH} ` +
    pts.map((p) => `L ${p.x},${p.y}`).join(" ") +
    ` L ${pts[pts.length - 1].x},${PAD_TOP + plotH} Z`;

  // Y-axis: 3 guide lines
  const guides = [0, 0.5, 1].map((f) => ({
    y: PAD_TOP + plotH - f * plotH,
    label: f === 0 ? "0" : Math.round(f * max),
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg} aria-hidden>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b5277d" />
          <stop offset="100%" stopColor="#6f2bb0" />
        </linearGradient>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b5277d" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6f2bb0" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b5277d" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#6f2bb0" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* Y-axis guide lines + labels */}
      {guides.map(({ y, label }) => (
        <g key={label}>
          <line x1={PAD_L} y1={y} x2={W - PAD_R} y2={y}
            stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.6"
            strokeDasharray={label === "0" ? "none" : "2 2"} />
          <text x={PAD_L - 3} y={y + 3} textAnchor="end" className={styles.axisY}>
            {label}
          </text>
        </g>
      ))}

      {/* Gradient bars (thin, behind line) */}
      {pts.map((p, i) => {
        const bw = Math.max(stepX * 0.4, 4);
        const bh = PAD_TOP + plotH - p.y;
        return (
          <rect key={i} x={p.x - bw / 2} y={p.y}
            width={bw} height={bh > 0 ? bh : 0}
            rx="2" fill="url(#barGrad)" />
        );
      })}

      {/* Area fill */}
      <path d={areaD} fill="url(#areaGrad)" />

      {/* Line */}
      <polyline points={polyPts} fill="none"
        stroke="url(#lineGrad)" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* Dots */}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3"
          fill="#b5277d" stroke="white" strokeWidth="1.2" />
      ))}

      {/* Value labels above dots */}
      {pts.map((p, i) => p.v > 0 && (
        <text key={i} x={p.x} y={p.y - 5}
          textAnchor="middle" className={styles.dotLabel}>
          {p.v}
        </text>
      ))}

      {/* X-axis month labels */}
      {pts.map((p, i) => (
        <text key={i} x={p.x} y={CHART_H + 13}
          textAnchor="middle" className={styles.axisX}>
          {p.month}
        </text>
      ))}
    </svg>
  );
}

/** Gradient horizontal bar — YouTube top videos by views. */
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

  const topVideos = stats?.topVideos || [];
  const maxViews = Math.max(...topVideos.map((v) => v.views), 1);

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

        {/* Inquiries gradient chart */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <TrendingUp size={14} aria-hidden />
            <h2>Inquiries — Last 6 Months</h2>
          </div>
          {loading
            ? <div className={styles.chartSkel} />
            : <InquiriesChart data={stats?.chart} />}
        </div>

        {/* Top YouTube videos by views */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <Music2 size={14} aria-hidden />
            <h2>Top YouTube Videos</h2>
            <span className={styles.ytBadge}>Live from YouTube</span>
          </div>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <div key={i} className={styles.rowSkel} />)
            : topVideos.length
              ? topVideos.map((v) => (
                  <div key={v.id} className={styles.bhItem}>
                    <div className={styles.bhRow}>
                      <a href={v.url} target="_blank" rel="noopener noreferrer"
                        className={styles.bhTitle} title={v.title}>
                        {v.title}
                      </a>
                      <span className={styles.bhViews}>{fmtViews(v.views)}</span>
                    </div>
                    <HBar value={v.views} max={maxViews} />
                  </div>
                ))
              : (
                <p className={styles.empty}>
                  No YouTube view data yet. Set <code>YOUTUBE_API_KEY</code> in Vercel env for live counts.
                </p>
              )
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
            <Music2 size={12} aria-hidden /> Bhajan videos pull live from YouTube — no manual upload needed.
          </p>
        </div>
      </div>
    </div>
  );
}
