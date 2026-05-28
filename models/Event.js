import mongoose from "mongoose";
import { seoSchema, mediaSchema } from "./_shared";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    type: {
      type: String,
      enum: ["jagran", "concert", "private", "temple", "other"],
      default: "jagran",
    },
    venue: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "Rajasthan" },
    address: { type: String, default: "" },
    mapEmbed: { type: String, default: "" },
    date: { type: Date, required: true },
    startTime: { type: String, default: "" },
    coverImage: { type: mediaSchema, default: () => ({}) },
    gallery: { type: [mediaSchema], default: [] },
    ticketUrl: { type: String, default: "" },
    isFeatured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["upcoming", "past", "cancelled"],
      default: "upcoming",
      index: true,
    },
    seo: { type: seoSchema, default: () => ({}) },
  },
  { timestamps: true }
);

eventSchema.index({ title: "text", description: "text", venue: "text", city: "text" });

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
