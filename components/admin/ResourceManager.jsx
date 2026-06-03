"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Inbox, X, Search, Plus, Pencil, Trash2,
  Star, Eye, EyeOff, ChevronDown, ChevronUp, Loader, MoreVertical,
} from "lucide-react";
import api from "@/services/apiClient";
import ImageUploader from "./ImageUploader";
import styles from "./ResourceManager.module.scss";

/**
 * Config-driven CRUD UI for any REST resource.
 *
 * config = {
 *   resource, label, defaults, columns, fields,
 *   view?: {
 *     mode: "table" | "cards",   // default "table"
 *     imageKey?: string,          // field with image for card thumbnail
 *     titleKey?: string,          // main card title field
 *     subtitleKey?: string,       // secondary info below title
 *     metaKey?: string,           // smaller meta line
 *     badgeKey?: string,          // field rendered as a badge
 *     badgeColors?: Record<string,string>, // "value" -> CSS color
 *     quickToggles?: string[],    // boolean fields to toggle inline
 *   },
 *   searchable?: boolean,         // show search bar (default true)
 * }
 */
export default function ResourceManager({ config }) {
  const {
    resource,
    label,
    columns = [],
    fields = [],
    defaults = {},
    view = {},
    searchable = true,
    noCreate = false,
  } = config;

  const {
    mode = "table",
    imageKey,
    titleKey,
    subtitleKey,
    metaKey,
    metaRender,
    badgeKey,
    badgeColors = {},
    quickToggles = [],
  } = view;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [openMenu, setOpenMenu] = useState(null); // card _id with open kebab menu

  const imageFields = fields.filter((f) => f.type === "image").map((f) => f.name);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/${resource}?limit=200`);
      setItems(res.data || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // ── Filtering + sorting ───────────────────────────────────
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = term
      ? items.filter((it) =>
          Object.values(it).some((v) =>
            String(v ?? "").toLowerCase().includes(term)
          )
        )
      : items;
    if (sortCol) {
      list = [...list].sort((a, b) => {
        const av = String(a[sortCol] ?? "").toLowerCase();
        const bv = String(b[sortCol] ?? "").toLowerCase();
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return list;
  }, [items, q, sortCol, sortDir]);

  const toggleSort = (key) => {
    if (sortCol === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(key); setSortDir("asc"); }
  };

  // ── Form helpers ──────────────────────────────────────────
  const openNew = () => {
    setForm({ ...defaults });
    setFieldErrors({});
    setError("");
    setEditing("new");
  };

  const openEdit = (item) => {
    const f = { ...item };
    fields.forEach((fl) => {
      if (fl.type === "tags" && Array.isArray(f[fl.name]))
        f[fl.name] = f[fl.name].join(", ");
    });
    setForm(f);
    setFieldErrors({});
    setError("");
    setEditing(item._id);
  };

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const validate = () => {
    const errs = {};
    for (const fl of fields) {
      if (!fl.required) continue;
      if (fl.type === "boolean") continue;
      if (fl.type === "image") {
        const url = typeof form[fl.name] === "string" ? form[fl.name] : form[fl.name]?.url;
        if (!url) errs[fl.name] = `${fl.label} is required`;
        continue;
      }
      const v = form[fl.name];
      if (v === undefined || v === null || String(v).trim() === "")
        errs[fl.name] = `${fl.label} is required`;
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setError("");
    try {
      const payload = { ...form };
      fields.forEach((fl) => {
        if (fl.type === "tags" && typeof payload[fl.name] === "string")
          payload[fl.name] = payload[fl.name].split(",").map((s) => s.trim()).filter(Boolean);
        if (fl.type === "number" && payload[fl.name] !== undefined)
          payload[fl.name] = Number(payload[fl.name]);
      });
      if (editing === "new") await api.post(`/${resource}`, payload);
      else await api.put(`/${resource}/${editing}`, payload);
      setEditing(null);
      await load();
    } catch (e2) {
      setError(e2.data?.message || e2.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item) => {
    if (!confirm(`Delete "${getVal(item, titleKey || columns[0]?.key) || "this item"}"? Cannot be undone.`)) return;
    try {
      await api.del(`/${resource}/${item._id}`);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
    } catch (e) { alert(e.message); }
  };

  const quickToggle = async (item, field) => {
    const next = !item[field];
    try {
      await api.put(`/${resource}/${item._id}`, { [field]: next });
      setItems((prev) => prev.map((i) => i._id === item._id ? { ...i, [field]: next } : i));
    } catch (e) { alert(e.message); }
  };

  // ── Render helpers ────────────────────────────────────────
  const getVal = (item, key) => {
    if (!key) return "";
    const v = item[key];
    if (v && typeof v === "object" && v.url) return v.url;
    return v;
  };

  const getImageUrl = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object") return val.url || "";
    return "";
  };

  const renderBadge = (item) => {
    if (!badgeKey) return null;
    const val = item[badgeKey];
    if (val === undefined || val === null) return null;
    const color = badgeColors[String(val)] || "var(--magenta)";
    return (
      <span
        className={styles.badge}
        style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, color }}
      >
        {String(val)}
      </span>
    );
  };

  const renderCell = (item, column) => {
    if (column.render) return column.render(item);
    const raw = item[column.key];
    const imgUrl = getImageUrl(raw);
    if (imgUrl && imageFields.includes(column.key)) {
      return (
        <Image src={imgUrl} alt={column.label} width={48} height={48}
          className={styles.thumb} sizes="48px" />
      );
    }
    return String(raw ?? "—");
  };

  // ── Loading state ─────────────────────────────────────────
  if (loading) return (
    <div className={styles.skeletonWrap}>
      {mode === "cards"
        ? <div className={styles.cardGrid}>
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className={styles.cardSkel} />)}
          </div>
        : <div className={styles.loadingSkeleton}>
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className={styles.loadingRow} />)}
          </div>
      }
    </div>
  );

  return (
    <div className={styles.root}>
      {/* ── Header ── */}
      <div className={styles.head}>
        <div className={styles.headLeft}>
          <h1>{pluralize(label)}</h1>
          {!loading && (
            <span className={styles.count}>{filtered.length}</span>
          )}
        </div>
        <div className={styles.headRight}>
          {searchable && (
            <label className={styles.searchWrap} aria-label="Search">
              <Search size={15} aria-hidden />
              <input
                type="search"
                placeholder={`Search ${pluralize(label).toLowerCase()}…`}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className={styles.search}
              />
            </label>
          )}
          {!noCreate && (
            <button className="adm-btn primary" onClick={openNew}>
              <Plus size={15} aria-hidden /> New {label}
            </button>
          )}
        </div>
      </div>

      {error && <p className={styles.errMsg}>{error}</p>}

      {/* ── Empty ── */}
      {filtered.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}><Inbox size={22} aria-hidden /></span>
          <h3>{q ? `No results for "${q}"` : `No ${pluralize(label).toLowerCase()} yet`}</h3>
          <p>{q ? "Try a different search term." : `Create your first ${label.toLowerCase()} to get started.`}</p>
          {!q && !noCreate && <button className="adm-btn primary" onClick={openNew}><Plus size={15} /> New {label}</button>}
        </div>
      )}

      {/* ── Card view ── */}
      {mode === "cards" && filtered.length > 0 && (
        <div className={styles.cardGrid} onClick={() => setOpenMenu(null)}>
          {filtered.map((item) => {
            const imgUrl = imageKey ? getImageUrl(item[imageKey]) : "";
            const title = titleKey ? String(item[titleKey] || "Untitled") : "";
            const subtitle = subtitleKey ? String(item[subtitleKey] || "") : "";
            const meta = metaRender ? metaRender(item) : metaKey ? String(item[metaKey] || "") : "";
            const menuOpen = openMenu === item._id;
            return (
              <div key={item._id} className={`${styles.card} ${item.isActive === false ? styles.cardInactive : ""}`}>
                {/* Thumbnail — desktop hover shows Edit/Delete overlay */}
                <button
                  type="button"
                  className={styles.cardImgWrap}
                  onClick={() => openEdit(item)}
                  title={`Edit ${title}`}
                  aria-label={`Edit ${title}`}
                >
                  {imgUrl ? (
                    <Image src={imgUrl} alt={title} fill
                      sizes="(max-width:48rem) 45vw, 200px"
                      className={styles.cardImg} />
                  ) : (
                    <div className={styles.cardNoImg}>
                      <span>{label[0]}</span>
                    </div>
                  )}
                  {/* Desktop: hover overlay — icon-only buttons */}
                  <div className={styles.cardOverlay} aria-hidden>
                    <span className={styles.cardAct} title="Edit">
                      <Pencil size={15} />
                    </span>
                    <span
                      className={`${styles.cardAct} ${styles.cardDel}`}
                      title="Delete"
                      onClick={(e) => { e.stopPropagation(); remove(item); }}
                    >
                      <Trash2 size={15} />
                    </span>
                  </div>
                </button>

                {/* Info body */}
                <div className={styles.cardBody}>
                  <div className={styles.cardTop}>
                    <p className={styles.cardTitle} title={title}>{title}</p>
                    <div className={styles.cardTopRight}>
                      {renderBadge(item)}
                      {/* Mobile-only kebab menu */}
                      <div className={styles.kebabWrap}>
                        <button
                          type="button"
                          className={styles.kebab}
                          aria-label="More options"
                          title="More options"
                          onClick={(e) => { e.stopPropagation(); setOpenMenu(menuOpen ? null : item._id); }}
                        >
                          <MoreVertical size={16} aria-hidden />
                        </button>
                        {menuOpen && (
                          <div className={styles.kebabMenu} onClick={(e) => e.stopPropagation()}>
                            <button type="button" onClick={() => { setOpenMenu(null); openEdit(item); }}>
                              <Pencil size={13} aria-hidden /> Edit
                            </button>
                            <button type="button" className={styles.kebabDel} onClick={() => { setOpenMenu(null); remove(item); }}>
                              <Trash2 size={13} aria-hidden /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  {subtitle && <p className={styles.cardSub}>{subtitle}</p>}
                  {meta && <p className={styles.cardMeta}>{meta}</p>}

                  {/* Quick toggles */}
                  {quickToggles.length > 0 && (
                    <div className={styles.cardToggles}>
                      {quickToggles.map((field) => {
                        const on = !!item[field];
                        const label2 = field === "isFeatured" ? "Featured" : field === "isActive" ? "Active" : field;
                        return (
                          <button
                            key={field}
                            type="button"
                            className={`${styles.toggleBtn} ${on ? styles.toggleOn : ""}`}
                            onClick={() => quickToggle(item, field)}
                            title={`${on ? "Remove" : "Mark"} as ${label2}`}
                          >
                            {field === "isFeatured"
                              ? <Star size={11} fill={on ? "currentColor" : "none"} aria-hidden />
                              : on ? <Eye size={11} aria-hidden /> : <EyeOff size={11} aria-hidden />
                            }
                            {label2}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Table view (desktop) ── */}
      {mode === "table" && filtered.length > 0 && (
        <>
          <div className={styles.tableWrap}>
            <table className="adm-table">
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} onClick={() => toggleSort(c.key)} className={styles.sortTh}>
                      {c.label}
                      {sortCol === c.key
                        ? sortDir === "asc" ? <ChevronUp size={13} aria-hidden /> : <ChevronDown size={13} aria-hidden />
                        : null}
                    </th>
                  ))}
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item._id}>
                    {columns.map((c) => (
                      <td key={c.key}>{renderCell(item, c)}</td>
                    ))}
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      {quickToggles.map((field) => (
                        <button
                          key={field}
                          type="button"
                          className={`adm-btn ${styles.inlineToggle} ${item[field] ? styles.toggleOn : ""}`}
                          onClick={() => quickToggle(item, field)}
                          title={field === "isFeatured" ? (item[field] ? "Unfeature" : "Feature") : (item[field] ? "Hide" : "Show")}
                          style={{ marginRight: "0.3rem" }}
                        >
                          {field === "isFeatured"
                            ? <Star size={13} fill={item[field] ? "currentColor" : "none"} aria-hidden />
                            : item[field] ? <Eye size={13} aria-hidden /> : <EyeOff size={13} aria-hidden />
                          }
                        </button>
                      ))}
                      <button className="adm-btn" onClick={() => openEdit(item)} style={{ marginRight: "0.3rem" }}>Edit</button>
                      <button className="adm-btn danger" onClick={() => remove(item)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile card fallback for table-mode */}
          <div className={styles.mobileList}>
            {filtered.map((item) => {
              const itemImages = imageFields
                .map((n) => ({ n, url: getImageUrl(item[n]) }))
                .filter((x) => x.url);
              return (
                <article key={item._id} className={styles.mobileItem}>
                  {itemImages.length > 0 && (
                    <div className={styles.mobileImages}>
                      {itemImages.map(({ n, url }) => (
                        <Image key={n} src={url} alt={n} width={56} height={56}
                          className={styles.thumb} sizes="56px" />
                      ))}
                    </div>
                  )}
                  <div className={styles.mobileFields}>
                    {columns.map((c) => (
                      <div key={c.key} className={styles.mobileField}>
                        <span>{c.label}</span>
                        <strong>{renderCell(item, c)}</strong>
                      </div>
                    ))}
                  </div>
                  <div className={styles.mobileActions}>
                    {quickToggles.map((field) => (
                      <button key={field} type="button"
                        className={`adm-btn ${item[field] ? styles.toggleOn : ""}`}
                        onClick={() => quickToggle(item, field)}
                        title={field}
                      >
                        {field === "isFeatured" ? <Star size={13} fill={item[field] ? "currentColor" : "none"} aria-hidden /> : item[field] ? <Eye size={13} aria-hidden /> : <EyeOff size={13} aria-hidden />}
                      </button>
                    ))}
                    <button className="adm-btn" onClick={() => openEdit(item)}>Edit</button>
                    <button className="adm-btn danger" onClick={() => remove(item)}>Delete</button>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* ── Edit / New Modal ── */}
      {editing && (
        <div className={styles.overlay} onClick={() => setEditing(null)}>
          <form className={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={save}>
            <div className={styles.modalHead}>
              <h2>{editing === "new" ? `New ${label}` : `Edit ${label}`}</h2>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close" title="Close">
                <X size={18} aria-hidden />
              </button>
            </div>

            <div className={styles.fields}>
              {fields.map((fl) => (
                <div key={fl.name} className={`adm-field ${fl.full ? styles.full : ""}`}>
                  <label htmlFor={fl.name} style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                    {fl.label}{fl.required && <span className={styles.req}>*</span>}
                  </label>
                  <FieldInput field={fl} value={form[fl.name]} onChange={(v) => setField(fl.name, v)} />
                  {fieldErrors[fl.name] && (
                    <small className={styles.error}>{fieldErrors[fl.name]}</small>
                  )}
                </div>
              ))}
            </div>

            {error && <p className={styles.errMsg}>{error}</p>}

            <div className={styles.modalFoot}>
              <button type="button" className="adm-btn" onClick={() => setEditing(null)}>Cancel</button>
              <button type="submit" className="adm-btn primary" disabled={saving}>
                {saving ? <><Loader size={14} className={styles.spin} /> Saving…</> : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

/** Simple English pluralizer covering the resource labels used in this project. */
function pluralize(word) {
  if (!word) return word;
  const exceptions = { Inquiry: "Inquiries", Category: "Categories", Gallery: "Gallery Photos", Testimony: "Testimonials" };
  if (exceptions[word]) return exceptions[word];
  if (word.endsWith("y") && !["ay","ey","iy","oy","uy"].some((e) => word.endsWith(e))) return word.slice(0, -1) + "ies";
  if (word.endsWith("s") || word.endsWith("sh") || word.endsWith("ch")) return word + "es";
  return word + "s";
}

function getImageUrl(val) {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object") return val.url || "";
  return "";
}

function FieldInput({ field, value, onChange }) {
  switch (field.type) {
    case "textarea":
    case "richtext":
      return <textarea id={field.name} rows={field.type === "richtext" ? 8 : 3}
        value={value || ""} onChange={(e) => onChange(e.target.value)} required={field.required} />;
    case "number":
      return <input id={field.name} type="number" value={value ?? ""}
        onChange={(e) => onChange(e.target.value)} required={field.required} />;
    case "boolean":
      return (
        <select id={field.name} value={value ? "true" : "false"}
          onChange={(e) => onChange(e.target.value === "true")}>
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
      return <input id={field.name} type="date"
        value={value ? String(value).slice(0, 10) : ""}
        onChange={(e) => onChange(e.target.value)} />;
    case "datetime":
      // Converts ISO string ↔ datetime-local value (YYYY-MM-DDTHH:MM)
      return <input id={field.name} type="datetime-local"
        value={value ? String(value).slice(0, 16) : ""}
        onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : "")} />;
    case "time":
      return <input id={field.name} type="time"
        value={value ? String(value).slice(0, 5) : ""}
        onChange={(e) => onChange(e.target.value)} />;
    case "tags":
      return <input id={field.name} value={value || ""}
        onChange={(e) => onChange(e.target.value)} placeholder="comma, separated, values" />;
    default:
      return <input id={field.name} type="text" value={value || ""}
        onChange={(e) => onChange(e.target.value)} required={field.required} />;
  }
}
