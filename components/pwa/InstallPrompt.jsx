"use client";

import { useEffect, useState } from "react";
import { Download, X, Share } from "lucide-react";
import { siteConfig } from "@/lib/siteConfig";
import styles from "./InstallPrompt.module.scss";

const DISMISS_KEY = "pwa-install-dismissed";

// Custom PWA install prompt (Next.js official pattern).
// Android/desktop Chrome: captures `beforeinstallprompt` → native install popup.
// iOS Safari: shows manual "Add to Home Screen" hint (no auto prompt on iOS).
// Hidden when already installed (standalone) or previously dismissed.
export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (standalone) return; // already installed
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {}

    // iOS has no `beforeinstallprompt`, so we detect it from the UA on mount and
    // show the manual hint. This environment check can't run during SSR — a
    // legitimate exception to the set-state-in-effect rule.
    const ua = window.navigator.userAgent || "";
    const ios = /iphone|ipad|ipod/i.test(ua) && !window.MSStream;
    if (ios) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsIOS(true);
      setShow(true);
    }

    const onBeforeInstall = (e) => {
      e.preventDefault();
      setDeferred(e);
      setShow(true);
    };
    const onInstalled = () => {
      setShow(false);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    deferred.prompt();
    try {
      await deferred.userChoice;
    } catch {}
    setDeferred(null);
    setShow(false);
  };

  const dismiss = () => {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  if (!show) return null;

  return (
    <div className={styles.bar} role="dialog" aria-label="Install app">
      <div className={styles.text}>
        <strong>Install the {siteConfig.name} app</strong>
        {isIOS ? (
          <span>
            Tap Share <Share size={13} aria-hidden /> then &ldquo;Add to Home Screen&rdquo;
          </span>
        ) : (
          <span>One tap to new Sanwariya Seth &amp; Khatu Shyam bhajans.</span>
        )}
      </div>

      {!isIOS && (
        <button type="button" className={styles.cta} onClick={install} title="Install app">
          <Download size={16} aria-hidden /> Install
        </button>
      )}

      <button
        type="button"
        className={styles.close}
        onClick={dismiss}
        aria-label="Dismiss install banner"
        title="Dismiss"
      >
        <X size={16} aria-hidden />
      </button>
    </div>
  );
}
