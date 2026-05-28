import mongoose from "mongoose";

// Singleton-ish global site settings document (use key: "global").
// Powers the CMS: branding, contact, social, theme colors, homepage section
// ordering, and toggles — all editable from the admin dashboard.
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: "global", unique: true },

    siteName: { type: String, default: "Anita Prajapat" },
    tagline: { type: String, default: "Rajasthani Devotional Singer" },
    logo: { type: String, default: "" },
    favicon: { type: String, default: "" },

    phone: { type: String, default: "8302598435" },
    whatsapp: { type: String, default: "918302598435" },
    email: { type: String, default: "anitaprajapat.superstar@gmail.com" },
    manager: { type: String, default: "Jitendra Kumar Bijarnia" },
    address: { type: String, default: "Jaipur, Rajasthan" },

    social: {
      youtube: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      pinterest: { type: String, default: "" },
    },

    // Featured hero video (shown in the homepage bento highlight card).
    featuredVideo: { type: String, default: "" },
    featuredVideoTitle: { type: String, default: "" },

    // Homepage bento grid — all tiles editable from admin.
    bento: {
      featureChip: { type: String, default: "Live Devotional Experience" },
      statLabel: { type: String, default: "Stage shows & live jagrans" },
      bookTitle: { type: String, default: "Book for your Jagran" },
      bookCta: { type: String, default: "Chat on WhatsApp" },
      repertoireLabel: { type: String, default: "Repertoire" },
      repertoireItems: { type: [String], default: [] },
      youtubeTitle: { type: String, default: "Watch on YouTube" },
      youtubeSubtitle: { type: String, default: "New bhajans every week" },
      portraitImage: { type: String, default: "" },
      portraitTag: { type: String, default: "Jaipur" },
      storyChip: { type: String, default: "Artist Journey" },
      storyTitle: { type: String, default: "Traditional roots, modern stage presence" },
      storyDescription: {
        type: String,
        default:
          "Explore Anita Prajapat's story, live journey and devotional milestones.",
      },
      storyLinkLabel: { type: String, default: "Read full story" },
      storyHref: { type: String, default: "/about" },
    },

    counters: {
      youtubeSubscribers: { type: String, default: "" },
      instagramFollowers: { type: String, default: "" },
      facebookFollowers: { type: String, default: "" },
      stageShows: { type: String, default: "4389+" },
    },
    countersLastSyncedAt: { type: Date },

    theme: {
      primary: { type: String, default: "#b71c1c" }, // deep red
      gold: { type: String, default: "#d4af37" },
      dark: { type: String, default: "#0d0a09" },
      defaultMode: { type: String, enum: ["light", "dark"], default: "dark" },
    },

    // Homepage section ordering + visibility (drives dynamic CMS rendering).
    homepageSections: {
      type: [
        new mongoose.Schema(
          {
            key: String,
            label: String,
            enabled: { type: Boolean, default: true },
            order: { type: Number, default: 0 },
          },
          { _id: false }
        ),
      ],
      default: [],
    },

    seo: {
      defaultTitle: { type: String, default: "" },
      defaultDescription: { type: String, default: "" },
      keywords: { type: [String], default: [] },
      ogImage: { type: String, default: "" },
      gscVerification: { type: String, default: "" },
      gaMeasurementId: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", settingsSchema);
