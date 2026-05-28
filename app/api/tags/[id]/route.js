import Tag from "@/models/Tag";
import { createItemRoute } from "@/lib/crud";

export const { GET, PUT, PATCH, DELETE } = createItemRoute(Tag, {
  slugFrom: "name",
});
