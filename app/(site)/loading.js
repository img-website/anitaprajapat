export default function Loading() {
  return (
    <div style={{ minHeight: "55vh", paddingTop: "var(--header-pad,4.75rem)", paddingInline: "1rem" }} aria-label="Loading page">
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: "0.9rem" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: i === 0 ? 180 : 120,
              borderRadius: 14,
              background: "var(--surface)",
              border: "0.0625rem solid var(--border)",
              opacity: 0.75,
            }}
          />
        ))}
      </div>
    </div>
  );
}
