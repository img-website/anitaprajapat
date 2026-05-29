"use client";

import { useState } from "react";
import api from "@/services/apiClient";

// Uploads an audio file to Cloudinary via /api/upload (resource_type: auto)
// and returns a media object { url, publicId, ... }. Also supports pasting a
// direct audio URL. Shows an <audio> preview so the admin can hear it.
export default function AudioUploader({ value, onChange, folder = "audio" }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Audio files can be large, so upload DIRECTLY to Cloudinary (multipart),
    // not through our API as base64 (which hits the ~4.5 MB serverless limit).
    if (file.size > 25 * 1024 * 1024) {
      setErr("File too large (max 25 MB). A short ~1–2 min loop is ideal.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const { data: cfg } = await api.post("/upload/sign", { folder });
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", cfg.apiKey);
      fd.append("timestamp", cfg.timestamp);
      fd.append("folder", cfg.folder);
      fd.append("signature", cfg.signature);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cfg.cloudName}/auto/upload`,
        { method: "POST", body: fd }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Cloudinary upload failed");

      onChange({
        url: data.secure_url,
        publicId: data.public_id,
        resourceType: data.resource_type,
        format: data.format,
      });
    } catch (e2) {
      setErr(e2.data?.message || e2.message || "Upload failed. Configure Cloudinary on the server, or paste a URL.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {value?.url && (
        <audio
          src={value.url}
          controls
          preload="none"
          style={{ display: "block", width: "100%", maxWidth: 320, marginBottom: 8 }}
        />
      )}
      <input type="file" accept="audio/*" onChange={handleFile} disabled={busy} />
      <input
        type="text"
        placeholder="…or paste a direct audio URL (.mp3)"
        defaultValue={value?.url || ""}
        key={value?.url || "empty"}
        onBlur={(e) => {
          const url = e.target.value.trim();
          onChange(url ? { ...(value || {}), url } : null);
        }}
        style={{ marginTop: 6 }}
      />
      {value?.url && (
        <div style={{ marginTop: 6 }}>
          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => onChange(null)}
          >
            Remove music
          </button>
        </div>
      )}
      {busy && <small style={{ color: "var(--gold)" }}>Uploading…</small>}
      {err && <small style={{ color: "#ff8a85" }}>{err}</small>}
    </div>
  );
}
