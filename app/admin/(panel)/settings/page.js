"use client";

import { useEffect, useRef, useState } from "react";
import {
  Palette, Phone, Share2, BarChart2, Search, Music2,
  LayoutGrid, Image as ImageIcon, Save, RefreshCw,
  Check, AlertCircle, ChevronRight,
} from "lucide-react";
import api from "@/services/apiClient";
import ImageUploader from "@/components/admin/ImageUploader";
import AudioUploader from "@/components/admin/AudioUploader";
import { mergeBento } from "@/lib/bentoDefaults";
import { youtubeId } from "@/utils/helpers";
import styles from "./settings.module.scss";

const SECTIONS = [
  { id: "branding",  label: "Branding",        Icon: Palette },
  { id: "contact",   label: "Contact",          Icon: Phone },
  { id: "social",    label: "Social Links",     Icon: Share2 },
  { id: "counters",  label: "Counters",         Icon: BarChart2 },
  { id: "seo",       label: "SEO",              Icon: Search },
  { id: "music",     label: "Music",            Icon: Music2 },
  { id: "bento",     label: "Bento Section",    Icon: LayoutGrid },
  { id: "featured",  label: "Featured Video",   Icon: ImageIcon },
];

const FIELD_LABELS = {
  siteName: "Site Name", phone: "Phone", whatsapp: "WhatsApp", email: "Email",
  featuredVideo: "YouTube Video URL", "bento.storyHref": "Story link URL",
  "social.youtube": "YouTube", "social.instagram": "Instagram",
  "social.facebook": "Facebook", "social.pinterest": "Pinterest",
};

