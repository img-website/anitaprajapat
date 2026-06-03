"use client";

import { useRef, useState } from "react";
import { UploadCloud, Music, X, Loader } from "lucide-react";
import api from "@/services/apiClient";
import styles from "./Uploader.module.scss";

/**
 * Drag-and-drop audio uploader (direct-to-Cloudinary signed upload).
 * Bypasses the 4.5 MB serverless body limit for large audio files.
 */
export default function AudioUploader({ value, onChange, folder = "audio" }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("audio/")) { setErr("Please select an audio file."); return; }
    if (file.size > 25 * 1024 * 1024) { setErr("File too large (max 25 MB). A ~1–2 min loop is ideal."); return; }
    setBusy(true); setErr("");
    try {
      const { data: cfg } = await api.post("/upload/sign", { folder });
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", cfg.apiKey);
      fd.append("timestamp", String(cfg.timestamp));
      fd.append("folder", cfg.folder);
      fd.append("signature", cfg.signature);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cfg.cloudName}/auto/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Cloudinary upload failed");
      onChange({ url: data.secure_url, publicId: data.public_id, resourceType: data.resource_type, format: data.format });
    } catch (e) {
      setErr(e.data?.message || e.message || "Upload failed. Check Cloudinary config or paste a URL below.");
    } finally { setBusy(false); }
  };

  const onFileInput = (e) => upload(e.target.files?.[0]);
  const onDrop = (e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files?.[0]); };
  const clear = (e) => { e.stopPropagation(); onChange(null); setErr(""); };

  const previewUrl = typeof value === "string" ? value : value?.url;

  return (
    <div className={styles.wrap}>
      {previewUrl ? (
        <div className={styles.audioPreview}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--magenta)" }}>
            <Music size={16} aria-hidden />
            <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {value?.format ? `Audio (${value.format.toUpperCase()})` : "Background music"}
            </span>
          </div>
          <audio src={previewUrl} controls preload="none" />
          <div className={styles.audioActions}>
            <button type="button" className="adm-btn" onClick={() => inputRef.current?.click()} disabled={busy}>
              <UploadCloud size={14} aria-hidden /> Replace
            </button>
            <button type="button" className="adm-btn danger" onClick={clear}>
              <X size={14} aria-hidden /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`${styles.dropzone} ${drag ? styles.dragOver : ""} ${busy ? styles.loading : ""}`}
          onClick={() => !busy && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          role="button" tabIndex={0} aria-label="Upload audio"
          onKeyDown={(e) => e.key === "Enter" && !busy && inputRef.current?.click()}
        >
          {busy
            ? <><Loader size={24} className={styles.spin} aria-hidden /><span>Uploading…</span></>
            : <><Music size={24} aria-hidden /><span>Click or drag audio file here</span><small>MP3 · WAV · AAC · max 25 MB</small></>
          }
        </div>
      )}

      <input ref={inputRef} type="file" accept="audio/*" className={styles.hidden}
        onChange={onFileInput} disabled={busy} />

      <input
        type="url"
        placeholder="…or paste a direct audio URL (.mp3)"
        defaultValue={previewUrl || ""}
        key={previewUrl || "empty"}
        className={styles.urlInput}
        onBlur={(e) => {
          const url = e.target.value.trim();
          if (url) onChange({ ...(value || {}), url });
        }}
      />

      {err && <small className={styles.err}>{err}</small>}
    </div>
  );
}
