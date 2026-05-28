import MediaCoverage from "@/models/MediaCoverage";
import { createCollectionRoute } from "@/lib/crud";

export const { GET, POST } = createCollectionRoute(MediaCoverage, {
  slugFrom: "title",
  searchFields: ["title", "outlet", "excerpt"],
});
