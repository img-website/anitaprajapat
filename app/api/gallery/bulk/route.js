import Gallery from "@/models/Gallery";
import { apiHandler, ok, fail } from "@/lib/apiHandler";

// Accepts an array of gallery items and inserts them all at once.
export const POST = apiHandler(
  async (req) => {
    const items = await req.json();
    if (!Array.isArray(items) || items.length === 0)
      return fail("Expected a non-empty array of gallery items", 400);
    if (items.length > 50)
      return fail("Max 50 images per bulk upload", 400);

    const docs = await Gallery.insertMany(
      items.map((it) => ({ ...it, mediaType: "image", isActive: true })),
      { ordered: false } // insert others even if one fails validation
    );
    return ok({ data: docs }, { status: 201 });
  },
  { protected: true }
);
