"use client";

import { useState } from "react";
import api from "@/services/apiClient";

// Uploads to Cloudinary via /api/upload and returns a media object
// { url, publicId, width, height }. Falls back to manual URL entry.
export default function ImageUploader({ value, onChange, folder = "anitaprajapat" }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value.url}
          alt="preview"
          style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8, marginBottom: 8, border: "0.0625rem solid var(--border)" }}
        />
      )}
      <input type="file" accept="image/*,video/*" onChange={handleFile} disabled={busy} />
      <input
        type="text"
        placeholder="…or paste image URL"
        value={value?.url || ""}
        onChange={(e) => onChange({ ...(value || {}), url: e.target.value })}
        style={{ marginTop: 6 }}
      />
      {busy && <small style={{ color: "var(--gold)" }}>Uploading…</small>}
      {err && <small style={{ color: "#ff8a85" }}>{err}</small>}
    </div>
  );
}
