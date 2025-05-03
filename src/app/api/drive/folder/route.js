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

    return NextResponse.json({ success: true, data: folder });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

async function renameDriveFolder(req) {
  try {
    const { id, newName } = await req.json();
    if (!id || !newName) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const updated = await DriveItem.findOneAndUpdate(
      { _id: id, type: "folder" },
      { name: newName },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

async function deleteDriveFolder(req) {
  try {
    const { id } = await req.json();
    await connectToDatabase();
    await DriveItem.deleteOne({ _id: id, type: "folder" });

    return NextResponse.json({ success: true, message: "Folder deleted" });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

export const POST = withAuth(createDriveFolder);
export const PATCH = withAuth(renameDriveFolder);
export const DELETE = withAuth(deleteDriveFolder);
