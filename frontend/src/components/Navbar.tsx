"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between items-center">
      <div>
        <Link href="/">
          <span className="text-xl font-bold cursor-pointer">
            Social Media App
          </span>
        </Link>
      </div>

      <div className="flex items-center">
        {user ? (
          <>
            <span className="mr-2">{user.name || user.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-2 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">
            <button className="bg-blue-500 px-4 py-2 rounded">Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
}
