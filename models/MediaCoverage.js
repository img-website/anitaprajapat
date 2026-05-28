import mongoose from "mongoose";
import { mediaSchema } from "./_shared";

const mediaCoverageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    outlet: { type: String, default: "" }, // publication / channel name
    type: {
      type: String,
      enum: ["news", "article", "interview", "press", "video"],
      default: "news",
      index: true,
    },
    excerpt: { type: String, default: "" },
    externalUrl: { type: String, default: "" },
    embedUrl: { type: String, default: "" },
    image: { type: mediaSchema, default: () => ({}) },
    publishedAt: { type: Date },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.MediaCoverage ||
  mongoose.model("MediaCoverage", mediaCoverageSchema);
