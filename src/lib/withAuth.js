import { cookies } from "next/headers";
import { getUserFromToken } from "./jwtControl";
import { NextResponse } from "next/server";

export function withAuth(handler) {
  return async (req, ctx) => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    try {
      if (!token) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }

      const user = await getUserFromToken(token);

      if (!user) {
        return NextResponse.json(
          { success: false, message: "Unauthorized" },
          { status: 401 }
        );
      }

      req.user = { userId: user.userId, email: user.email };

      return handler(req, ctx);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: error?.message || "Unauthorized" },
        { status: 500 }
      );
    }
  };
}
