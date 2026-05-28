"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { adminNav } from "@/lib/siteConfig";
import styles from "./AdminShell.module.scss";

export default function AdminShell({ user, children }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.shell}>
      <aside className={`${styles.sidebar} ${open ? styles.open : ""}`}>
        <div className={styles.logo}>
          <span>अ</span> Anita Admin
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
        <button className={styles.signout} onClick={() => signOut({ callbackUrl: "/admin/login" })}>
          Sign out
        </button>
      </aside>

      <div className={styles.body}>
        <header className={styles.topbar}>
          <button className={styles.burger} onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            ☰
          </button>
          <Link href="/" target="_blank" className={styles.viewSite}>
            View site ↗
          </Link>
          <div className={styles.user}>
            <span>{user?.name || user?.email}</span>
            <span className={styles.role}>{user?.role}</span>
          </div>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
