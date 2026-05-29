import cloudinary from "@/lib/cloudinary";
import { apiHandler, ok, fail } from "@/lib/apiHandler";

// Returns a short-lived signature so the browser can upload large files
// (e.g. audio) DIRECTLY to Cloudinary — bypassing the serverless request-body
// size limit. Secrets stay on the server; only api_key + signature are sent.
export const POST = apiHandler(
  async (req) => {
    const { folder = "anitaprajapat" } = await req.json().catch(() => ({}));

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      return fail("Cloudinary is not configured on the server.", 500);
    }

    const timestamp = Math.round(Date.now() / 1000);
    const signature = cloudinary.utils.api_sign_request(
      { folder, timestamp },
      apiSecret
    );

    return ok({ data: { cloudName, apiKey, timestamp, folder, signature } });
  },
  { protected: true }
);
