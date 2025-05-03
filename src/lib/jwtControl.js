import * as jose from "jose";
import { serverEnv } from "@/config/env";

const JWT_SECRET = new TextEncoder().encode(serverEnv.JWT_SECRET);

export const isJwtAuthenticated = async (req) => {
  let token = req.cookies.get("token")?.value;

  if (token) {
    try {
      const decoded = await jose.jwtVerify(token, JWT_SECRET);

      if (decoded?.payload?.email) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log("isAuthenticated error: ", err);

      return false;
    }
  } else {
    return false;
  }
};
