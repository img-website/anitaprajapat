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
    // Keep uploads small — base64 goes through the request body (~4MB host limit).
    if (file.size > 8 * 1024 * 1024) {
      setErr("File too large. Please use an audio file under 8 MB (a short ~1–2 min loop is ideal).");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const dataUri = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const res = await api.post("/upload", { file: dataUri, folder });
      onChange(res.data);
    } catch (e2) {
      setErr(e2.data?.message || "Upload failed. Configure Cloudinary or paste a URL.");
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
