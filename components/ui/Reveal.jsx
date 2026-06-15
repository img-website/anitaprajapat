"use client";

import { createElement } from "react";
import useReveal from "@/hooks/useReveal";

// Variant → CSS modifier class (see globals.scss `.rv*`).
const VARIANT = {
  up: "",
  down: "rv-down",
  left: "rv-left",
  right: "rv-right",
  fade: "rv-fade",
  scale: "rv-scale",
};

export default function Reveal({
  children,
  as = "div",
  variant = "up",
  delay = 0,
  amount = 0.2,
  className = "",
  style,
  ...rest
}) {
  const ref = useReveal({ once: true, amount });
  const cls = [className, VARIANT[variant] || ""].filter(Boolean).join(" ");
  return createElement(
    as,
    {
      ref,
      className: cls,
      style: delay ? { transitionDelay: `${delay}s`, ...style } : style,
      ...rest,
    },
    children
  );
}

// Stagger container — a plain wrapper; the incremental delay comes from the
// `.rv-stagger:nth-child()` CSS on each item.
export function StaggerGroup({ children, className, ...rest }) {
  return (
    <div className={className} {...rest}>
      {children}
    </div>
  );
}

export function StaggerItem({ children, as = "div", variant = "up", className = "", ...rest }) {
  const ref = useReveal({ once: true, amount: 0.1 });
  const cls = ["rv-stagger", className, VARIANT[variant] || ""].filter(Boolean).join(" ");
  return createElement(as, { ref, className: cls, ...rest }, children);
}
