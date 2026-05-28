import Settings from "@/models/Settings";
import { apiHandler, ok } from "@/lib/apiHandler";
import { fetchSocialCounters } from "@/lib/socialCounters";

export const POST = apiHandler(
  async () => {
    const current = (await Settings.findOne({ key: "global" })) || (await Settings.create({ key: "global" }));
    const { counters, report } = await fetchSocialCounters(current);
    current.counters = { ...(current.counters?.toObject?.() || current.counters || {}), ...counters };
    current.countersLastSyncedAt = new Date();
    await current.save();
    return ok({
      data: current.toObject(),
      report,
      message: "Social counters sync completed",
    });
  },
  { protected: true }
);
