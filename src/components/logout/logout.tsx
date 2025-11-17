"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      // Get token from cookies
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];

      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/v1/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // <-- Add this
        },
        credentials: "include",
      });

      document.cookie = "auth_token=; path=/; max-age=0";
      console.log("Logged out successfully", document.cookie);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="cursor-pointer text-red-500 bg-transparent p-0!"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}
