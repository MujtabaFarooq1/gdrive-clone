// lib/cloudinary.js
import { appConfig } from "@/config/app";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: appConfig.cloudinary.cloudName,
  api_key: appConfig.cloudinary.apiKey,
  api_secret: appConfig.cloudinary.apiSecret,
});

export default cloudinary;
