import mongoose from "mongoose";
import { seoSchema, mediaSchema } from "./_shared";

const bhajanSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    lyrics: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    audioUrl: { type: String, default: "" },
    thumbnail: { type: mediaSchema, default: () => ({}) },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
    genre: { type: String, default: "" },
    views: { type: Number, default: 0 },
    isTrending: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },
    order: { type: Number, default: 0 },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true }
);

bhajanSchema.index({ title: "text", description: "text", lyrics: "text" });

export default mongoose.models.Bhajan ||
  mongoose.model("Bhajan", bhajanSchema);
