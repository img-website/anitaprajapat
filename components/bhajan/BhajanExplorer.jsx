"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/services/apiClient";
import useDebounce from "@/hooks/useDebounce";
import BhajanCard from "@/components/cards/BhajanCard";
import styles from "./BhajanExplorer.module.scss";

export default function BhajanExplorer({ initialItems = [], categories = [] }) {
  const [items, setItems] = useState(initialItems);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const debouncedQ = useDebounce(q, 450);

  const load = useCallback(
    async (reset = false) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(reset ? 1 : page),
          limit: "12",
          status: "published",
        });
        if (debouncedQ) params.set("q", debouncedQ);
        if (category) params.set("category", category);
        const res = await api.get(`/bhajans?${params.toString()}`);
        setItems((prev) => (reset ? res.data : [...prev, ...res.data]));
        setPagination(res.pagination);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    },
    [debouncedQ, category, page]
  );

  // Reload (fresh list) when filters change. Page is reset to 1 in the filter
  // handlers. The fetch sets loading state — an accepted data-fetching exception.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ, category]);

  // Append the next page when "load more" advances the page counter.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (page > 1) load(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  return (
    <div>
      <div className={styles.controls}>
        <input
          type="search"
          placeholder="Search bhajans, lyrics…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setPage(1); }}
          className={styles.search}
          aria-label="Search bhajans"
        />
        <div className={styles.filters}>
          <button
            className={!category ? styles.active : ""}
            onClick={() => { setCategory(""); setPage(1); }}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c._id || c.slug}
              className={category === c.slug ? styles.active : ""}
              onClick={() => { setCategory(c.slug); setPage(1); }}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {items.length === 0 && !loading ? (
        <p className={styles.empty}>No bhajans found. Try a different search.</p>
      ) : (
        <div className={styles.grid}>
          {items.map((b) => (
            <BhajanCard key={b._id} bhajan={b} />
          ))}
        </div>
      )}

      {loading && (
        <div className={styles.skeletonGrid} aria-label="Loading bhajans">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeletonCard} />
          ))}
        </div>
      )}

      {pagination?.hasMore && !loading && (
        <div className={styles.more}>
          <button className="btn btn-outline" onClick={() => setPage((p) => p + 1)}>
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
