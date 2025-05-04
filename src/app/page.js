import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import APP_ROUTES from "@/constants/appRoutes";

export default async function Home() {
  const cookie = await cookies();
  const hasToken = cookie.get("token");

  if (hasToken) {
    redirect(APP_ROUTES.dashboardPage);
  } else {
    redirect(APP_ROUTES.loginPage);
  }
}
