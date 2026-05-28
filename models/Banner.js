import mongoose from "mongoose";
import { mediaSchema } from "./_shared";

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: mediaSchema, default: () => ({}) },
    videoUrl: { type: String, default: "" },
    primaryCtaLabel: { type: String, default: "" },
    primaryCtaUrl: { type: String, default: "" },
    secondaryCtaLabel: { type: String, default: "" },
    secondaryCtaUrl: { type: String, default: "" },
    placement: {
      type: String,
      enum: ["hero", "promo", "section"],
      default: "hero",
      index: true,
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Banner || mongoose.model("Banner", bannerSchema);
