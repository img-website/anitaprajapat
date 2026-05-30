"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * A boolean preference persisted in localStorage, read via useSyncExternalStore
 * so there is NO setState-in-effect and no hydration mismatch. The value is
 * stored as "on" / "off"; `defaultOn` is used on the server and when unset.
 *
 *   const [on, setOn] = usePersistedFlag("bg-music", true);
 */
export default function usePersistedFlag(key, defaultOn = true) {
  const subscribe = useCallback(
    (cb) => {
      const onStorage = (e) => {
        if (!e || e.key === key) cb();
      };
      window.addEventListener("storage", onStorage);
      window.addEventListener(`flag:${key}`, cb);
      return () => {
        window.removeEventListener("storage", onStorage);
        window.removeEventListener(`flag:${key}`, cb);
      };
    },
    [key]
  );

  const getSnapshot = useCallback(() => {
    try {
      const v = localStorage.getItem(key);
      return v === null ? defaultOn : v !== "off";
    } catch {
      return defaultOn;
    }
  }, [key, defaultOn]);

  const getServerSnapshot = useCallback(() => defaultOn, [defaultOn]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const set = useCallback(
    (on) => {
      try {
        localStorage.setItem(key, on ? "on" : "off");
      } catch {}
      window.dispatchEvent(new Event(`flag:${key}`));
    },
    [key]
  );

  return [value, set];
}
