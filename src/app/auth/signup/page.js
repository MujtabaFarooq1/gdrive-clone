"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema } from "@/lib/zodSchema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { signUpUser } from "@/lib/auth";
import { toast } from "sonner";
import Link from "next/link";
import APP_ROUTES from "@/constants/appRoutes";

// Signup Page Component
export default function SignupPage() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await signUpUser(data?.email, data?.password);
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
      <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
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

        <div className="mb-4">
          <Label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="text-sm mb-4">
          Already have a account?{" "}
          <Link className="text-blue-600" href={APP_ROUTES.loginPage}>
            Login
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full p-2 rounded-md cursor-pointer"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </Button>
      </form>
    </div>
  );
}
