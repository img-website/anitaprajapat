import Bhajan from "@/models/Bhajan";
import { createCollectionRoute } from "@/lib/crud";

export const { GET, POST } = createCollectionRoute(Bhajan, {
  slugFrom: "title",
  searchFields: ["title", "description"],
  populate: [{ path: "category", select: "name slug" }],
});
