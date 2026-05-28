import Event from "@/models/Event";
import { createItemRoute } from "@/lib/crud";

export const { GET, PUT, PATCH, DELETE } = createItemRoute(Event, {
  slugFrom: "title",
});
