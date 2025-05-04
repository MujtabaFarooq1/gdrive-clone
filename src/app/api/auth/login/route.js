import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/userModel";
import { serverEnv } from "@/config/env";
import { appConfig } from "@/config/app";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    await connectToDatabase();

    const user = await User.findOne({ email });

    const passwordValid =
      user && (await bcrypt.compare(password, user.password));

    if (!user || !passwordValid) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password",
          data: {},
        },
        { status: 401 }
      );
    }

    user.lastLoggedIn = new Date();
    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      serverEnv.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const cookie = await cookies();

    cookie.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      maxAge: appConfig.cookies.sessionMaxAge,
      secure: appConfig.cookies.secure,
    });

    return Response.json(
      {
        success: true,
        message: "Login successful",
        data: { userId: user._id, email: user.email },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Login failed",
        data: { error: error.message },
      },
      { status: 500 }
    );
  }
}
