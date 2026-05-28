import Category from "@/models/Category";
import { createItemRoute } from "@/lib/crud";

export const { GET, PUT, PATCH, DELETE } = createItemRoute(Category, {
  slugFrom: "name",
});
