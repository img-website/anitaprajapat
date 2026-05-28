import mongoose from "mongoose";
import { mediaSchema } from "./_shared";

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    mediaType: {
      type: String,
      enum: ["image", "video", "reel"],
      default: "image",
      index: true,
    },
    image: { type: mediaSchema, default: () => ({}) },
    videoUrl: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Gallery ||
  mongoose.model("Gallery", gallerySchema);
