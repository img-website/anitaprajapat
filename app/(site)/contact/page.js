import { buildMetadata, breadcrumbSchema, personSchema, seoDefaultsFromSettings } from "@/lib/seo";
import { getSettings } from "@/services/content";
import { siteConfig } from "@/lib/siteConfig";
import PageHeader from "@/components/ui/PageHeader";
import ContactForm from "@/components/contact/ContactForm";
import JsonLd from "@/components/seo/JsonLd";
import styles from "./contact.module.scss";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const settings = await getSettings();
  return buildMetadata({
    title: "Contact & Booking — Anita Prajapat",
    description:
      "Book Anita Prajapat for live Jagran and devotional events. Contact manager Jitendra Kumar Bijarnia via phone, WhatsApp or email.",
    path: "/contact",
    defaults: seoDefaultsFromSettings(settings),
  });
}

export default async function ContactPage() {
  const settings = await getSettings();
  const phone = settings.phone || siteConfig.phone;
  const whatsapp = settings.whatsapp || siteConfig.whatsapp;
  const email = settings.email || siteConfig.email;
  const social = { ...siteConfig.social, ...(settings.social || {}) };

  return (
    <>
      <JsonLd data={[personSchema(), breadcrumbSchema([{ name: "Contact", href: "/contact" }])]} />
      <PageHeader
        eyebrow="Get in Touch"
        title="Contact & Booking"
        subtitle="Invite Anita Prajapat to your Jagran or event."
        crumbs={[{ name: "Contact" }]}
      />

      <section className="section">
        <div className="container">
          <div className={styles.layout}>
            <div className={styles.info}>
              <h2>Booking Inquiry</h2>
              <p>
                For bookings and availability, reach out to manager{" "}
                <strong>{settings.manager || siteConfig.manager}</strong>.
              </p>

              <ul className={styles.details}>
                <li>
                  <span>Phone</span>
                  <a href={`tel:${phone}`}>{phone}</a>
                </li>
                <li>
                  <span>WhatsApp</span>
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
                    Chat now
                  </a>
                </li>
                <li>
                  <span>Email</span>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
                <li>
                  <span>Based in</span>
                  <span>{settings.address || `${siteConfig.city}, Rajasthan`}</span>
                </li>
              </ul>

              <div className={styles.social}>
                {Object.entries(social).map(([k, url]) =>
                  url ? (
                    <a key={k} href={url} target="_blank" rel="noopener noreferrer">
                      {k}
                    </a>
                  ) : null
                )}
              </div>

              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                Quick WhatsApp Booking
              </a>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      <section className={styles.mapWrap} aria-label="Location">
        <iframe
          title="Jaipur location"
          src="https://www.google.com/maps?q=Jaipur,Rajasthan&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </section>
    </>
  );
}
