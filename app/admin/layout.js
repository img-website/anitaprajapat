import "@/styles/admin.scss";

export const metadata = {
  title: "Admin · Anita Prajapat",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noimageindex: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
};

// Bare wrapper; the protected chrome lives in (panel)/layout.js so the
// login route can render without the sidebar.
export default function AdminRootLayout({ children }) {
  return <div className="admin-root">{children}</div>;
}
