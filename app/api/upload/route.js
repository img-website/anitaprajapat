import { apiHandler, ok, fail } from "@/lib/apiHandler";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

// Protected media upload. Accepts a base64 data-URI (or remote URL) in `file`.
// Client typically reads a File via FileReader.readAsDataURL.
export const POST = apiHandler(
  async (req) => {
    const { file, folder } = await req.json();
    if (!file) return fail("No file provided", 400);
    const result = await uploadToCloudinary(file, folder || "anitaprajapat");
    return ok({ data: result }, { status: 201 });
  },
  { protected: true }
);

// Protected delete by Cloudinary publicId.
export const DELETE = apiHandler(
  async (req) => {
    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get("publicId");
    const resourceType = searchParams.get("resourceType") || "image";
    if (!publicId) return fail("publicId required", 400);
    await deleteFromCloudinary(publicId, resourceType);
    return ok({ data: { publicId } });
  },
  { protected: true }
);
