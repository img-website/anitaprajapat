import Event from "@/models/Event";
import { createCollectionRoute } from "@/lib/crud";

export const { GET, POST } = createCollectionRoute(Event, {
  slugFrom: "title",
  searchFields: ["title", "venue", "city"],
});
