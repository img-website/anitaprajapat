import Link from "next/link";
import { buildMetadata, breadcrumbSchema, seoDefaultsFromSettings } from "@/lib/seo";
import { getSettings } from "@/services/content";
import { siteConfig } from "@/lib/siteConfig";
import PageHeader from "@/components/ui/PageHeader";
import JsonLd from "@/components/seo/JsonLd";
import styles from "./privacy.module.scss";

// Static legal copy — revalidate daily.
export const revalidate = 86400;

// Bump this whenever the policy text below materially changes.
const LAST_UPDATED = "June 12, 2026";

export async function generateMetadata() {
  const settings = await getSettings();
  return buildMetadata({
    title: "Privacy Policy",
    description:
      "How the official Anita Prajapat website collects, uses and protects your information — booking inquiries, analytics and embedded content explained.",
    path: "/privacy-policy",
    defaults: seoDefaultsFromSettings(settings),
  });
}

export default async function PrivacyPolicyPage() {
  const settings = await getSettings();
  const email = settings.email || siteConfig.email;

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Privacy Policy", href: "/privacy-policy" }])} />
      <PageHeader
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle={`Last updated: ${LAST_UPDATED}`}
        crumbs={[{ name: "Privacy Policy" }]}
      />

      <section className="section">
        <div className={`container-narrow ${styles.policy}`}>
          <p>
            This website ({siteConfig.url.replace(/^https?:\/\//, "")}) is the official
            website of {siteConfig.name}, {siteConfig.categoryInline} from{" "}
            {siteConfig.city}, Rajasthan. We respect your privacy. This page explains,
            in plain language, what information the site collects and how it is used.
          </p>

          <h2>Information you give us</h2>
          <p>
            When you submit the <Link href="/contact">booking / inquiry form</Link>, we
            collect the details you enter — your name, phone number, and optionally your
            email, city, event type, event date and message. This information is used{" "}
            <strong>only to respond to your inquiry and arrange bookings</strong>. It is
            stored securely and handled by {siteConfig.name}&apos;s management team. We
            never sell or rent your personal information to anyone.
          </p>

          <h2>Information collected automatically</h2>
          <ul>
            <li>
              <strong>Analytics</strong> — the site may use Google Analytics to
              understand how visitors use it (pages viewed, approximate location,
              device type). This data is aggregated and does not personally identify
              you. See{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google&apos;s Privacy Policy
              </a>{" "}
              for how Google processes this data.
            </li>
            <li>
              <strong>Preferences</strong> — your theme choice (light/dark) is saved in
              your browser&apos;s local storage. It never leaves your device.
            </li>
            <li>
              <strong>Offline support</strong> — the site uses a service worker to cache
              pages on your device so it loads faster and works offline. This cache
              stays on your device and can be cleared from your browser settings.
            </li>
          </ul>

          <h2>Embedded content from other services</h2>
          <p>
            Some parts of the site load content from third parties: bhajan videos and
            thumbnails from <strong>YouTube</strong>, location maps from{" "}
            <strong>Google Maps</strong>, and images from <strong>Cloudinary</strong>.
            When that content loads, those services may receive standard technical data
            (such as your IP address) as with any website you visit. Their own privacy
            policies apply to that processing.
          </p>

          <h2>WhatsApp and phone contact</h2>
          <p>
            Booking links on this site open WhatsApp or your phone dialer. Any
            conversation that follows happens directly between you and{" "}
            {siteConfig.name}&apos;s management on those platforms, under their
            respective privacy policies.
          </p>

          <h2>How long we keep inquiry data</h2>
          <p>
            Booking inquiries are kept only as long as needed to handle your request and
            maintain a record of bookings. You can ask us to delete your inquiry details
            at any time.
          </p>

          <h2>Your choices</h2>
          <ul>
            <li>You can browse the entire site without submitting any personal information.</li>
            <li>You can block analytics with your browser settings or extensions — the site works fine without it.</li>
            <li>
              To ask what data we hold about you, or to have it corrected or deleted,
              email <a href={`mailto:${email}`}>{email}</a>.
            </li>
          </ul>

          <h2>Updates to this policy</h2>
          <p>
            If this policy changes, the new version will be published on this page with
            an updated date at the top.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy? Email{" "}
            <a href={`mailto:${email}`}>{email}</a> or reach out via the{" "}
            <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
