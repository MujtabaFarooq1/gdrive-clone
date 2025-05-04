import { NextResponse } from "next/server";
import { withAuth } from "@/lib/withAuth";
import { connectToDatabase } from "@/lib/mongodb";
import DriveItem from "@/models/driveItemModel";

async function createDriveFolder(req) {
  try {
    const { name, parentId = null } = await req.json();

    await connectToDatabase();

    const folder = await DriveItem.create({
      name,
      type: "folder",
      parentId,
      userId: req.user.userId,
    });

    return NextResponse.json({
      success: true,
      message: "Folder created successfully",
      data: folder,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Server error",
        data: null,
      },
      { status: 500 }
    );
  }
}

export const POST = withAuth(createDriveFolder);
