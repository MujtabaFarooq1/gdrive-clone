"use client";

import AuthButton from "@/components/authButton";
import LogoutButton from "@/components/logoutButton";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Welcome to your Dashboard</h1>

      <div>
        <LogoutButton />
      </div>
    </div>
  );
}
