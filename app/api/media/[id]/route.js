import MediaCoverage from "@/models/MediaCoverage";
import { createItemRoute } from "@/lib/crud";

export const { GET, PUT, PATCH, DELETE } = createItemRoute(MediaCoverage, {
  slugFrom: "title",
});
