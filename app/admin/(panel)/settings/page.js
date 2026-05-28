"use client";

import { useEffect, useState } from "react";
import api from "@/services/apiClient";
import ImageUploader from "@/components/admin/ImageUploader";
import styles from "./settings.module.scss";

export default function SettingsPage() {
  const [s, setS] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/settings").then((res) => setS(res.data)).catch((e) => setStatus(e.message));
  }, []);

  const set = (path, value) => {
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
    setStatus("saving");
    try {
      await api.put("/settings", s);
      setStatus("saved");
      setTimeout(() => setStatus(""), 2500);
    } catch (e2) {
      setStatus(e2.message);
    }
  };

  if (!s) return <p style={{ color: "var(--text-muted)" }}>Loading settings…</p>;

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
          <Field label="Site Name" value={s.siteName} onChange={(v) => set("siteName", v)} />
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
          <Field label="Phone" value={s.phone} onChange={(v) => set("phone", v)} />
          <Field label="WhatsApp (with country code)" value={s.whatsapp} onChange={(v) => set("whatsapp", v)} />
          <Field label="Email" value={s.email} onChange={(v) => set("email", v)} />
          <Field label="Manager" value={s.manager} onChange={(v) => set("manager", v)} />
          <Field label="Address" value={s.address} onChange={(v) => set("address", v)} />
        </div>
      </section>

      <section className={styles.card}>
        <h2>Social Links</h2>
        <div className={styles.grid}>
          <Field label="YouTube" value={s.social?.youtube} onChange={(v) => set("social.youtube", v)} />
          <Field label="Instagram" value={s.social?.instagram} onChange={(v) => set("social.instagram", v)} />
          <Field label="Facebook" value={s.social?.facebook} onChange={(v) => set("social.facebook", v)} />
          <Field label="Pinterest" value={s.social?.pinterest} onChange={(v) => set("social.pinterest", v)} />
        </div>
      </section>

      <section className={styles.card}>
        <h2>Counters</h2>
        <div className={styles.grid}>
          <Field label="YouTube Subscribers" value={s.counters?.youtubeSubscribers} onChange={(v) => set("counters.youtubeSubscribers", v)} />
          <Field label="Instagram Followers" value={s.counters?.instagramFollowers} onChange={(v) => set("counters.instagramFollowers", v)} />
          <Field label="Facebook Followers" value={s.counters?.facebookFollowers} onChange={(v) => set("counters.facebookFollowers", v)} />
          <Field label="Stage Shows" value={s.counters?.stageShows} onChange={(v) => set("counters.stageShows", v)} />
        </div>
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
          <Field label="OG Image URL" value={s.seo?.ogImage} onChange={(v) => set("seo.ogImage", v)} />
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

function Field({ label, value, onChange }) {
  return (
    <label className="adm-field">
      {label}
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
