import Reveal from "./Reveal";

export default function SectionHeading({ eyebrow, title, subtitle, align = "center" }) {
  return (
    <Reveal className="section-head" style={align === "left" ? { textAlign: "left", marginInline: 0 } : undefined}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2>
        <span className="grad-head">{title}</span>
      </h2>
      {subtitle && <p>{subtitle}</p>}
    </Reveal>
  );
}
