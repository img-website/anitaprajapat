import Settings from "@/models/Settings";
import { apiHandler, ok } from "@/lib/apiHandler";

// Public GET of the global settings singleton.
export const GET = apiHandler(async () => {
  let doc = await Settings.findOne({ key: "global" }).lean();
  if (!doc) doc = await Settings.create({ key: "global" });
  return ok({ data: doc });
});

// Protected upsert of settings (admin CMS).
export const PUT = apiHandler(
  async (req) => {
    const payload = await req.json();
    delete payload._id;
    payload.key = "global";
    const doc = await Settings.findOneAndUpdate({ key: "global" }, payload, {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
    });
    return ok({ data: doc });
  },
  { protected: true }
);
