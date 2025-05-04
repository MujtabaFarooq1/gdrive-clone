import { connectToDatabase } from "@/lib/mongodb";
import { withAuth } from "@/lib/withAuth";
import DriveItem from "@/models/driveItemModel";
import { NextResponse } from "next/server";

async function getDriveData(req) {
  try {
    await connectToDatabase();

    const userId = req.user.userId;

    const url = new URL(req.url);
    const folderId = url.searchParams.get("folderId");

    let filter = { userId };

    if (folderId) {
      filter.parentId = folderId;
    } else {
      filter.parentId = null;
    }

    const currentFolder = await DriveItem.findOne({
      _id: folderId,
      userId,
    })
      .select(`name type parentId`)
      .lean();

    const items = await DriveItem.find(filter).lean();

    return NextResponse.json({
      success: true,
      message: "Drive data fetched successfully",
      data: {
        items,
        currentFolder,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Failed to fetch drive data",
        data: null,
      },
      { status: 500 }
    );
  }
}

export const GET = withAuth(getDriveData);
