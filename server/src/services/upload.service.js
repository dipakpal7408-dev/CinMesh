const cloudinary = require("../config/cloudinary");
const streamifier = require("stream");

const uploadBuffer = (buffer, folder = "cinmesh") => {
  return new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      return reject(new Error("Cloudinary is not configured on this server"));
    }
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    const readable = new streamifier.Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(stream);
  });
};

const destroyAsset = (publicId) => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || !publicId) return Promise.resolve();
  return cloudinary.uploader.destroy(publicId);
};

module.exports = { uploadBuffer, destroyAsset };
