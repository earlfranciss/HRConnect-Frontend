"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/services/api";
import { ChatStorage } from "@/utils/chat-storage";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.logout();

      // Clear token cookie and localStorage
      document.cookie = "auth_token=; path=/; max-age=0";
      localStorage.removeItem("auth_token");

      // Clear chat storage on logout
      ChatStorage.clear();
      sessionStorage.removeItem("chatInitialized");

      console.log("Logged out successfully");
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
