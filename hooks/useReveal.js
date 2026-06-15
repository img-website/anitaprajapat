"use client";

import { useCallback, useRef } from "react";

/**
 * Lightweight scroll-reveal via IntersectionObserver (replaces Framer Motion's
 * whileInView). Returns a ref callback to spread onto the element.
 *
 * Safe by default: the hidden state (`rv`) is only applied by JS, so without
 * JavaScript the content stays fully visible. Elements already in view at mount
 * are left untouched (no flash). After revealing, the reveal classes are
 * stripped so a leftover `transform` never blocks the element's own hover/active
 * transforms. Honors reduced-motion.
 */
export default function useReveal({ once = true, amount = 0.15 } = {}) {
  const disconnect = useRef(null);

  return useCallback(
    (node) => {
      if (disconnect.current) {
        disconnect.current();
        disconnect.current = null;
      }
      if (!node) return;

      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (reduce) return; // leave fully visible, no animation

      const vh = window.innerHeight || 0;
      const rect = node.getBoundingClientRect();
      // Already on screen at mount → no animation, stays visible & clean.
      if (rect.top < vh * (1 - amount) && rect.bottom > 0) return;

      node.classList.add("rv");

      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("rv-in");
              // Strip reveal classes once the transition is done so the leftover
              // transform can't override the element's own hover transforms.
              setTimeout(() => e.target.classList.remove("rv", "rv-in"), 1100);
              if (once) io.unobserve(e.target);
            } else if (!once) {
              e.target.classList.remove("rv-in");
            }
          }
        },
        { threshold: Math.min(amount, 0.99), rootMargin: "0px 0px -8% 0px" }
      );
      io.observe(node);
      disconnect.current = () => io.disconnect();
    },
    [once, amount]
  );
}
