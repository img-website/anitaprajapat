import Banner from "@/models/Banner";
import { createCollectionRoute } from "@/lib/crud";

export const { GET, POST } = createCollectionRoute(Banner, {
  searchFields: ["title", "subtitle"],
});
