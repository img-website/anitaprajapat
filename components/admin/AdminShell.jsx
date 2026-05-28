"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { adminNav } from "@/lib/siteConfig";
import styles from "./AdminShell.module.scss";

export default function AdminShell({ user, logo, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const logoSrc = logo || "/logo.png";
  const title = adminNav.find((item) =>
    item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
  )?.label || "Dashboard";

  const handleSignout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <div className={styles.shell}>
      {open && <button className={styles.backdrop} aria-label="Close menu" onClick={() => setOpen(false)} />}
      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <div className={styles.logoRow}>
          <Link href="/" target="_blank" className={styles.logo} aria-label="View site">
            <Image src={logoSrc} alt="Site logo" width={36} height={36} unoptimized />
          </Link>
          <span className={styles.logoText}>Anita Admin</span>
        </div>
        <nav>
          {adminNav.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={active ? styles.active : ""}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button className={styles.signout} onClick={() => setConfirmOpen(true)}>
          Sign out
        </button>
      </aside>

      <div className={styles.body}>
        <header className={styles.topbar}>
          <button className={styles.burger} onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            <span />
            <span />
            <span />
          </button>
          <div className={styles.topbarLeft}>
            <strong>{title}</strong>
          </div>
          <div className={styles.topbarActions}>
            <Link href="/" target="_blank" className={styles.viewSite}>
              View site
            </Link>
            <Link href="/" target="_blank" className={styles.mobileLogo} aria-label="View site">
              <Image src={logoSrc} alt="Site logo" width={30} height={30} unoptimized />
            </Link>
            <div className={styles.user}>
              <span>{user?.name || user?.email}</span>
              <span className={styles.role}>{user?.role}</span>
            </div>
          </div>
        </header>
        <main className={styles.content}>{children}</main>
      </div>

      {confirmOpen && (
        <div className={styles.confirmWrap} onClick={() => setConfirmOpen(false)}>
          <div className={styles.confirmBox} onClick={(e) => e.stopPropagation()}>
            <h3>Sign out?</h3>
            <p>You will need to sign in again to access admin panel.</p>
            <div className={styles.confirmActions}>
              <button type="button" className="adm-btn" onClick={() => setConfirmOpen(false)}>
                Cancel
              </button>
              <button type="button" className={styles.signoutConfirm} onClick={handleSignout}>
                Yes, Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
