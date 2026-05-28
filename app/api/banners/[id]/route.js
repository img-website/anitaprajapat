import Banner from "@/models/Banner";
import { createItemRoute } from "@/lib/crud";

export const { GET, PUT, PATCH, DELETE } = createItemRoute(Banner);
