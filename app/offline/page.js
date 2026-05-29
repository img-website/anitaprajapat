import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  title: "You're offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
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
        <p style={{ color: "var(--gold)", letterSpacing: "0.3em", textTransform: "uppercase" }}>
          Offline
        </p>
        <h1 style={{ margin: "0.5rem 0 1rem" }}>You&apos;re offline</h1>
        <p style={{ marginBottom: "1.5rem", color: "var(--text-muted)" }}>
          Looks like you&apos;ve lost your connection. Reconnect to watch
          {" "}{siteConfig.name}&apos;s Sanwariya Seth &amp; Khatu Shyam bhajans.
        </p>
        <Link href="/" className="btn btn-gold" title={`${siteConfig.name} — Home`}>
          Try Home again
        </Link>
      </div>
    </div>
  );
}
