"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Check, Loader } from "lucide-react";
import api from "@/services/apiClient";
import styles from "./GalleryBulkUpload.module.scss";

// State for each selected image
// { file, previewUrl, status: idle|uploading|done|error, cloudinary, title, alt, error }

async function signedUpload(file, apiKey, cloudName, timestamp, signature, folder) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", apiKey);
  fd.append("timestamp", timestamp);
  fd.append("folder", folder);
  fd.append("signature", signature);
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: fd }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error?.message || "Upload failed");
  return { url: data.secure_url, publicId: data.public_id, width: data.width, height: data.height };
}

export default function GalleryBulkUpload({ onDone }) {
  const inputRef = useRef(null);
  const [items, setItems] = useState([]); // per-image state
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const update = (idx, patch) =>
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));

  const addFiles = (files) => {
    const newItems = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 50)
      .map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        status: "idle",
        cloudinary: null,
        title: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
        alt: "",
        error: "",
      }));
    setItems((prev) => [...prev, ...newItems].slice(0, 50));
    setSaved(false);
  };

  const remove = (idx) =>
    setItems((prev) => {
      URL.revokeObjectURL(prev[idx].previewUrl);
      return prev.filter((_, i) => i !== idx);
    });

  // Upload all idle items to Cloudinary
  const uploadAll = async () => {
    const pending = items.filter((it) => it.status === "idle");
    if (!pending.length) return;

    // Get one signature (folder is the same for all)
    let cfg;
    try {
      const { data } = await api.post("/upload/sign", { folder: "gallery" });
      cfg = data;
    } catch {
      setItems((prev) =>
        prev.map((it) =>
          it.status === "idle" ? { ...it, status: "error", error: "Signature fetch failed" } : it
        )
      );
      return;
    }

    // Upload concurrently (max 5 at a time to stay friendly to Cloudinary limits)
    const concurrency = 5;
    const idleIndexes = items.reduce((acc, it, i) => (it.status === "idle" ? [...acc, i] : acc), []);

    setItems((prev) =>
      prev.map((it) => (it.status === "idle" ? { ...it, status: "uploading" } : it))
    );

    async function uploadBatch(indexes) {
      await Promise.all(
        indexes.map(async (idx) => {
          const it = items[idx];
          try {
            const cl = await signedUpload(
              it.file,
              cfg.apiKey,
              cfg.cloudName,
              cfg.timestamp,
              cfg.signature,
              cfg.folder
            );
            update(idx, { status: "done", cloudinary: cl, error: "" });
          } catch (e) {
            update(idx, { status: "error", error: e.message });
          }
        })
      );
    }

    for (let i = 0; i < idleIndexes.length; i += concurrency) {
      await uploadBatch(idleIndexes.slice(i, i + concurrency));
    }
  };

  // Save all uploaded images to the gallery DB
  const saveAll = async () => {
    const done = items.filter((it) => it.status === "done" && it.cloudinary);
    if (!done.length) return;
    setSaving(true);
    try {
      const payload = done.map((it) => ({
        title: it.title.trim() || it.file.name,
        image: { ...it.cloudinary, alt: it.alt.trim() },
        isFeatured: false,
        isActive: true,
      }));
      await api.post("/gallery/bulk", payload);
      setSaved(true);
      // Remove saved items, keep errors
      setItems((prev) => prev.filter((it) => it.status !== "done"));
      if (onDone) onDone();
    } catch (e) {
      alert("Save failed: " + (e.data?.message || e.message));
    } finally {
      setSaving(false);
    }
  };

  const readyToUpload = items.some((it) => it.status === "idle");
  const readyToSave = items.some((it) => it.status === "done");
  const anyUploading = items.some((it) => it.status === "uploading");

  return (
    <div className={styles.wrap}>
      {/* Drop zone */}
      <div
        className={`${styles.drop} ${dragOver ? styles.over : ""}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        role="button"
        tabIndex={0}
        aria-label="Click or drop images here"
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
      >
        <UploadCloud size={32} aria-hidden />
        <p><strong>Click or drag &amp; drop images here</strong></p>
        <p className={styles.hint}>Select multiple at once — JPG, PNG, WebP — max 50</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className={styles.hidden}
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {/* Actions */}
      {items.length > 0 && (
        <div className={styles.actions}>
          <span className={styles.count}>{items.length} image{items.length !== 1 ? "s" : ""} selected</span>
          <div className={styles.btns}>
            {readyToUpload && (
              <button
                type="button"
                className="btn btn-outline"
                onClick={uploadAll}
                disabled={anyUploading}
              >
                {anyUploading ? <><Loader size={15} className={styles.spin} /> Uploading…</> : "Upload all"}
              </button>
            )}
            {readyToSave && (
              <button
                type="button"
                className="btn btn-gold"
                onClick={saveAll}
                disabled={saving || anyUploading}
              >
                {saving ? <><Loader size={15} className={styles.spin} /> Saving…</> : `Save ${items.filter((i) => i.status === "done").length} to gallery`}
              </button>
            )}
          </div>
        </div>
      )}

      {saved && (
        <p className={styles.success}>
          <Check size={16} /> Images saved to gallery!
        </p>
      )}

      {/* Preview grid with editable title + alt */}
      {items.length > 0 && (
        <div className={styles.grid}>
          {items.map((it, idx) => (
            <div key={idx} className={`${styles.card} ${styles[it.status]}`}>
              <div className={styles.imgWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.previewUrl} alt={it.alt || it.title} />
                <button
                  type="button"
                  className={styles.del}
                  onClick={() => remove(idx)}
                  aria-label="Remove image"
                  title="Remove"
                >
                  <X size={14} />
                </button>
                <span className={styles.badge}>
                  {it.status === "uploading" && <><Loader size={12} className={styles.spin} /> Uploading</>}
                  {it.status === "done" && <><Check size={12} /> Uploaded</>}
                  {it.status === "error" && <span title={it.error}>Error</span>}
                </span>
              </div>
              <input
                type="text"
                placeholder="Title *"
                value={it.title}
                onChange={(e) => update(idx, { title: e.target.value })}
                className={styles.field}
              />
              <input
                type="text"
                placeholder="Alt text (describe the image)"
                value={it.alt}
                onChange={(e) => update(idx, { alt: e.target.value })}
                className={styles.field}
              />
              {it.error && <small className={styles.err}>{it.error}</small>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
