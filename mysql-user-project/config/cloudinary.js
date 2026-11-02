require("dotenv").config();

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const ensureConfigured = () => {
  const missing = [
    ["CLOUDINARY_CLOUD_NAME", process.env.CLOUDINARY_CLOUD_NAME],
    ["CLOUDINARY_API_KEY", process.env.CLOUDINARY_API_KEY],
    ["CLOUDINARY_API_SECRET", process.env.CLOUDINARY_API_SECRET]
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length) {
    const error = new Error(
      `Cloudinary is not configured. Set ${missing.join(", ")} in .env.`
    );
    error.statusCode = 503;
    throw error;
  }
};

const uploadImage = (buffer) => {
  ensureConfigured();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || "products",
        resource_type: "image"
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary returned no upload result."));

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          size: result.bytes
        });
      }
    );

    stream.end(buffer);
  });
};

const deleteImage = async (publicId) => {
  if (!publicId) return;
  ensureConfigured();

  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image"
  });

  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Cloudinary could not delete image '${publicId}'.`);
  }
};

const isCloudinaryUrl = (url) => {
  if (!url) return false;

  try {
    return new URL(url).hostname === "res.cloudinary.com";
  } catch {
    return false;
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  isCloudinaryUrl
};
