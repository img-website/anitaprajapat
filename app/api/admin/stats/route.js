import { apiHandler, ok } from "@/lib/apiHandler";
import Bhajan from "@/models/Bhajan";
import Blog from "@/models/Blog";
import Event from "@/models/Event";
import Gallery from "@/models/Gallery";
import ContactInquiry from "@/models/ContactInquiry";

// Dashboard analytics counts.
export const GET = apiHandler(
  async () => {
    const [
      bhajans,
      blogs,
      events,
      upcoming,
      gallery,
      inquiries,
      newInquiries,
      topBhajans,
    ] = await Promise.all([
      Bhajan.countDocuments(),
      Blog.countDocuments(),
      Event.countDocuments(),
      Event.countDocuments({ status: "upcoming" }),
      Gallery.countDocuments(),
      ContactInquiry.countDocuments(),
      ContactInquiry.countDocuments({ status: "new" }),
      Bhajan.find().sort("-views").limit(5).select("title views").lean(),
    ]);

    return ok({
      data: {
        counts: { bhajans, blogs, events, upcoming, gallery, inquiries, newInquiries },
        topBhajans,
      },
    });
  },
  { protected: true }
);
