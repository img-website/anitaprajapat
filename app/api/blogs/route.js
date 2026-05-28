import Blog from "@/models/Blog";
import { createCollectionRoute } from "@/lib/crud";

export const { GET, POST } = createCollectionRoute(Blog, {
  slugFrom: "title",
  searchFields: ["title", "excerpt"],
  populate: [{ path: "category", select: "name slug" }],
});
