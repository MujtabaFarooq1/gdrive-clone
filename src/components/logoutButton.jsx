import React, { useState } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { logutUser } from "@/lib/auth";
import APP_ROUTES from "@/constants/appRoutes";

const LogoutButton = () => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogutUser = async () => {
    setIsLoggingOut(true);
    try {
      await logutUser();
      router.push(APP_ROUTES.loginPage);
    } catch (error) {
      toast.error(error?.message || "API failed for logout", {
        position: "top-right",
        duration: 1000,
      });
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
