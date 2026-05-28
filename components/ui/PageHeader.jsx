import Link from "next/link";
import Reveal from "./Reveal";
import styles from "./PageHeader.module.scss";

export default function PageHeader({ eyebrow, title, subtitle, crumbs = [] }) {
  return (
    <header className={styles.header}>
      <div className="container">
        {crumbs.length > 0 && (
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            {crumbs.map((c, i) => (
              <span key={i}>
                <span className={styles.sep}>/</span>
                {c.href ? <Link href={c.href}>{c.name}</Link> : <span>{c.name}</span>}
              </span>
            ))}
          </nav>
        )}
        <Reveal>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </Reveal>
      </div>
    </header>
  );
}
