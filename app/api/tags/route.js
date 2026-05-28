import Tag from "@/models/Tag";
import { createCollectionRoute } from "@/lib/crud";

export const { GET, POST } = createCollectionRoute(Tag, {
  slugFrom: "name",
  searchFields: ["name"],
});
