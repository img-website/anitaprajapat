import mongoose from "mongoose";

// Page-level SEO overrides, keyed by a route path (e.g. "/", "/about").
const seoModelSchema = new mongoose.Schema(
  {
    path: { type: String, required: true, unique: true, lowercase: true, trim: true },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    keywords: { type: [String], default: [] },
    ogImage: { type: String, default: "" },
    canonical: { type: String, default: "" },
    noindex: { type: Boolean, default: false },
    jsonLd: { type: String, default: "" }, // optional raw JSON-LD string
  },
  { timestamps: true }
);

export default mongoose.models.SEO || mongoose.model("SEO", seoModelSchema);
