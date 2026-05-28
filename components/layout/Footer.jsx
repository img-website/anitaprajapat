import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { mainNav, siteConfig } from "@/lib/siteConfig";
import { brandMap, WhatsappIcon } from "@/components/ui/BrandIcons";
import styles from "./Footer.module.scss";

export default function Footer({ settings = {} }) {
  const social = { ...siteConfig.social, ...(settings.social || {}) };
  const phone = settings.phone || siteConfig.phone;
  const email = settings.email || siteConfig.email;
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <div className={styles.brandTop}>
            <Image src={settings.logo || "/logo.png"} alt={siteConfig.name} width={52} height={52} unoptimized />
            <h3 className="gold-text">{settings.siteName || siteConfig.name}</h3>
          </div>
          <p>{siteConfig.description}</p>
          <div className={styles.social}>
            {Object.entries(social).map(([k, url]) => {
              const Icon = brandMap[k];
              return url && Icon ? (
                <a key={k} href={url} target="_blank" rel="noopener noreferrer" aria-label={k}>
                  <Icon size={18} />
                </a>
              ) : null;
            })}
          </div>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            {mainNav.map((n) => (
              <li key={n.href}>
                <Link href={n.href}>{n.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Genres</h4>
          <ul>
            {siteConfig.genres.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul className={styles.contact}>
            <li>Manager: {settings.manager || siteConfig.manager}</li>
            <li>
              <a href={`tel:${phone}`}><Phone size={15} /> {phone}</a>
            </li>
            <li>
              <a href={`mailto:${email}`}><Mail size={15} /> {email}</a>
            </li>
            <li><MapPin size={15} /> {settings.address || `${siteConfig.city}, Rajasthan`}</li>
          </ul>
          <a
            href={`https://wa.me/${settings.whatsapp || siteConfig.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-gold"
          >
            <WhatsappIcon size={18} /> Book for Jagran <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className="container">
          <span>
            © {year} {siteConfig.name}. All rights reserved.
          </span>
          <span>
            Devotional music from {siteConfig.city} · Performing since{" "}
            {siteConfig.performingSince}
          </span>
        </div>
      </div>
    </footer>
  );
}
