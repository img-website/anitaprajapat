import Quote from "@/models/Quote";
import { createItemRoute } from "@/lib/crud";

export const { GET, PUT, PATCH, DELETE } = createItemRoute(Quote);
