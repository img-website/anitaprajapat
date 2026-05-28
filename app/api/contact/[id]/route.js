import ContactInquiry from "@/models/ContactInquiry";
import { createItemRoute } from "@/lib/crud";

// GET/PUT/PATCH/DELETE a single inquiry (status updates from admin inbox).
export const { GET, PUT, PATCH, DELETE } = createItemRoute(ContactInquiry);
