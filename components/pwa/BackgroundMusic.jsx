"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import styles from "./BackgroundMusic.module.scss";

const PREF_KEY = "bg-music";

/**
 * Soft, looping background music.
 * - Plays only on the client, when a `src` is configured.
 * - Browsers block audio-with-sound until a user gesture, so we start on the
 *   first tap / click / key / scroll (and retry immediately in case allowed).
 * - Pauses when the tab is hidden, resumes when visible (so sound only plays
 *   while the user is actually viewing the site).
 * - Visible mute/unmute toggle; choice is remembered (WCAG 1.4.2 — users can
 *   always stop auto-playing audio).
 */
export default function BackgroundMusic({ src, volume = 0.2 }) {
  const audioRef = useRef(null);
  const [on, setOn] = useState(true);
  const [playing, setPlaying] = useState(false);

  // Restore the visitor's previous choice.
  useEffect(() => {
    try {
      if (localStorage.getItem(PREF_KEY) === "off") setOn(false);
    } catch {}
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !src) return;
    el.volume = volume;

    const startIfWanted = () => {
      if (!on || document.hidden) return;
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    };

    // Try right away (may be blocked), then on the first user gesture.
    startIfWanted();
    const events = ["pointerdown", "keydown", "touchstart", "scroll"];
    const onGesture = () => {
      startIfWanted();
      events.forEach((e) => window.removeEventListener(e, onGesture));
    };
    events.forEach((e) =>
      window.addEventListener(e, onGesture, { once: true, passive: true })
    );

    // Only sound while the tab is visible.
    const onVisibility = () => {
      if (document.hidden) el.pause();
      else startIfWanted();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      events.forEach((e) => window.removeEventListener(e, onGesture));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [src, on, volume]);

  const toggle = () => {
    const el = audioRef.current;
    const next = !on;
    setOn(next);
    try {
      localStorage.setItem(PREF_KEY, next ? "on" : "off");
    } catch {}
    if (!el) return;
    if (next) {
      el.play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  if (!src) return null;

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="auto" />
      <button
        type="button"
        className={styles.toggle}
        onClick={toggle}
        aria-pressed={on && playing}
        aria-label={on ? "Mute background music" : "Play background music"}
        title={on ? "Mute music" : "Play music"}
      >
        {on ? <Volume2 size={18} aria-hidden /> : <VolumeX size={18} aria-hidden />}
      </button>
    </>
  );
}
