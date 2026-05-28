import User from "@/models/User";
import { apiHandler, ok, paginated } from "@/lib/apiHandler";
import { parseListParams } from "@/utils/helpers";

// List users (admin only — role-gated).
export const GET = apiHandler(
  async (req) => {
    const { page, limit, skip, q, sort } = parseListParams(req);
    const filter = q
      ? { $or: [{ name: { $regex: q, $options: "i" } }, { email: { $regex: q, $options: "i" } }] }
      : {};
    const [items, total] = await Promise.all([
      User.find(filter).select("-password").sort(sort).skip(skip).limit(limit).lean(),
      User.countDocuments(filter),
    ]);
    return ok(paginated(items, total, { page, limit }));
  },
  { protected: true, role: "admin" }
);

// Create a user (admin only). Password is hashed by the model pre-save hook.
export const POST = apiHandler(
  async (req) => {
    const { name, email, password, role } = await req.json();
    const user = await User.create({ name, email, password, role });
    const obj = user.toObject();
    delete obj.password;
    return ok({ data: obj }, { status: 201 });
  },
  { protected: true, role: "admin" }
);
