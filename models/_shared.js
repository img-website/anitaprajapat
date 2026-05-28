import mongoose from "mongoose";

// Reusable embedded SEO block attached to most content documents.
export const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    keywords: { type: [String], default: [] },
    canonical: { type: String, default: "" },
    ogImage: { type: String, default: "" },
    noindex: { type: Boolean, default: false },
  },
  { _id: false }
);

// Reusable media reference (Cloudinary).
export const mediaSchema = new mongoose.Schema(
  {
    url: { type: String, default: "" },
    publicId: { type: String, default: "" },
    width: Number,
    height: Number,
    alt: { type: String, default: "" },
  },
  { _id: false }
);
