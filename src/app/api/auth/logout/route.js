import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json(
    {
      success: true,
      message: "Logged out successfully",
      data: null,
    },
    { status: 200 }
  );

  res.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return res;
}
