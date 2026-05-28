import Testimonial from "@/models/Testimonial";
import { createCollectionRoute } from "@/lib/crud";

export const { GET, POST } = createCollectionRoute(Testimonial, {
  searchFields: ["name", "message"],
});
