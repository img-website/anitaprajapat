"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Music2, CalendarDays, Images, Mail } from "lucide-react";
import styles from "./MobileTabBar.module.scss";

// App-style bottom navigation for mobile. Hidden on desktop.
const tabs = [
  { href: "/", label: "Home", Icon: Home, title: "Anita Prajapat — Sanwariya Seth & Khatu Shyam Bhajan Singer" },
  { href: "/bhajans", label: "Bhajans", Icon: Music2, title: "Watch Sanwariya Seth & Khatu Shyam Bhajans on YouTube" },
  { href: "/events", label: "Events", Icon: CalendarDays, title: "Live Jagran Events by Anita Prajapat" },
  { href: "/gallery", label: "Gallery", Icon: Images, title: "Anita Prajapat Photo & Stage Gallery" },
  { href: "/contact", label: "Contact", Icon: Mail, title: "Contact & Booking for Jagran — Anita Prajapat" },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav className={styles.bar} aria-label="Mobile navigation">
      {tabs.map((t) => {
        const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            title={t.title || t.label}
            aria-current={active ? "page" : undefined}
            className={active ? styles.active : ""}
          >
            <t.Icon size={22} aria-hidden />
            <span>{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
