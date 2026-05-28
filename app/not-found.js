import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: "6rem 1.5rem 3rem",
      }}
    >
      <div>
        <p style={{ color: "var(--gold)", letterSpacing: "0.3em", textTransform: "uppercase" }}>404</p>
        <h1 style={{ margin: "0.5rem 0 1rem" }}>Page not found</h1>
        <p style={{ marginBottom: "1.5rem" }}>
          The page you are looking for may have moved or no longer exists.
        </p>
        <Link href="/" className="btn btn-gold" title="Anita Prajapat — Sanwariya Seth & Khatu Shyam Bhajan Singer">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
