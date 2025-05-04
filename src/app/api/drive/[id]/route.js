import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import DriveItem from "@/models/driveItemModel";
import { withAuth } from "@/lib/withAuth";
import cloudinary from "@/lib/cloudinary";
import { extractPublicIdFromCloudinaryUrl } from "@/lib/helpers";

async function renameDriveItem(req, { params }) {
  try {
    const userId = req.user.userId;

    await connectToDatabase();

    const { name } = await req.json();
    const { id } = await params;

    if (!id || !name?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request",
          data: null,
        },
        { status: 400 }
      );
    }

    const foundItem = await DriveItem.findById(id);

    if (foundItem.userId.toString() !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized request",
          data: null,
        },
        { status: 401 }
      );
    }

    if (!foundItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found",
          data: null,
        },
        { status: 404 }
      );
    }

    foundItem.name = name.trim();
    await foundItem.save();

    return NextResponse.json({
      success: true,
      message: `${foundItem.type.toUpperCase()} renamed to "${name}" successfully`,
      data: foundItem,
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

async function deleteItemAndChildren(itemId, visited) {
  if (visited.has(itemId.toString())) return;
  visited.add(itemId.toString());

  const children = await DriveItem.find({ parentId: itemId });

  for (const child of children) {
    await deleteItemAndChildren(child._id, visited);
  }

  const item = await DriveItem.findById(itemId).lean();

  if (item?.type === "file" && item.url) {
    try {
      const publicId = extractPublicIdFromCloudinaryUrl(item.url);
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.warn(`Cloudinary delete failed for ${item.url}`, err.message);
    }
  }

  await DriveItem.findByIdAndDelete(itemId);
}

async function deleteDriveItemAndItsChildren(req, { params }) {
  try {
    const userId = req.user.userId;

    await connectToDatabase();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request. No item ID provided.",
          data: null,
        },
        { status: 400 }
      );
    }

    const foundItem = await DriveItem.findById(id);

    if (foundItem.userId.toString() !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized request",
          data: null,
        },
        { status: 401 }
      );
    }

    if (!foundItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Item not found",
          data: null,
        },
        { status: 404 }
      );
    }

    const visited = new Set();

    await deleteItemAndChildren(id, visited);

    return NextResponse.json({
      success: true,
      message: "Item and its children deleted successfully",
      data: null,
    });
  } catch (err) {
    console.error("Delete error:", err);
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

export const PATCH = withAuth(renameDriveItem);
export const DELETE = withAuth(deleteDriveItemAndItsChildren);
