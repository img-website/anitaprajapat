"use client";

import { useState } from "react";
import { UploadCloud, LayoutGrid } from "lucide-react";
import GalleryBulkUpload from "@/components/admin/GalleryBulkUpload";
import GalleryManage from "@/components/admin/GalleryManage";
import styles from "./gallery.module.scss";

const TABS = [
  { key: "bulk", label: "Bulk Upload", Icon: UploadCloud },
  { key: "manage", label: "Manage Existing", Icon: LayoutGrid },
];

export default function GalleryAdminPage() {
  const [tab, setTab] = useState("bulk");
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div>
      <nav className={styles.tabs} aria-label="Gallery sections">
        {TABS.map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            className={tab === key ? styles.active : ""}
            onClick={() => setTab(key)}
            aria-current={tab === key ? "page" : undefined}
          >
            <Icon size={16} aria-hidden /> {label}
          </button>
        ))}
      </nav>

      {tab === "bulk" && (
        <div className={styles.panel}>
          <h2>Bulk Upload Photos</h2>
          <p className={styles.hint}>
            Select multiple images at once. Fill in the title and alt text for
            each, then click <strong>Upload all</strong> → <strong>Save to gallery</strong>.
          </p>
          <GalleryBulkUpload
            onDone={() => {
              setRefreshKey((k) => k + 1);
              setTab("manage");
            }}
          />
        </div>
      )}

      {tab === "manage" && (
        <div key={refreshKey}>
          <GalleryManage />
        </div>
      )}
    </div>
  );
}
