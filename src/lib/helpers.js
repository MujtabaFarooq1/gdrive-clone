export function extractPublicIdFromCloudinaryUrl(cloudinaryUrl) {
  const urlParts = cloudinaryUrl.split("/");

  const publicIdWithFolder = urlParts
    .slice(urlParts.indexOf("upload") + 1)
    .join("/");

  const publicId = publicIdWithFolder
    .replace(/^v\d+\//, "")
    .replace(/\.[^/.]+$/, "");

  return publicId;
}
