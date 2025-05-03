import { serverEnv } from "./env";

export const appConfig = {
  cookies: {
    sessionMaxAge: 60 * 60 * 24 * 7,
    secure: serverEnv.NODE_ENV === "production",
  },
};
