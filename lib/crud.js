import { apiHandler, ok, fail, paginated } from "@/lib/apiHandler";
import { parseListParams, makeSlug } from "@/utils/helpers";

/**
 * Generic REST factory for a Mongoose model.
 *
 * createCollectionRoute(Model, options) -> { GET, POST }
 *   GET  /api/<resource>            list (pagination, search, filter, sort)
 *   POST /api/<resource>            create (protected)
 *
 * createItemRoute(Model, options)  -> { GET, PUT, PATCH, DELETE }
 *   operates on [id] OR [slug] segment.
 */

async function ensureUniqueSlug(Model, base, excludeId) {
  let slug = base || "item";
  let n = 1;
  for (;;) {
    const existing = await Model.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    })
      .select("_id")
      .lean();
    if (!existing) return slug;
    slug = `${base}-${++n}`;
  }
}

export function createCollectionRoute(Model, options = {}) {
  const {
    searchFields = [],
    slugFrom = null, // field to derive slug from on create
    defaultFilter = {},
    populate = [],
    allowText = true,
  } = options;

  const GET = apiHandler(async (req) => {
    const { page, limit, skip, q, category, tag, status, sort } =
      parseListParams(req);

    const filter = { ...defaultFilter };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (tag) filter.tags = tag;

    if (q) {
      if (allowText && Model.schema.indexes().some(([def]) => def._fts)) {
        filter.$text = { $search: q };
      } else if (searchFields.length) {
        filter.$or = searchFields.map((f) => ({
          [f]: { $regex: q, $options: "i" },
        }));
      }
    }

    let query = Model.find(filter).sort(sort).skip(skip).limit(limit);
    populate.forEach((p) => (query = query.populate(p)));

    const [items, total] = await Promise.all([
      query.lean(),
      Model.countDocuments(filter),
    ]);

    return ok(paginated(items, total, { page, limit }));
  });

  const POST = apiHandler(
    async (req) => {
      const payload = await req.json();
      if (slugFrom) {
        const base = makeSlug(payload.slug || payload[slugFrom]);
        payload.slug = await ensureUniqueSlug(Model, base);
      }
      const doc = await Model.create(payload);
      return ok({ data: doc }, { status: 201 });
    },
    { protected: true }
  );

  return { GET, POST };
}

export function createItemRoute(Model, options = {}) {
  const { slugFrom = null, populate = [], by = "id" } = options;

  async function findDoc(ctx) {
    const params = await ctx.params;
    const key = params.id ?? params.slug;
    const filter = by === "slug" ? { slug: key } : { _id: key };
    let query = Model.findOne(filter);
    populate.forEach((p) => (query = query.populate(p)));
    return query;
  }

  const GET = apiHandler(async (_req, ctx) => {
    const doc = await (await findDoc(ctx)).lean();
    if (!doc) return fail("Not found", 404);
    return ok({ data: doc });
  });

  const PUT = apiHandler(
    async (req, ctx) => {
      const params = await ctx.params;
      const id = params.id ?? params.slug;
      const payload = await req.json();

      if (slugFrom && (payload.slug || payload[slugFrom])) {
        const base = makeSlug(payload.slug || payload[slugFrom]);
        const current = await Model.findById(id).select("_id");
        payload.slug = await ensureUniqueSlug(Model, base, current?._id);
      }

      const doc = await Model.findByIdAndUpdate(id, payload, {
        returnDocument: "after",
        runValidators: true,
      });
      if (!doc) return fail("Not found", 404);
      return ok({ data: doc });
    },
    { protected: true }
  );

  const PATCH = PUT;

  const DELETE = apiHandler(
    async (_req, ctx) => {
      const params = await ctx.params;
      const id = params.id ?? params.slug;
      const doc = await Model.findByIdAndDelete(id);
      if (!doc) return fail("Not found", 404);
      return ok({ data: { _id: id } });
    },
    { protected: true }
  );

  return { GET, PUT, PATCH, DELETE };
}
