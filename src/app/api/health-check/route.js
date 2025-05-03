import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { withAuth } from "@/lib/withAuth";

async function getServerHealthInfo(req) {
  try {
    await connectToDatabase();

    return NextResponse.json({
      success: true,
      message: "API working fine!--",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export const GET = getServerHealthInfo;
