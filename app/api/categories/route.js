import Category from "@/models/Category";
import { createCollectionRoute } from "@/lib/crud";

export const { GET, POST } = createCollectionRoute(Category, {
  slugFrom: "name",
  searchFields: ["name"],
});
