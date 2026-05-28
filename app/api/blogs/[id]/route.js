import Blog from "@/models/Blog";
import { createItemRoute } from "@/lib/crud";

export const { GET, PUT, PATCH, DELETE } = createItemRoute(Blog, {
  slugFrom: "title",
  populate: [
    { path: "category", select: "name slug" },
    { path: "tags", select: "name slug" },
  ],
});
