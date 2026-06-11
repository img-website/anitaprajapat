import { buildMetadata, breadcrumbSchema, personSchema, faqSchema, seoDefaultsFromSettings } from "@/lib/seo";
import { getSettings } from "@/services/content";
import { siteConfig } from "@/lib/siteConfig";
import PageHeader from "@/components/ui/PageHeader";
import ContactForm from "@/components/contact/ContactForm";
import JsonLd from "@/components/seo/JsonLd";
import styles from "./contact.module.scss";

// Revalidate every 10 min — contact info rarely changes.
export const revalidate = 600;

export async function generateMetadata() {
  const settings = await getSettings();
  return buildMetadata({
    title: "Contact & Booking",
    description:
      "Book Anita Prajapat for live Jagran and devotional events. Contact manager Jitendra Kumar Bijarnia via phone, WhatsApp or email.",
    path: "/contact",
    defaults: seoDefaultsFromSettings(settings),
  });
}

// Booking FAQs — rendered on the page AND emitted as FAQPage JSON-LD below
// (Google requires the schema questions to be visible on the page).
const buildFaqs = ({ manager, phone, city }) => [
  {
    question: "How do I book Anita Prajapat for a Jagran or devotional event?",
    answer: `Bookings are handled by manager ${manager}. Send a message on WhatsApp or call ${phone} with your event date, city and venue — you will get availability and details quickly. You can also use the inquiry form on this page.`,
  },
  {
    question: "Which types of events does Anita Prajapat perform at?",
    answer: "She performs live Jagran, temple events, devotional concerts and private functions — singing Sanwariya Seth, Khatu Shyam, Mataji, Marwadi and Rajasthani bhajans.",
  },
  {
    question: "Does Anita Prajapat travel outside Rajasthan for events?",
    answer: `Yes. She is based in ${city}, Rajasthan, and performs at live Jagrans and devotional events across India. Travel details are confirmed at the time of booking.`,
  },
  {
    question: "How far in advance should I book?",
    answer: "Dates around major festivals like Ekadashi, Navratri and Khatu Shyam fairs fill up early, so it is best to inquire as soon as your event date is fixed. For other dates, reach out at least a few weeks in advance.",
  },
];

export default async function ContactPage() {
  const settings = await getSettings();
  const phone = settings.phone || siteConfig.phone;
  const whatsapp = settings.whatsapp || siteConfig.whatsapp;
  const email = settings.email || siteConfig.email;
  const social = { ...siteConfig.social, ...(settings.social || {}) };
  const faqs = buildFaqs({
    manager: settings.manager || siteConfig.manager,
    phone,
    city: siteConfig.city,
  });

  return (
    <>
      <JsonLd
        data={[
          personSchema(),
          faqSchema(faqs),
          breadcrumbSchema([{ name: "Contact", href: "/contact" }]),
        ]}
      />
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
                  <a href={`tel:${phone}`} title={`Call Anita Prajapat booking line ${phone}`}>{phone}</a>
                </li>
                <li>
                  <span>WhatsApp</span>
                  <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" title="Book Anita Prajapat for Jagran on WhatsApp">
                    Chat now
                  </a>
                </li>
                <li>
                  <span>Email</span>
                  <a href={`mailto:${email}`} title="Email Anita Prajapat for bookings &amp; inquiries">{email}</a>
                </li>
                <li>
                  <span>Based in</span>
                  <span>{settings.address || `${siteConfig.city}, Rajasthan`}</span>
                </li>
              </ul>

              <div className={styles.social}>
                {Object.entries(social).map(([k, url]) =>
                  url ? (
                    <a
                      key={k}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={k === "youtube" ? "Subscribe to Anita Prajapat on YouTube" : `Follow Anita Prajapat on ${k.charAt(0).toUpperCase() + k.slice(1)}`}
                    >
                      {k}
                    </a>
                  ) : null
                )}
              </div>

              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" title="Quick WhatsApp booking for Anita Prajapat Jagran" className="btn btn-gold">
                Quick WhatsApp Booking
              </a>
            </div>

            <ContactForm />
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="faq-heading">
        <div className="container-narrow">
          <h2 id="faq-heading" className={styles.faqHeading}>
            Booking FAQs
          </h2>
          <div className={styles.faqList}>
            {faqs.map((f) => (
              <details key={f.question} className={styles.faqItem}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
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
