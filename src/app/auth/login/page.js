"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/zodSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { loginUser } from "@/lib/auth";
import { toast } from "sonner";
import Link from "next/link";
import APP_ROUTES from "@/constants/appRoutes";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await loginUser(data?.email, data?.password);
      return router.push(APP_ROUTES.dashboardPage);
    } catch (error) {
      toast.error(error?.message || "API failed for signup", {
        position: "top-right",
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-4">
          <Label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        <div className="text-sm mb-4">
          Don't have a account?{" "}
          <Link className="text-blue-600" href={APP_ROUTES.signupPage}>
            Signup
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full p-2 rounded-md cursor-pointer"
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </Button>
      </form>
    </div>
  );
}
