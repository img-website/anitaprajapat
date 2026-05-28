"use client";

import { siteConfig } from "@/lib/siteConfig";
import styles from "./ShareButtons.module.scss";

export default function ShareButtons({ path = "", title = "" }) {
  const url = `${siteConfig.url}${path}`;
  const enc = encodeURIComponent(url);
  const t = encodeURIComponent(title);

  const links = [
    { label: "WhatsApp", href: `https://wa.me/?text=${t}%20${enc}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc}` },
    { label: "Twitter", href: `https://twitter.com/intent/tweet?text=${t}&url=${enc}` },
    { label: "Pinterest", href: `https://pinterest.com/pin/create/button/?url=${enc}&description=${t}` },
  ];

  const native = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    } else {
      navigator.clipboard?.writeText(url);
    }
  };

  return (
    <div className={styles.share}>
      <span>Share:</span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer">
          {l.label}
        </a>
      ))}
      <button onClick={native}>Copy link</button>
    </div>
  );
}
