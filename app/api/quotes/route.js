import Quote from "@/models/Quote";
import { createCollectionRoute } from "@/lib/crud";

export const { GET, POST } = createCollectionRoute(Quote, {
  searchFields: ["text", "author"],
});
