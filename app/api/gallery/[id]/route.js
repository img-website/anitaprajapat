import Gallery from "@/models/Gallery";
import { createItemRoute } from "@/lib/crud";

export const { GET, PUT, PATCH, DELETE } = createItemRoute(Gallery);
