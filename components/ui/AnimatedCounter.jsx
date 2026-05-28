"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

// Counts up to a numeric target when scrolled into view.
// Preserves any non-numeric suffix/prefix (e.g. "4389+", "10K").
export default function AnimatedCounter({ value, duration = 1600, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState("0");

  const str = String(value ?? "");
  const match = str.match(/([\d,]+)/);
  const target = match ? parseInt(match[1].replace(/,/g, ""), 10) : null;
  const prefix = match ? str.slice(0, match.index) : "";
  const suffix = match ? str.slice(match.index + match[1].length) : str;

  useEffect(() => {
    if (!inView || target === null) {
      if (target === null) setDisplay(str);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * target).toLocaleString("en-IN"));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, duration, str]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {target === null ? str : display}
      {suffix}
    </span>
  );
}