export default function SettingsPage() {
  const [s, setS] = useState(null);
  const [status, setStatus] = useState(""); // "saving" | "saved" | error msg
  const [errors, setErrors] = useState({});
  const [syncing, setSyncing] = useState(false);
  const [syncReport, setSyncReport] = useState(null);
  const [activeSection, setActiveSection] = useState("branding");
  const sectionRefs = useRef({});

  useEffect(() => {
    api.get("/settings")
      .then((res) => setS({ ...res.data, bento: mergeBento(res.data) }))
      .catch((e) => setStatus(e.message));
  }, []);

  // Intersection observer — update active nav item on scroll
  useEffect(() => {
    if (!s) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [s]);

  const set = (path, value) => {
    setErrors((prev) => { if (!prev[path]) return prev; const n = { ...prev }; delete n[path]; return n; });
    setS((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) { cur[keys[i]] = cur[keys[i]] || {}; cur = cur[keys[i]]; }
      cur[keys.at(-1)] = value;
      return next;
    });
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = sanitizeSettings(s);
    const nextErrors = validateSettings(payload);
    if (Object.keys(nextErrors).length) { setErrors(nextErrors); setStatus("Please fix validation errors."); return; }
    setErrors({}); setStatus("saving");
    try {
      await api.put("/settings", payload);
      setS(payload); setStatus("saved");
      setTimeout(() => setStatus(""), 2500);
    } catch (e2) { setStatus(e2.message); }
  };

  const syncCounters = async () => {
    setSyncing(true); setStatus("");
    try {
      const res = await api.post("/admin/social-sync");
      setS({ ...res.data, bento: mergeBento(res.data) });
      setSyncReport(res.report || null);
      setStatus("saved");
      setTimeout(() => setStatus(""), 2500);
    } catch (e2) { setStatus(e2.message); }
    finally { setSyncing(false); }
  };

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
  };

  const ref = (id) => (el) => { sectionRefs.current[id] = el; };

  if (!s) return (
    <div className={styles.skeletonWrap} aria-label="Loading settings">
      <div className={styles.skeletonHead} />
      {Array.from({ length: 4 }).map((_, i) => <div key={i} className={styles.skeletonCard} />)}
    </div>
  );

  const isSaving = status === "saving";
  const isSaved = status === "saved";
  const isError = status && !isSaving && !isSaved;

  return (
    <form onSubmit={save} className={styles.root}>
      {/* ── Sticky header ── */}
      <div className={styles.head}>
        <h1>Settings</h1>
        <div className={styles.headRight}>
          {isError && (
            <span className={styles.statusErr} role="alert">
              <AlertCircle size={14} aria-hidden /> {status}
            </span>
          )}
          <button className={`adm-btn primary ${isSaved ? styles.savedBtn : ""}`} type="submit" disabled={isSaving}>
            {isSaving ? <><RefreshCw size={14} className={styles.spin} /> Saving…</>
             : isSaved ? <><Check size={14} /> Saved!</>
             : <><Save size={14} /> Save changes</>}
          </button>
        </div>
      </div>

      <div className={styles.layout}>
        {/* ── Left nav (desktop) ── */}
        <nav className={styles.sidenav} aria-label="Settings sections">
          {SECTIONS.map(({ id, label, Icon }) => (
            <button
              key={id} type="button"
              className={`${styles.navItem} ${activeSection === id ? styles.navActive : ""}`}
              onClick={() => scrollTo(id)}
            >
              <Icon size={15} aria-hidden />
              <span>{label}</span>
              <ChevronRight size={13} className={styles.navArrow} aria-hidden />
            </button>
          ))}
        </nav>

        {/* ── Sections ── */}
        <div className={styles.sections}>

          {/* Validation errors */}
          {Object.keys(errors).length > 0 && (
            <div className={styles.errorBox} role="alert">
              <AlertCircle size={15} aria-hidden />
              <div>
                <strong>Fix these fields before saving:</strong>
                <ul>{Object.entries(errors).map(([k, m]) => <li key={k}>{FIELD_LABELS[k] || k}: {m}</li>)}</ul>
              </div>
            </div>
          )}

          {/* ── Branding ── */}
          <section id="branding" ref={ref("branding")} className={styles.card}>
            <SectionHead Icon={Palette} title="Branding" desc="Site name, tagline and visuals." />
            <div className={styles.grid2}>
              <Field label="Site Name" value={s.siteName} required error={errors.siteName} onChange={(v) => set("siteName", v)} />
              <Field label="Tagline" value={s.tagline} onChange={(v) => set("tagline", v)} />
            </div>
            <div className={styles.grid2}>
              <div className="adm-field">
                <label>Logo <small>(square 1:1, navbar + footer)</small></label>
                <ImageUploader value={s.logo ? { url: s.logo } : null} onChange={(m) => set("logo", m?.url || "")} folder="branding" />
              </div>
              <div className="adm-field">
                <label>Artist Photo <small>(Home &amp; About portrait)</small></label>
                <ImageUploader value={s.artistImage ? { url: s.artistImage } : null} onChange={(m) => set("artistImage", m?.url || "")} folder="branding" />
              </div>
            </div>
          </section>

          {/* ── Contact ── */}
          <section id="contact" ref={ref("contact")} className={styles.card}>
            <SectionHead Icon={Phone} title="Contact" desc="Booking phone, WhatsApp, email and address." />
            <div className={styles.grid2}>
              <Field label="Phone" value={s.phone} required error={errors.phone} onChange={(v) => set("phone", v)} placeholder="8302598435" />
              <Field label="WhatsApp (with country code)" value={s.whatsapp} required error={errors.whatsapp} onChange={(v) => set("whatsapp", v)} placeholder="918302598435" />
              <Field label="Email" value={s.email} required error={errors.email} type="email" onChange={(v) => set("email", v)} />
              <Field label="Manager" value={s.manager} onChange={(v) => set("manager", v)} />
              <Field label="Address" value={s.address} onChange={(v) => set("address", v)} className={styles.spanFull} />
            </div>
          </section>

          {/* ── Social ── */}
          <section id="social" ref={ref("social")} className={styles.card}>
            <SectionHead Icon={Share2} title="Social Links" desc="Full profile URLs for YouTube, Instagram, Facebook and Pinterest." />
            <div className={styles.grid2}>
              <Field label="YouTube" value={s.social?.youtube} error={errors["social.youtube"]} onChange={(v) => set("social.youtube", v)} placeholder="https://youtube.com/@..." />
              <Field label="Instagram" value={s.social?.instagram} error={errors["social.instagram"]} onChange={(v) => set("social.instagram", v)} placeholder="https://instagram.com/..." />
              <Field label="Facebook" value={s.social?.facebook} error={errors["social.facebook"]} onChange={(v) => set("social.facebook", v)} placeholder="https://facebook.com/..." />
              <Field label="Pinterest" value={s.social?.pinterest} error={errors["social.pinterest"]} onChange={(v) => set("social.pinterest", v)} placeholder="https://pinterest.com/..." />
            </div>
          </section>

          {/* ── Counters ── */}
          <section id="counters" ref={ref("counters")} className={styles.card}>
            <SectionHead Icon={BarChart2} title="Counters" desc="Displayed on the homepage. Sync automatically or set manually." />
            <div className={styles.syncRow}>
              <button type="button" className="adm-btn" onClick={syncCounters} disabled={syncing}>
                {syncing ? <><RefreshCw size={14} className={styles.spin} /> Syncing…</> : <><RefreshCw size={14} /> Sync Now</>}
              </button>
              {s.countersLastSyncedAt && (
                <small className={styles.syncTime}>
                  Last synced: {new Date(s.countersLastSyncedAt).toLocaleString("en-IN")}
                </small>
              )}
            </div>
            {syncReport && (
              <div className={styles.syncReport}>
                {[["YouTube Subscribers", syncReport.youtubeSubscribers], ["Instagram", syncReport.instagramFollowers], ["Facebook", syncReport.facebookFollowers]].map(([lbl, r]) => (
                  <span key={lbl} className={r === "updated" ? styles.syncOk : r === "missing_config" ? styles.syncSkip : styles.syncFail}>
                    {r === "updated" ? "✓" : r === "missing_config" ? "–" : "✗"} {lbl}
                  </span>
                ))}
              </div>
            )}
            <small className={styles.hint}>Auto sync needs: YOUTUBE_API_KEY, INSTAGRAM_USER_ID + INSTAGRAM_ACCESS_TOKEN, FACEBOOK_PAGE_ID + FACEBOOK_ACCESS_TOKEN in Vercel env vars.</small>
            <div className={styles.grid4}>
              <Field label="YouTube Subscribers" value={s.counters?.youtubeSubscribers} onChange={(v) => set("counters.youtubeSubscribers", v)} />
              <Field label="Instagram Followers" value={s.counters?.instagramFollowers} onChange={(v) => set("counters.instagramFollowers", v)} />
              <Field label="Facebook Followers" value={s.counters?.facebookFollowers} onChange={(v) => set("counters.facebookFollowers", v)} />
              <Field label="Stage Shows" value={s.counters?.stageShows} onChange={(v) => set("counters.stageShows", v)} />
            </div>
          </section>

          {/* ── SEO ── */}
          <section id="seo" ref={ref("seo")} className={styles.card}>
            <SectionHead Icon={Search} title="SEO Defaults" desc="Default meta tags, Open Graph image and analytics IDs." />
            <div className={styles.grid2}>
              <Field label="Default Title" value={s.seo?.defaultTitle} onChange={(v) => set("seo.defaultTitle", v)} placeholder="Anita Prajapat — Sanwariya Seth & Khatu Shyam Bhajan Singer" />
              <Field label="Google Verification Code" value={s.seo?.gscVerification} onChange={(v) => set("seo.gscVerification", v)} />
              <Field label="GA Measurement ID" value={s.seo?.gaMeasurementId} onChange={(v) => set("seo.gaMeasurementId", v)} placeholder="G-XXXXXXXXXX" />
            </div>
            <label className="adm-field">
              Default Description
              <textarea value={s.seo?.defaultDescription || ""} rows={3} onChange={(e) => set("seo.defaultDescription", e.target.value)} placeholder="Official website of Anita Prajapat…" />
            </label>
            <div className="adm-field">
              <label>OG / Share Image <small>(1200×630 recommended)</small></label>
              <ImageUploader value={s.seo?.ogImage ? { url: s.seo.ogImage } : null} onChange={(m) => set("seo.ogImage", m?.url || "")} folder="seo" />
            </div>
          </section>

          {/* ── Music ── */}
          <section id="music" ref={ref("music")} className={styles.card}>
            <SectionHead Icon={Music2} title="Background Music" desc="Soft devotional music played site-wide. Leave empty to disable." />
            <div className="adm-field">
              <AudioUploader value={s.backgroundMusic ? { url: s.backgroundMusic } : null} onChange={(m) => set("backgroundMusic", m?.url || "")} folder="audio" />
            </div>
          </section>

          {/* ── Bento ── */}
          <section id="bento" ref={ref("bento")} className={styles.card}>
            <SectionHead Icon={LayoutGrid} title="Bento Section" desc="Homepage highlight grid below the hero — all tiles editable here." />
            <div className={styles.grid2}>
              <Field label="Video chip label" value={s.bento?.featureChip} onChange={(v) => set("bento.featureChip", v)} />
              <Field label="Shows stat label" value={s.bento?.statLabel} onChange={(v) => set("bento.statLabel", v)} />
              <Field label="Book tile title" value={s.bento?.bookTitle} onChange={(v) => set("bento.bookTitle", v)} />
              <Field label="Book tile CTA text" value={s.bento?.bookCta} onChange={(v) => set("bento.bookCta", v)} />
              <Field label="Repertoire label" value={s.bento?.repertoireLabel} onChange={(v) => set("bento.repertoireLabel", v)} />
              <Field label="YouTube tile title" value={s.bento?.youtubeTitle} onChange={(v) => set("bento.youtubeTitle", v)} />
              <Field label="YouTube tile subtitle" value={s.bento?.youtubeSubtitle} onChange={(v) => set("bento.youtubeSubtitle", v)} />
              <Field label="Portrait location tag" value={s.bento?.portraitTag} onChange={(v) => set("bento.portraitTag", v)} />
              <Field label="Story chip" value={s.bento?.storyChip} onChange={(v) => set("bento.storyChip", v)} />
              <Field label="Story title" value={s.bento?.storyTitle} onChange={(v) => set("bento.storyTitle", v)} />
              <Field label="Story link label" value={s.bento?.storyLinkLabel} onChange={(v) => set("bento.storyLinkLabel", v)} />
              <Field label="Story link URL" value={s.bento?.storyHref} error={errors["bento.storyHref"]} onChange={(v) => set("bento.storyHref", v)} />
            </div>
            <div className={styles.grid2}>
              <label className="adm-field">
                Story description
                <textarea value={s.bento?.storyDescription || ""} rows={3} onChange={(e) => set("bento.storyDescription", e.target.value)} />
              </label>
              <label className="adm-field">
                Repertoire items <small>(one per line)</small>
                <textarea
                  value={(s.bento?.repertoireItems || []).join("\n")} rows={6}
                  onChange={(e) => set("bento.repertoireItems", e.target.value.split("\n").map((l) => l.trim()).filter(Boolean))}
                />
              </label>
            </div>
            <div className="adm-field">
              <label>Portrait image <small>(bento tile)</small></label>
              <ImageUploader value={s.bento?.portraitImage ? { url: s.bento.portraitImage } : null} onChange={(m) => set("bento.portraitImage", m?.url || "")} folder="bento" />
            </div>
          </section>

          {/* ── Featured video ── */}
          <section id="featured" ref={ref("featured")} className={styles.card}>
            <SectionHead Icon={ImageIcon} title="Featured Video" desc="Shown in the homepage bento card. Thumbnail, duration & title auto-fetched from YouTube." />
            <div className={styles.grid2}>
              <Field label="YouTube Video URL" value={s.featuredVideo} error={errors.featuredVideo} onChange={(v) => set("featuredVideo", v)} placeholder="https://youtu.be/..." />
              <Field label="Custom Title (optional)" value={s.featuredVideoTitle} onChange={(v) => set("featuredVideoTitle", v)} placeholder="Leave blank to use YouTube title" />
            </div>
            {youtubeId(s.featuredVideo) && (
              <div className={styles.ytPreview}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.ytimg.com/vi/${youtubeId(s.featuredVideo)}/hqdefault.jpg`} alt="YouTube thumbnail preview" loading="lazy" />
                <div className={styles.ytMeta}>
                  <Check size={14} style={{ color: "#22c55e" }} aria-hidden />
                  <span>Thumbnail auto-fetched from YouTube. Title &amp; duration load on site.</span>
                </div>
              </div>
            )}
          </section>

        </div>{/* /sections */}
      </div>{/* /layout */}
    </form>
  );
}

// ── Sub-components ──────────────────────────────────────────

function SectionHead({ Icon, title, desc }) {
  return (
    <div className={styles.sectionHead}>
      <span className={styles.sectionIcon}><Icon size={16} aria-hidden /></span>
      <div>
        <h2>{title}</h2>
        {desc && <p>{desc}</p>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required = false, error = "", placeholder = "", type = "text", className = "" }) {
  return (
    <label className={`adm-field ${className}`}>
      {/* Wrap label + * in one span so they stay on the same line (flex-column parent) */}
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
        {label}
        {required && <span style={{ color: "var(--magenta)", lineHeight: 1 }}>*</span>}
      </span>
      <input type={type} value={value || ""} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} />
      {error && <small style={{ color: "#ff8a85" }}>{error}</small>}
    </label>
  );
}

// ── Helpers ─────────────────────────────────────────────────

function validateSettings(settings) {
  const errors = {};
  for (const [path, lbl] of [["siteName","Site Name"],["phone","Phone"],["whatsapp","WhatsApp"],["email","Email"]]) {
    const v = getPath(settings, path);
    if (!v || !String(v).trim()) errors[path] = `${lbl} is required`;
  }
  if (settings?.email && !/^\S+@\S+\.\S+$/.test(settings.email)) errors.email = "Enter a valid email";
  if (settings?.whatsapp && !/^\d{8,15}$/.test(String(settings.whatsapp).trim())) errors.whatsapp = "WhatsApp must be digits only (8–15)";
  const featured = settings?.featuredVideo?.trim();
  if (featured && !youtubeId(featured)) errors.featuredVideo = "Enter a valid YouTube link";
  for (const path of ["bento.storyHref","social.youtube","social.instagram","social.facebook","social.pinterest"]) {
    const v = getPath(settings, path);
    if (!v || !String(v).trim()) continue;
    if (path === "bento.storyHref" && String(v).startsWith("/")) continue;
    if (!isValidHttpUrl(v)) errors[path] = "Enter a complete https:// URL";
  }
  return errors;
}

function getPath(obj, path) { return path.split(".").reduce((a, k) => a?.[k], obj); }
function setPath(obj, path, value) {
  const keys = path.split("."); let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) { cur[keys[i]] = cur[keys[i]] || {}; cur = cur[keys[i]]; }
  cur[keys.at(-1)] = value;
}
function sanitizeSettings(settings) {
  const next = structuredClone(settings);
  for (const path of ["bento.portraitImage","seo.ogImage"]) {
    const v = getPath(next, path);
    if (v && !isValidHttpUrl(v)) setPath(next, path, "");
  }
  return next;
}
function isValidHttpUrl(value) {
  try { const u = new URL(String(value).trim()); return (u.protocol === "http:" || u.protocol === "https:") && u.hostname.includes("."); }
  catch { return false; }
}
