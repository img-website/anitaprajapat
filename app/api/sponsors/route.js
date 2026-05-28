import Sponsor from "@/models/Sponsor";
import { createCollectionRoute } from "@/lib/crud";

export const { GET, POST } = createCollectionRoute(Sponsor, {
  searchFields: ["name"],
});
