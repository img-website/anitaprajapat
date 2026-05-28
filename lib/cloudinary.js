import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a base64 / data-uri / remote URL to Cloudinary.
 * @param {string} file - data URI or URL
 * @param {string} folder - target folder
 */
export async function uploadToCloudinary(file, folder = "anitaprajapat") {
  const res = await cloudinary.uploader.upload(file, {
    folder,
    resource_type: "auto",
  });
  return {
    url: res.secure_url,
    publicId: res.public_id,
    width: res.width,
    height: res.height,
    format: res.format,
    resourceType: res.resource_type,
  };
}

export async function deleteFromCloudinary(publicId, resourceType = "image") {
  if (!publicId) return null;
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export default cloudinary;
