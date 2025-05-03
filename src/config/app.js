import { serverEnv } from "./env";

export const appConfig = {
  cookies: {
    sessionMaxAge: 60 * 60 * 24 * 7,
    secure: serverEnv.NODE_ENV === "production",
  },
  cloudinary: {
    cloudName: serverEnv.CLOUDINARY_CLOUD_NAME,
    apiKey: serverEnv.CLOUDINARY_API_KEY,
    apiSecret: serverEnv.CLOUDINARY_API_SECRET,
    folderName: serverEnv.CLOUDINARY_STORAGE_FOLDER,
  },
};
