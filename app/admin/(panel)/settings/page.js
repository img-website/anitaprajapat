"use client";

import { useEffect, useState } from "react";
import api from "@/services/apiClient";
import ImageUploader from "@/components/admin/ImageUploader";
import styles from "./settings.module.scss";

export default function SettingsPage() {
  const [s, setS] = useState(null);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const [syncing, setSyncing] = useState(false);
  const [syncReport, setSyncReport] = useState(null);

  useEffect(() => {
    api.get("/settings").then((res) => setS(res.data)).catch((e) => setStatus(e.message));
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
    const nextErrors = validateSettings(s);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus("Please fix validation errors.");
      return;
    }
    setErrors({});
    setStatus("saving");
    try {
      await api.put("/settings", s);
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
      setS(res.data);
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
      </section>

      <section className={styles.card}>
        <h2>Featured Video</h2>
        <div className={styles.grid}>
          <Field
            label="Featured YouTube URL (homepage highlight card)"
            value={s.featuredVideo}
            error={errors.featuredVideo}
            onChange={(v) => set("featuredVideo", v)}
          />
          <Field
            label="Featured Video Title"
            value={s.featuredVideoTitle}
            onChange={(v) => set("featuredVideoTitle", v)}
          />
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
  const optionalUrlPaths = [
    "featuredVideo",
    "social.youtube",
    "social.instagram",
    "social.facebook",
    "social.pinterest",
  ];
  for (const path of optionalUrlPaths) {
    const value = getPath(settings, path);
    if (value && !isValidUrl(value)) errors[path] = "Enter a valid URL";
  }
  const optionalCountPaths = [
    "counters.youtubeSubscribers",
    "counters.instagramFollowers",
    "counters.facebookFollowers",
    "counters.stageShows",
  ];
  for (const path of optionalCountPaths) {
    const value = getPath(settings, path);
    if (value && !/^[\d,+ ]+$/.test(String(value).trim())) {
      errors[path] = "Use only numbers, comma, plus";
    }
  }
  return errors;
}

function getPath(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function isValidUrl(value) {
  try {
    new URL(value);
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
