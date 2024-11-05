"use client";

import React from "react";
import { useForm } from "react-hook-form";
import apiClient from "@/utils/axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await apiClient.post("/users/login", data);
      console.log("Login successful:", response.data);

      // Store the token in localStorage for session tracking
      localStorage.setItem("token", response.data.token);

      alert("Login successful!");

      // Redirect user to the dashboard page after successful login
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Login failed:", error.response?.data || error.message);
      alert("Login failed. Please check your email and password.");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        >
          Login
        </button>
      </form>

      <p className="mt-4">
        Don't have an account?{" "}
        <Link href="/register">
          <span className="text-blue-500 hover:underline">Sign up here</span>
        </Link>
      </p>
    </div>
  );
}
