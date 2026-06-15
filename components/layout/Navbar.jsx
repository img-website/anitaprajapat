"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { CalendarHeart } from "lucide-react";
import { mainNav, siteConfig } from "@/lib/siteConfig";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
import ThemeToggle from "./ThemeToggle";
import styles from "./Navbar.module.scss";

export default function Navbar({ logo, whatsapp }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);
  const logoSrc = logo || "/logo.png";
  const wa = whatsapp || siteConfig.whatsapp;

  // Close the mobile menu on route change — React's recommended render-time
  // adjustment instead of an effect (avoids an extra render + setState-in-effect).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while mobile menu open + close on Escape (a11y).
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return () => { document.body.style.overflow = ""; };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label={siteConfig.name} title={`${siteConfig.name} — ${siteConfig.tagline}`}>
          <Image
            src={logoSrc}
            alt={`${siteConfig.name} logo — Sanwariya Seth & Khatu Shyam Bhajan Singer`}
            title={`${siteConfig.name} — ${siteConfig.tagline}`}
            width={48}
            height={48}
            loading="eager"
          />
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          {mainNav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.title || item.label}
                aria-current={active ? "page" : undefined}
                className={active ? styles.active : ""}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Book Anita Prajapat for Jagran on WhatsApp"
            className={`btn btn-primary ${styles.bookBtn}`}
          >
            <CalendarHeart size={17} /> Book Now
          </a>
          <button
            className={styles.burger}
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={open ? styles.x1 : ""} />
            <span className={open ? styles.x2 : ""} />
            <span className={open ? styles.x3 : ""} />
          </button>
        </div>
      </div>

      {open && (
        <div className={styles.mobileSheet} style={{ animation: "fadeIn 0.25s ease both" }}>
          <nav aria-label="Mobile">
            {mainNav.map((item) => (
              <div key={item.href}>
                <Link href={item.href} title={item.title || item.label}>{item.label}</Link>
              </div>
            ))}
          </nav>
          <a
            href={`https://wa.me/${wa}`}
            target="_blank"
            rel="noopener noreferrer"
            title="Book Anita Prajapat for Jagran on WhatsApp"
            className="btn btn-gold btn-lg"
          >
            <WhatsappIcon size={18} /> Book on WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
