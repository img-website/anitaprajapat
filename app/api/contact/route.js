import { z } from "zod";
import ContactInquiry from "@/models/ContactInquiry";
import { apiHandler, ok, fail, paginated } from "@/lib/apiHandler";
import { parseListParams } from "@/utils/helpers";
import { rateLimit, clientIp } from "@/lib/rateLimit";

const schema = z.object({
  name: z.string().min(2),
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal("")),
  subject: z.string().optional(),
  eventType: z.string().optional(),
  eventDate: z.string().optional(),
  city: z.string().optional(),
  message: z.string().min(5),
  type: z.enum(["general", "booking", "media"]).optional(),
});

// Public: submit an inquiry (rate limited).
export const POST = apiHandler(async (req) => {
  const rl = rateLimit(`contact:${clientIp(req)}`, { limit: 5, windowMs: 60_000 });
  if (!rl.ok) return fail("Too many requests. Please try again shortly.", 429);

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return fail("Please check the form fields", 422, {
      errors: parsed.error.flatten().fieldErrors,
    });
  }

  const doc = await ContactInquiry.create(parsed.data);
  return ok({ data: { _id: doc._id } }, { status: 201 });
});

// Protected: list inquiries for the admin inbox.
export const GET = apiHandler(
  async (req) => {
    const { page, limit, skip, q, status, sort } = parseListParams(req);
    const filter = {};
    if (status) filter.status = status;
    if (q) filter.$or = ["name", "phone", "email", "message"].map((f) => ({
      [f]: { $regex: q, $options: "i" },
    }));

    const [items, total] = await Promise.all([
      ContactInquiry.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      ContactInquiry.countDocuments(filter),
    ]);
    return ok(paginated(items, total, { page, limit }));
  },
  { protected: true }
);
