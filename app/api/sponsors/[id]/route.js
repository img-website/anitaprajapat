import Sponsor from "@/models/Sponsor";
import { createItemRoute } from "@/lib/crud";

export const { GET, PUT, PATCH, DELETE } = createItemRoute(Sponsor);
