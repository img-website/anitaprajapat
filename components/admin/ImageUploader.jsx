"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader } from "lucide-react";
import api from "@/services/apiClient";
import styles from "./Uploader.module.scss";

/**
 * Drag-and-drop image uploader.
 * Uploads to Cloudinary via /api/upload and returns { url, publicId, ... }.
 */
export default function ImageUploader({ value, onChange, folder = "anitaprajapat" }) {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);

  const upload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { setErr("Please select an image file."); return; }
    setBusy(true); setErr("");
    try {
      const dataUri = await new Promise((res, rej) => {
        const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej;
        r.readAsDataURL(file);
      });
      const res = await api.post("/upload", { file: dataUri, folder });
      onChange(res.data);
    } catch (e) {
      setErr(e.data?.message || "Upload failed. Check Cloudinary config or paste a URL below.");
    } finally { setBusy(false); }
  };

  const onFileInput = (e) => upload(e.target.files?.[0]);
  const onDrop = (e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files?.[0]); };
  const clear = (e) => { e.stopPropagation(); onChange(null); setErr(""); };

  const previewUrl = typeof value === "string" ? value : value?.url;

  return (
    <div className={styles.wrap}>
      {previewUrl ? (
        <div
          className={styles.preview}
          onClick={() => inputRef.current?.click()}
          role="button" tabIndex={0}
          title="Click to replace"
          aria-label="Replace image"
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        >
          <Image src={previewUrl} alt="Upload preview" fill sizes="(max-width:640px) 100vw, 260px"
            className={styles.previewImg} />
          <div className={styles.previewOverlay}>
            <UploadCloud size={18} aria-hidden /> Replace
          </div>
          <button type="button" className={styles.clearBtn} onClick={clear}
            aria-label="Remove image" title="Remove">
            <X size={13} aria-hidden />
          </button>
        </div>
      ) : (
        <div
          className={`${styles.dropzone} ${drag ? styles.dragOver : ""} ${busy ? styles.loading : ""}`}
          onClick={() => !busy && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          role="button" tabIndex={0} aria-label="Upload image"
          onKeyDown={(e) => e.key === "Enter" && !busy && inputRef.current?.click()}
        >
          {busy
            ? <><Loader size={24} className={styles.spin} aria-hidden /><span>Uploading…</span></>
            : <><UploadCloud size={24} aria-hidden /><span>Click or drag &amp; drop</span><small>JPG · PNG · WebP</small></>
          }
        </div>
      )}

      <input ref={inputRef} type="file" accept="image/*" className={styles.hidden}
        onChange={onFileInput} disabled={busy} />

      {/* URL fallback */}
      <input
        type="url"
        placeholder="…or paste image URL"
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
