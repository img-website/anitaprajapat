import Bhajan from "@/models/Bhajan";
import { createItemRoute } from "@/lib/crud";

export const { GET, PUT, PATCH, DELETE } = createItemRoute(Bhajan, {
  slugFrom: "title",
  populate: [
    { path: "category", select: "name slug" },
    { path: "tags", select: "name slug" },
  ],
});
