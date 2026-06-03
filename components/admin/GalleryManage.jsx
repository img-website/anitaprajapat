"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Star, StarOff, Loader, Inbox, X, Check } from "lucide-react";
import api from "@/services/apiClient";
import ImageUploader from "./ImageUploader";
import styles from "./GalleryManage.module.scss";

export default function GalleryManage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // full item object
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/gallery?limit=200&sort=-createdAt");
      setItems(res.data || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const openEdit = (item) => {
    setForm({
      title: item.title || "",
      alt: item.image?.alt || "",
      image: item.image || null,
      isFeatured: item.isFeatured || false,
      isActive: item.isActive !== false,
      order: item.order ?? 0,
    });
    setErr("");
    setEditing(item);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErr("");
    try {
      const payload = {
        title: form.title,
        image: { ...(form.image || {}), alt: form.alt },
        isFeatured: form.isFeatured,
        isActive: form.isActive,
        order: Number(form.order) || 0,
      };
      await api.put(`/gallery/${editing._id}`, payload);
      setEditing(null);
      await load();
    } catch (e2) {
      setErr(e2.data?.message || e2.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!confirm(`Delete "${item.title || "this photo"}"? Cannot be undone.`)) return;
    try {
      await api.del(`/gallery/${item._id}`);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
    } catch (e) {
      alert(e.message);
    }
  };

  const toggleFeatured = async (item) => {
    try {
      await api.put(`/gallery/${item._id}`, { isFeatured: !item.isFeatured });
      setItems((prev) =>
        prev.map((i) => (i._id === item._id ? { ...i, isFeatured: !i.isFeatured } : i))
      );
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading)
    return (
      <div className={styles.skeletonGrid}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    );

  if (!items.length)
    return (
      <div className={styles.empty}>
        <Inbox size={28} aria-hidden />
        <p>No photos yet. Use Bulk Upload to add some.</p>
      </div>
    );

  return (
    <>
      <p className={styles.meta}>{items.length} photo{items.length !== 1 ? "s" : ""}</p>

      <div className={styles.grid}>
        {items.map((item) => {
          const src = item.image?.url;
          return (
            <div key={item._id} className={`${styles.card} ${!item.isActive ? styles.inactive : ""}`}>
              <div className={styles.imgWrap}>
                {src ? (
                  <Image
                    src={src}
                    alt={item.image?.alt || item.title || "Gallery photo"}
                    fill
                    sizes="(max-width:48rem) 45vw, (max-width:72rem) 22vw, 160px"
                    className={styles.img}
                  />
                ) : (
                  <div className={styles.noImg}>No image</div>
                )}

                {/* Hover overlay */}
                <div className={styles.overlay}>
                  <button
                    type="button"
                    className={styles.act}
                    onClick={() => openEdit(item)}
                    title="Edit"
                    aria-label="Edit photo"
                  >
                    <Pencil size={15} aria-hidden />
                  </button>
                  <button
                    type="button"
                    className={`${styles.act} ${item.isFeatured ? styles.featured : ""}`}
                    onClick={() => toggleFeatured(item)}
                    title={item.isFeatured ? "Unfeature" : "Feature"}
                    aria-label={item.isFeatured ? "Remove from featured" : "Mark as featured"}
                  >
                    {item.isFeatured ? <Star size={15} fill="currentColor" aria-hidden /> : <StarOff size={15} aria-hidden />}
                  </button>
                  <button
                    type="button"
                    className={`${styles.act} ${styles.del}`}
                    onClick={() => remove(item)}
                    title="Delete"
                    aria-label="Delete photo"
                  >
                    <Trash2 size={15} aria-hidden />
                  </button>
                </div>

                {item.isFeatured && (
                  <span className={styles.featBadge} title="Featured">
                    <Star size={11} fill="currentColor" aria-hidden />
                  </span>
                )}
                {!item.isActive && (
                  <span className={styles.hiddenBadge}>Hidden</span>
                )}
              </div>

              <p className={styles.title} title={item.title}>{item.title || <em>Untitled</em>}</p>
            </div>
          );
        })}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className={styles.backdrop} onClick={() => setEditing(null)}>
          <form
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            onSubmit={save}
          >
            <div className={styles.modalHead}>
              <h2>Edit Photo</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close" title="Close">
                <X size={18} aria-hidden />
              </button>
            </div>

            {/* Current image preview */}
            {editing.image?.url && (
              <div className={styles.preview}>
                <Image
                  src={editing.image.url}
                  alt={editing.image?.alt || editing.title}
                  width={200}
                  height={200}
                  sizes="200px"
                  className={styles.previewImg}
                />
              </div>
            )}

            <div className={styles.fields}>
              <label className="adm-field">
                Title *
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </label>
              <label className="adm-field">
                Alt text <small>(describe the image for SEO &amp; accessibility)</small>
                <input
                  type="text"
                  value={form.alt}
                  onChange={(e) => setForm((f) => ({ ...f, alt: e.target.value }))}
                  placeholder="e.g. Anita Prajapat performing at Jagran stage"
                />
              </label>
              <div className={styles.row}>
                <label className="adm-field">
                  Order
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                  />
                </label>
                <label className="adm-field">
                  Featured
                  <select
                    value={form.isFeatured ? "true" : "false"}
                    onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.value === "true" }))}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </label>
                <label className="adm-field">
                  Visible
                  <select
                    value={form.isActive ? "true" : "false"}
                    onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.value === "true" }))}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No (hidden)</option>
                  </select>
                </label>
              </div>
              <div className="adm-field">
                <label>Replace image (optional)</label>
                <ImageUploader
                  value={form.image}
                  onChange={(v) => setForm((f) => ({ ...f, image: v }))}
                  folder="gallery"
                />
              </div>
            </div>

            {err && <p style={{ color: "#ff8a85", margin: "0.5rem 0 0" }}>{err}</p>}

            <div className={styles.modalFoot}>
              <button type="button" className="adm-btn" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button type="submit" className="adm-btn primary" disabled={saving}>
                {saving ? <><Loader size={14} className={styles.spin} /> Saving…</> : <><Check size={14} /> Save</>}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
