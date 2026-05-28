import Testimonial from "@/models/Testimonial";
import { createItemRoute } from "@/lib/crud";

export const { GET, PUT, PATCH, DELETE } = createItemRoute(Testimonial);
