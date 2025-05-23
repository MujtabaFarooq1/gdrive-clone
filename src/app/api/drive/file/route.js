import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { withAuth } from "@/lib/withAuth";
import DriveItem from "@/models/driveItemModel";
import cloudinary from "@/lib/cloudinary";
import { appConfig } from "@/config/app";
import { serverEnv } from "@/config/env";

async function uploadFile(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");
    const parentId = data.get("parentId") || null;
    const userId = req.user.userId;

    if (!file || typeof file === "string") {
      return NextResponse.json(
        {
          success: false,
          message: "No file uploaded",
          data: null,
        },
        { status: 400 }
      );
    }

    if (file.size > serverEnv.MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: `File exceeds ${serverEnv.MAX_FILE_SIZE} B limit`,
          data: null,
        },
        { status: 413 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploaded = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: appConfig.cloudinary.folderName,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        )
        .end(buffer);
    });

    await connectToDatabase();

    const newItem = await DriveItem.create({
      name: file?.name || `${new Date().getTime()}-file`,
      type: "file",
      mimeType: uploaded.resource_type,
      extension: uploaded.format,
      parentId,
      size: uploaded.bytes,
      userId,
      url: uploaded?.secure_url,
    });

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: newItem,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Server error",
        data: null,
      },
      { status: 500 }
    );
  }
}

export const POST = withAuth(uploadFile);
