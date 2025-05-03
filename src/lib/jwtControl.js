import * as jose from "jose";
import { serverEnv } from "@/config/env";

const JWT_SECRET = new TextEncoder().encode(serverEnv.JWT_SECRET);

export const getUserFromToken = async (token) => {
  try {
    const decoded = await jose.jwtVerify(token, JWT_SECRET);

    if (!decoded.payload?.email) {
      throw new Error(`Invalid or expired token`);
    }

    return decoded.payload;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

export const isJwtAuthenticated = async (req) => {
  let token = req.cookies.get("token")?.value;

  if (token) {
    try {
      const jwtUser = await getUserFromToken(token);

      if (jwtUser?.email) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      // console.log("isAuthenticated error: ", err);

      return false;
    }
  } else {
    return false;
  }
};
