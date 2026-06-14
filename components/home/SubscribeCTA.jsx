import { siteConfig } from "@/lib/siteConfig";
import { youtubeSubscribeUrl } from "@/utils/helpers";
import { PlayCircle } from "lucide-react";
import {
  YoutubeIcon,
  InstagramIcon,
  FacebookIcon,
  PinterestIcon,
} from "@/components/ui/BrandIcons";
import Reveal from "@/components/ui/Reveal";
import styles from "./SubscribeCTA.module.scss";

// Primary conversion goal: turn visitors into YouTube subscribers + social
// followers. Server-rendered (no client JS beyond the shared Reveal island).
const FOLLOW = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
  { key: "pinterest", label: "Pinterest", Icon: PinterestIcon },
];

export default function SubscribeCTA({ settings = {} }) {
  const social = { ...siteConfig.social, ...(settings.social || {}) };
  const subscribe = youtubeSubscribeUrl(social.youtube || siteConfig.social.youtube);
  const subs = settings.counters?.youtubeSubscribers;

  return (
    <section className={`section ${styles.wrap}`}>
      <div className="container">
        <Reveal variant="scale" className={styles.band}>
          <span className={styles.eyebrow}>
            <YoutubeIcon size={15} /> On YouTube
          </span>
          <h2 className={styles.title}>New Bhajans Every Week — Subscribe Free</h2>
          <p className={styles.lead}>
            Join the devotee community and never miss a Sanwariya Seth, Khatu Shyam or
            Mataji bhajan.{subs ? ` Already ${subs} subscribers strong.` : ""} Tap
            subscribe, then follow Anita Prajapat everywhere you listen.
          </p>

          <a
            href={subscribe}
            target="_blank"
            rel="noopener noreferrer"
            title="Subscribe to Anita Prajapat on YouTube for Sanwariya Seth & Khatu Shyam bhajans"
            className={`btn btn-lg shine ${styles.subscribe}`}
          >
            <PlayCircle size={20} /> Subscribe on YouTube
          </a>

          <div className={styles.follow}>
            {FOLLOW.map(({ key, label, Icon }) =>
              social[key] ? (
                <a
                  key={key}
                  href={social[key]}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-net={key}
                  title={`Follow Anita Prajapat on ${label}`}
                  aria-label={`Follow Anita Prajapat on ${label}`}
                >
                  <Icon size={18} /> <span>{label}</span>
                </a>
              ) : null
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
