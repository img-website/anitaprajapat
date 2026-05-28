import "@/styles/admin.scss";

export const metadata = {
  title: "Admin · Anita Prajapat",
  robots: { index: false, follow: false },
};

// Bare wrapper; the protected chrome lives in (panel)/layout.js so the
// login route can render without the sidebar.
export default function AdminRootLayout({ children }) {
  return <div className="admin-root">{children}</div>;
}
