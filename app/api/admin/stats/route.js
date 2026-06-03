import { apiHandler, ok } from "@/lib/apiHandler";
import { getYouTubeData } from "@/services/youtube";
import Bhajan from "@/models/Bhajan";
import Blog from "@/models/Blog";
import Event from "@/models/Event";
import Gallery from "@/models/Gallery";
import ContactInquiry from "@/models/ContactInquiry";
import Testimonial from "@/models/Testimonial";
import Sponsor from "@/models/Sponsor";

// Dashboard analytics — counts, top content, recent inquiries, 6-month chart.
export const GET = apiHandler(
  async () => {
    // Last 6 months labels
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i);
      months.push({
        label: d.toLocaleString("en-IN", { month: "short" }),
        start: new Date(d.getFullYear(), d.getMonth(), 1),
        end: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59),
      });
    }

    const [
      bhajans, blogs, events, upcoming, gallery,
      inquiries, newInquiries, testimonials, sponsors,
      recentInquiries, ytData,
      ...monthlyInquiries
    ] = await Promise.all([
      Bhajan.countDocuments(),
      Blog.countDocuments(),
      Event.countDocuments(),
      Event.countDocuments({ status: "upcoming" }),
      Gallery.countDocuments({ isActive: true }),
      ContactInquiry.countDocuments(),
      ContactInquiry.countDocuments({ status: "new" }),
      Testimonial.countDocuments({ isActive: true }),
      Sponsor.countDocuments({ isActive: true }),
      ContactInquiry.find().sort("-createdAt").limit(5)
        .select("name phone type status createdAt city").lean(),
      // YouTube popular videos — sorted by view count, already cached 1hr.
      getYouTubeData().catch(() => ({ popular: [] })),
      ...months.map((m) =>
        ContactInquiry.countDocuments({ createdAt: { $gte: m.start, $lte: m.end } })
      ),
    ]);

    // Top 6 YouTube videos by views (only those with view data)
    const topVideos = (ytData?.popular || [])
      .filter((v) => v.views > 0)
      .slice(0, 6)
      .map((v) => ({ id: v.id, title: v.title, views: v.views, url: v.url }));

    const chart = months.map((m, i) => ({ month: m.label, inquiries: monthlyInquiries[i] }));

    return ok({
      data: {
        counts: { bhajans, blogs, events, upcoming, gallery, inquiries, newInquiries, testimonials, sponsors },
        topVideos,
        recentInquiries,
        chart,
      },
    });
  },
  { protected: true }
);
