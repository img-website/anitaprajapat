export default function Loading() {
  return (
    <div style={{ minHeight: "60vh", display: "grid", placeItems: "center", paddingTop: "var(--header-pad,76px)" }}>
      <div
        aria-label="Loading"
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: "3px solid var(--border)",
          borderTopColor: "var(--gold)",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
