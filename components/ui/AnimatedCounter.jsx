"use client";

import { useEffect, useRef, useState } from "react";

// Counts up to a numeric target when scrolled into view (IntersectionObserver —
// no animation library). Preserves any non-numeric prefix/suffix (e.g. "4389+").
export default function AnimatedCounter({ value, duration = 1600, className = "" }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState("0");

  const str = String(value ?? "");
  const match = str.match(/([\d,]+)/);
  const target = match ? parseInt(match[1].replace(/,/g, ""), 10) : null;
  const prefix = match ? str.slice(0, match.index) : "";
  const suffix = match ? str.slice(match.index + match[1].length) : str;

  useEffect(() => {
    if (target === null) return;
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(target.toLocaleString("en-IN"));
      return;
    }

    let raf;
    const animate = () => {
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(eased * target).toLocaleString("en-IN"));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            animate();
            io.disconnect();
          }
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [target, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {target === null ? str : display}
      {suffix}
    </span>
  );
}
