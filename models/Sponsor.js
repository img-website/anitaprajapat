import mongoose from "mongoose";
import { mediaSchema } from "./_shared";

const sponsorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    logo: { type: mediaSchema, default: () => ({}) },
    website: { type: String, default: "" },
    tier: {
      type: String,
      enum: ["partner", "sponsor", "media"],
      default: "sponsor",
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Sponsor ||
  mongoose.model("Sponsor", sponsorSchema);
