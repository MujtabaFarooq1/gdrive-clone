import React, { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

import APP_ROUTES from "@/constants/appRoutes";
import { logoutUser } from "@/lib/auth";

const LogoutButton = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogutUser = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      router.push(APP_ROUTES.loginPage);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <Button
      className={`cursor-pointer`}
      onClick={() => {
        handleLogutUser();
      }}
    >
      {isLoggingOut ? "loading ..." : "Logut"}
    </Button>
  );
};

export default LogoutButton;
