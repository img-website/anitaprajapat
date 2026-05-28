import Gallery from "@/models/Gallery";
import { createCollectionRoute } from "@/lib/crud";

export const { GET, POST } = createCollectionRoute(Gallery, {
  searchFields: ["title"],
  populate: [{ path: "category", select: "name slug" }],
});
