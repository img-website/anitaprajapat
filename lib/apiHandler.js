import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { auth } from "@/lib/auth";

export function ok(data, init = {}) {
  return NextResponse.json({ success: true, ...data }, init);
}

export function fail(message, status = 400, extra = {}) {
  return NextResponse.json(
    { success: false, message, ...extra },
    { status }
  );
}

/**
 * Wrap a route handler with DB connection + error handling.
 * Pass { protected: true } to require an authenticated admin session.
 *
 * Usage:
 *   export const GET = apiHandler(async (req, ctx) => { ... });
 *   export const POST = apiHandler(async (req, ctx) => { ... }, { protected: true });
 */
export function apiHandler(fn, options = {}) {
  return async (req, ctx) => {
    try {
      await connectDB();

      if (options.protected) {
        const session = await auth();
        if (!session?.user) return fail("Unauthorized", 401);
        if (options.role && session.user.role !== options.role) {
          return fail("Forbidden", 403);
        }
        ctx = { ...ctx, session };
      }

      return await fn(req, ctx);
    } catch (err) {
      console.error("[API ERROR]", err);
      if (err?.name === "ValidationError") {
        return fail("Validation failed", 422, {
          errors: Object.fromEntries(
            Object.entries(err.errors).map(([k, v]) => [k, v.message])
          ),
        });
      }
      if (err?.code === 11000) {
        return fail("A record with that value already exists", 409, {
          fields: err.keyValue,
        });
      }
      return fail(err.message || "Internal server error", 500);
    }
  };
}

/** Build a standard paginated response envelope. */
export function paginated(items, total, { page, limit }) {
  return {
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasMore: page * limit < total,
    },
  };
}
