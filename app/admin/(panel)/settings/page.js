"use client";

import { useEffect, useState } from "react";
import api from "@/services/apiClient";
import ImageUploader from "@/components/admin/ImageUploader";
import AudioUploader from "@/components/admin/AudioUploader";
import { mergeBento } from "@/lib/bentoDefaults";
import { youtubeId } from "@/utils/helpers";
import styles from "./settings.module.scss";

const FIELD_LABELS = {
  siteName: "Site Name",
  phone: "Phone",
  whatsapp: "WhatsApp",
  email: "Email",
  featuredVideo: "YouTube Video URL",
  "bento.storyHref": "Story link URL",
  "bento.portraitImage": "Portrait image URL",
  "social.youtube": "YouTube",
  "social.instagram": "Instagram",
  "social.facebook": "Facebook",
  "social.pinterest": "Pinterest",
  "seo.ogImage": "OG Image URL",
};

export default function SettingsPage() {
  const [s, setS] = useState(null);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [syncing, setSyncing] = useState(false);
  const [syncReport, setSyncReport] = useState(null);

  useEffect(() => {
    api.get("/settings")
      .then((res) => setS({ ...res.data, bento: mergeBento(res.data) }))
      .catch((e) => setStatus(e.message));
  }, []);

  const set = (path, value) => {
    setErrors((prev) => {
      if (!prev[path]) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
    setS((prev) => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) {
        cur[keys[i]] = cur[keys[i]] || {};
        cur = cur[keys[i]];
      }
      cur[keys.at(-1)] = value;
      return next;
    });
  };

  const save = async (e) => {
    e.preventDefault();
    const payload = sanitizeSettings(s);
    const nextErrors = validateSettings(payload);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus("Please fix validation errors.");
      return;
    }
    setErrors({});
    setStatus("saving");
    try {
      await api.put("/settings", payload);
      setS(payload);
      setStatus("saved");
      setTimeout(() => setStatus(""), 2500);
    } catch (e2) {
      setStatus(e2.message);
    }
  };

  const syncCounters = async () => {
    setSyncing(true);
    setStatus("");
    try {
      const res = await api.post("/admin/social-sync");
      setS({ ...res.data, bento: mergeBento(res.data) });
      setSyncReport(res.report || null);
      setStatus("Social counters synced.");
    } catch (e2) {
      setStatus(e2.message);
    } finally {
      setSyncing(false);
    }
  };

  if (!s) {
    return (
      <div className={styles.skeletonWrap} aria-label="Loading settings">
        <div className={styles.skeletonHead} />
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
        <div className={styles.skeletonCard} />
      </div>
    );
  }

  return (
    <form onSubmit={save}>
      <div className={styles.head}>
        <h1>Site Settings</h1>
        <button className="adm-btn primary" type="submit">
          {status === "saving" ? "Saving…" : status === "saved" ? "Saved ✓" : "Save changes"}
        </button>
      </div>

      {Object.keys(errors).length > 0 && (
        <div className={styles.errorBox} role="alert">
          <strong>Please fix these fields:</strong>
          <ul>
            {Object.entries(errors).map(([key, msg]) => (
              <li key={key}>
                {FIELD_LABELS[key] || key}: {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      <section className={styles.card}>
        <h2>Branding</h2>
        <div className={styles.grid}>
          <Field
            label="Site Name"
            value={s.siteName}
            required
            error={errors.siteName}
            onChange={(v) => set("siteName", v)}
          />
          <Field label="Tagline" value={s.tagline} onChange={(v) => set("tagline", v)} />
        </div>
        <div className="adm-field">
          <label>Logo (square, 1:1 — upload an image)</label>
          <ImageUploader
            value={s.logo ? { url: s.logo } : null}
            onChange={(media) => set("logo", media?.url || "")}
            folder="branding"
          />
        </div>
        <div className="adm-field">
          <label>Artist Photo (square, 1:1 — shown on Home &amp; About)</label>
          <ImageUploader
            value={s.artistImage ? { url: s.artistImage } : null}
            onChange={(media) => set("artistImage", media?.url || "")}
            folder="branding"
          />
        </div>
      </section>

      <section className={styles.card}>
        <h2>Featured Video (Bento)</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
          Paste a YouTube link — thumbnail, duration & title load automatically on the site.
          Leave title blank to use the YouTube video name.
        </p>
        <div className={styles.grid}>
          <Field
            label="YouTube Video URL"
            value={s.featuredVideo}
            error={errors.featuredVideo}
            onChange={(v) => set("featuredVideo", v)}
          />
          <Field
            label="Custom Title (optional override)"
            value={s.featuredVideoTitle}
            onChange={(v) => set("featuredVideoTitle", v)}
          />
        </div>
      </section>

      <section className={styles.card}>
        <h2>Background Music</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
          Soft devotional music played site-wide. Upload an audio file (a short
          ~1–2 min loop, under 8 MB is ideal). Leave empty to turn music off.
          It starts on the visitor&apos;s first tap/scroll (browser rule), loops
          softly, pauses when the tab is hidden, and visitors can mute it anytime.
        </p>
        <div className="adm-field">
          <label>Background Music (audio file)</label>
          <AudioUploader
            value={s.backgroundMusic ? { url: s.backgroundMusic } : null}
            onChange={(media) => set("backgroundMusic", media?.url || "")}
            folder="audio"
          />
        </div>
      </section>

      <section className={styles.card}>
        <h2>Bento Section</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "0.75rem", fontSize: "0.9rem" }}>
          Homepage grid below the hero — all tiles editable here.
        </p>
        <div className={styles.grid}>
          <Field
            label="Video chip label"
            value={s.bento?.featureChip}
            onChange={(v) => set("bento.featureChip", v)}
          />
          <Field
            label="Shows stat label"
            value={s.bento?.statLabel}
            onChange={(v) => set("bento.statLabel", v)}
          />
          <Field
            label="Book tile title"
            value={s.bento?.bookTitle}
            onChange={(v) => set("bento.bookTitle", v)}
          />
          <Field
            label="Book tile CTA text"
            value={s.bento?.bookCta}
            onChange={(v) => set("bento.bookCta", v)}
          />
          <Field
            label="Repertoire label"
            value={s.bento?.repertoireLabel}
            onChange={(v) => set("bento.repertoireLabel", v)}
          />
          <Field
            label="YouTube tile title"
            value={s.bento?.youtubeTitle}
            onChange={(v) => set("bento.youtubeTitle", v)}
          />
          <Field
            label="YouTube tile subtitle"
            value={s.bento?.youtubeSubtitle}
            onChange={(v) => set("bento.youtubeSubtitle", v)}
          />
          <Field
            label="Portrait location tag"
            value={s.bento?.portraitTag}
            onChange={(v) => set("bento.portraitTag", v)}
          />
          <Field
            label="Story chip"
            value={s.bento?.storyChip}
            onChange={(v) => set("bento.storyChip", v)}
          />
          <Field
            label="Story title"
            value={s.bento?.storyTitle}
            onChange={(v) => set("bento.storyTitle", v)}
          />
          <Field
            label="Story link label"
            value={s.bento?.storyLinkLabel}
            onChange={(v) => set("bento.storyLinkLabel", v)}
          />
          <Field
            label="Story link URL"
            value={s.bento?.storyHref}
            error={errors["bento.storyHref"]}
            onChange={(v) => set("bento.storyHref", v)}
          />
        </div>
        <label className="adm-field">
          Repertoire items (one per line)
          <textarea
            value={(s.bento?.repertoireItems || []).join("\n")}
            onChange={(e) =>
              set(
                "bento.repertoireItems",
                e.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean)
              )
            }
          />
        </label>
        <label className="adm-field">
          Story description
          <textarea
            value={s.bento?.storyDescription || ""}
            onChange={(e) => set("bento.storyDescription", e.target.value)}
          />
        </label>
        <div className="adm-field">
          <label>Portrait image (bento tile)</label>
          <ImageUploader
            value={s.bento?.portraitImage ? { url: s.bento.portraitImage } : null}
            onChange={(media) => set("bento.portraitImage", media?.url || "")}
            folder="bento"
          />
          {errors["bento.portraitImage"] && (
            <small style={{ color: "#ff8a85" }}>{errors["bento.portraitImage"]}</small>
          )}
        </div>
      </section>

      <section className={styles.card}>
        <h2>Contact</h2>
        <div className={styles.grid}>
          <Field label="Phone" value={s.phone} required error={errors.phone} onChange={(v) => set("phone", v)} />
          <Field label="WhatsApp (with country code)" value={s.whatsapp} required error={errors.whatsapp} onChange={(v) => set("whatsapp", v)} />
          <Field label="Email" value={s.email} required error={errors.email} onChange={(v) => set("email", v)} />
          <Field label="Manager" value={s.manager} onChange={(v) => set("manager", v)} />
          <Field label="Address" value={s.address} onChange={(v) => set("address", v)} />
        </div>
      </section>

      <section className={styles.card}>
        <h2>Social Links</h2>
        <div className={styles.grid}>
          <Field label="YouTube" value={s.social?.youtube} error={errors["social.youtube"]} onChange={(v) => set("social.youtube", v)} />
          <Field label="Instagram" value={s.social?.instagram} error={errors["social.instagram"]} onChange={(v) => set("social.instagram", v)} />
          <Field label="Facebook" value={s.social?.facebook} error={errors["social.facebook"]} onChange={(v) => set("social.facebook", v)} />
          <Field label="Pinterest" value={s.social?.pinterest} error={errors["social.pinterest"]} onChange={(v) => set("social.pinterest", v)} />
        </div>
      </section>

      <section className={styles.card}>
        <h2>Counters</h2>
        <div className={styles.counterHead}>
          <button
            type="button"
            className="adm-btn"
            onClick={syncCounters}
            disabled={syncing}
          >
            {syncing ? "Syncing..." : "Sync Now"}
          </button>
          {s.countersLastSyncedAt && (
            <small style={{ color: "var(--text-muted)" }}>
              Last synced: {new Date(s.countersLastSyncedAt).toLocaleString()}
            </small>
          )}
        </div>
        <p style={{ color: "var(--text-muted)", marginBottom: "0.7rem", fontSize: "0.9rem" }}>
          Auto sync needs env keys: YOUTUBE_API_KEY + YOUTUBE_CHANNEL_ID, INSTAGRAM_USER_ID + INSTAGRAM_ACCESS_TOKEN, FACEBOOK_PAGE_ID + FACEBOOK_ACCESS_TOKEN.
        </p>
        <div className={styles.grid}>
          <Field label="YouTube Subscribers" value={s.counters?.youtubeSubscribers} error={errors["counters.youtubeSubscribers"]} onChange={(v) => set("counters.youtubeSubscribers", v)} />
          <Field label="Instagram Followers" value={s.counters?.instagramFollowers} error={errors["counters.instagramFollowers"]} onChange={(v) => set("counters.instagramFollowers", v)} />
          <Field label="Facebook Followers" value={s.counters?.facebookFollowers} error={errors["counters.facebookFollowers"]} onChange={(v) => set("counters.facebookFollowers", v)} />
          <Field label="Stage Shows" value={s.counters?.stageShows} error={errors["counters.stageShows"]} onChange={(v) => set("counters.stageShows", v)} />
        </div>
        {syncReport && (
          <p style={{ color: "var(--text-muted)", marginTop: "0.6rem", fontSize: "0.85rem" }}>
            YouTube: {syncReport.youtubeSubscribers} · Instagram: {syncReport.instagramFollowers} · Facebook: {syncReport.facebookFollowers}
          </p>
        )}
      </section>

      <section className={styles.card}>
        <h2>Theme Colors</h2>
        <div className={styles.grid}>
          <Field label="Primary (Red)" value={s.theme?.primary} onChange={(v) => set("theme.primary", v)} />
          <Field label="Gold" value={s.theme?.gold} onChange={(v) => set("theme.gold", v)} />
          <Field label="Dark" value={s.theme?.dark} onChange={(v) => set("theme.dark", v)} />
        </div>
      </section>

      <section className={styles.card}>
        <h2>SEO Defaults</h2>
        <div className={styles.grid}>
          <Field label="Default Title" value={s.seo?.defaultTitle} onChange={(v) => set("seo.defaultTitle", v)} />
          <div className="adm-field">
            <label>OG Image (upload image)</label>
            <ImageUploader
              value={s.seo?.ogImage ? { url: s.seo.ogImage } : null}
              onChange={(media) => set("seo.ogImage", media?.url || "")}
              folder="seo"
            />
            {errors["seo.ogImage"] && (
              <small style={{ color: "#ff8a85" }}>{errors["seo.ogImage"]}</small>
            )}
          </div>
          <Field label="Google Verification" value={s.seo?.gscVerification} onChange={(v) => set("seo.gscVerification", v)} />
          <Field label="GA Measurement ID" value={s.seo?.gaMeasurementId} onChange={(v) => set("seo.gaMeasurementId", v)} />
        </div>
        <label className="adm-field">
          Default Description
          <textarea value={s.seo?.defaultDescription || ""} onChange={(e) => set("seo.defaultDescription", e.target.value)} />
        </label>
      </section>

      {status && status !== "saving" && status !== "saved" && (
        <p style={{ color: "#ff8a85" }}>{status}</p>
      )}
    </form>
  );
}

function validateSettings(settings) {
  const errors = {};
  const requiredPaths = [
    ["siteName", "Site Name"],
    ["phone", "Phone"],
    ["whatsapp", "WhatsApp"],
    ["email", "Email"],
  ];
  for (const [path, label] of requiredPaths) {
    const value = getPath(settings, path);
    if (!value || !String(value).trim()) errors[path] = `${label} is required`;
  }
  if (settings?.email && !/^\S+@\S+\.\S+$/.test(settings.email)) {
    errors.email = "Enter a valid email";
  }
  if (settings?.whatsapp && !/^\d{8,15}$/.test(String(settings.whatsapp).trim())) {
    errors.whatsapp = "WhatsApp must be digits only (8-15)";
  }

  const featured = settings?.featuredVideo?.trim();
  if (featured && !youtubeId(featured)) {
    errors.featuredVideo = "Enter a valid YouTube link (youtube.com or youtu.be)";
  }

  // Portrait & OG image are optional — invalid/partial URLs are cleared on save, not blocked.
  const optionalUrlPaths = [
    "bento.storyHref",
    "social.youtube",
    "social.instagram",
    "social.facebook",
    "social.pinterest",
  ];
  for (const path of optionalUrlPaths) {
    const value = getPath(settings, path);
    if (!value || !String(value).trim()) continue;
    if (path === "bento.storyHref" && String(value).startsWith("/")) continue;
    if (!isValidHttpUrl(value)) {
      errors[path] = "Enter a complete https:// URL or upload the image";
    }
  }

  return errors;
}

function getPath(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function setPath(obj, path, value) {
  const keys = path.split(".");
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = cur[keys[i]] || {};
    cur = cur[keys[i]];
  }
  cur[keys.at(-1)] = value;
}

/** Drop half-typed image URLs so they never block saving other settings. */
function sanitizeSettings(settings) {
  const next = structuredClone(settings);
  for (const path of ["bento.portraitImage", "seo.ogImage"]) {
    const value = getPath(next, path);
    if (value && !isValidHttpUrl(value)) setPath(next, path, "");
  }
  return next;
}

function isValidHttpUrl(value) {
  try {
    const u = new URL(String(value).trim());
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    // Reject obvious half-typed hosts (e.g. "https://res.cloudinary.c")
    if (!u.hostname.includes(".")) return false;
    return true;
  } catch {
    return false;
  }
}

function Field({ label, value, onChange, required = false, error = "" }) {
  return (
    <label className="adm-field">
      {label}{required ? " *" : ""}
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} required={required} />
      {error && <small style={{ color: "#ff8a85" }}>{error}</small>}
    </label>
  );
}
