import mongoose from "mongoose";

const contactInquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, default: "", lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    subject: { type: String, default: "" },
    eventType: { type: String, default: "" },
    eventDate: { type: Date },
    city: { type: String, default: "" },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["general", "booking", "media"],
      default: "general",
      index: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "closed"],
      default: "new",
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ContactInquiry ||
  mongoose.model("ContactInquiry", contactInquirySchema);
