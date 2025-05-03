import { NextResponse } from "next/server";
import APP_ROUTES, { PUBLIC_ROUTES } from "./constants/appRoutes";
import { isJwtAuthenticated } from "./lib/jwtControl";

export async function middleware(request) {
  // Allow public routes
  if (PUBLIC_ROUTES.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const isAutenticated = await isJwtAuthenticated(request);

  // If no token or invalid token, redirect to login
  if (!isAutenticated) {
    return NextResponse.redirect(new URL(APP_ROUTES.loginPage, request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
