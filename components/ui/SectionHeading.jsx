"use client";

import Reveal from "./Reveal";

export default function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  return (
    <Reveal className="section-head" style={align === "left" ? { textAlign: "left", marginInline: 0 } : undefined}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      {/* Solid-ink headline for editorial restraint — the eyebrow carries the accent. */}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </Reveal>
  );
}
