"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/services/apiClient";
import ImageUploader from "./ImageUploader";
import styles from "./ResourceManager.module.scss";

/**
 * Config-driven CRUD UI for any REST resource.
 *
 * config = {
 *   resource: "bhajans",          // API path under /api
 *   label: "Bhajan",
 *   columns: [{ key, label, render? }],
 *   fields: [{ name, label, type, options?, required?, full? }],
 *   defaults: {}                  // default new-record shape
 * }
 *
 * Supported field types: text, textarea, number, boolean, select,
 * image, tags (comma string -> array), date.
 */
export default function ResourceManager({ config }) {
  const { resource, label, columns, fields, defaults = {} } = config;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // record or null
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/${resource}?limit=100`);
      setItems(res.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setForm({ ...defaults });
    setFieldErrors({});
    setError("");
    setEditing("new");
  };

  const openEdit = (item) => {
    const f = { ...item };
    // Flatten array tag-like fields to comma strings for editing.
    fields.forEach((fl) => {
      if (fl.type === "tags" && Array.isArray(f[fl.name])) {
        f[fl.name] = f[fl.name].join(", ");
      }
    });
    setForm(f);
    setFieldErrors({});
    setError("");
    setEditing(item._id);
  };

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const validateForm = () => {
    const nextErrors = {};
    for (const fl of fields) {
      if (!fl.required) continue;
      const value = form[fl.name];
      if (fl.type === "boolean") continue;
      if (fl.type === "image") {
        const imageUrl = typeof value === "string" ? value : value?.url;
        if (!imageUrl) nextErrors[fl.name] = `${fl.label} is required`;
        continue;
      }
      if (value === undefined || value === null || String(value).trim() === "") {
        nextErrors[fl.name] = `${fl.label} is required`;
      }
    }
    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const save = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSaving(true);
    setError("");
    try {
      const payload = { ...form };
      fields.forEach((fl) => {
        if (fl.type === "tags" && typeof payload[fl.name] === "string") {
          payload[fl.name] = payload[fl.name]
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
        if (fl.type === "number" && payload[fl.name] !== undefined) {
          payload[fl.name] = Number(payload[fl.name]);
        }
      });

      if (editing === "new") {
        await api.post(`/${resource}`, payload);
      } else {
        await api.put(`/${resource}/${editing}`, payload);
      }
      setFieldErrors({});
      setEditing(null);
      await load();
    } catch (e2) {
      setError(e2.data?.message || e2.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    try {
      await api.del(`/${resource}/${id}`);
      await load();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div>
      <div className={styles.head}>
        <h1>{label}s</h1>
        <button className="adm-btn primary" onClick={openNew}>+ New {label}</button>
      </div>

      {error && <p style={{ color: "#ff8a85" }}>{error}</p>}

      {loading ? (
        <div className={styles.loadingSkeleton} aria-label={`Loading ${label.toLowerCase()} list`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.loadingRow} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p style={{ color: "var(--text-muted)" }}>No {label.toLowerCase()}s yet. Create one.</p>
      ) : (
        <div className={styles.tableWrap}>
          <table className="adm-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  {columns.map((c) => (
                    <td key={c.key}>
                      {c.render ? c.render(item) : String(item[c.key] ?? "—")}
                    </td>
                  ))}
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <button className="adm-btn" onClick={() => openEdit(item)}>Edit</button>{" "}
                    <button className="adm-btn danger" onClick={() => remove(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className={styles.overlay} onClick={() => setEditing(null)}>
          <form className={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <div className={styles.modalHead}>
              <h2>{editing === "new" ? `New ${label}` : `Edit ${label}`}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close">✕</button>
            </div>

            <div className={styles.fields}>
              {fields.map((fl) => (
                <div key={fl.name} className={`adm-field ${fl.full ? styles.full : ""}`}>
                  <label htmlFor={fl.name}>{fl.label}{fl.required ? " *" : ""}</label>
                  <FieldInput field={fl} value={form[fl.name]} onChange={(v) => setField(fl.name, v)} />
                  {fieldErrors[fl.name] && (
                    <small className={styles.error}>{fieldErrors[fl.name]}</small>
                  )}
                </div>
              ))}
            </div>

            {error && <p style={{ color: "#ff8a85" }}>{error}</p>}

            <div className={styles.modalFoot}>
              <button type="button" className="adm-btn" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="adm-btn primary" disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function FieldInput({ field, value, onChange }) {
  switch (field.type) {
    case "textarea":
    case "richtext":
      return <textarea id={field.name} rows={field.type === "richtext" ? 8 : 3} value={value || ""} onChange={(e) => onChange(e.target.value)} required={field.required} />;
    case "number":
      return <input id={field.name} type="number" value={value ?? ""} onChange={(e) => onChange(e.target.value)} required={field.required} />;
    case "boolean":
      return (
        <select id={field.name} value={value ? "true" : "false"} onChange={(e) => onChange(e.target.value === "true")}>
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
      );
    case "select":
      return (
        <select id={field.name} value={value || ""} onChange={(e) => onChange(e.target.value)} required={field.required}>
          <option value="">— select —</option>
          {field.options.map((o) => (
            <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>
          ))}
        </select>
      );
    case "image":
      return <ImageUploader value={value} onChange={onChange} folder={field.folder} />;
    case "date":
      return <input id={field.name} type="date" value={value ? String(value).slice(0, 10) : ""} onChange={(e) => onChange(e.target.value)} />;
    case "tags":
      return <input id={field.name} value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder="comma, separated, values" />;
    default:
      return <input id={field.name} type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} required={field.required} />;
  }
}
