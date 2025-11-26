"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/services/api";
import { ChatStorage } from "@/utils/chat-storage";
import { toast } from "sonner";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await api.logout();

      // Clear localStorage and sessionStorage
      localStorage.removeItem("auth_token");
      sessionStorage.clear();

      // Clear chat storage on logout
      ChatStorage.clear();
      sessionStorage.removeItem("chatInitialized");

      toast.success("Logged out successfully");
      
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("❌ Logout failed:", err);
      
      // Still clear local storage even if API call fails
      localStorage.removeItem("auth_token");
      sessionStorage.clear();
      ChatStorage.clear();
      
      toast.error("Logout failed, but cleared local session");
      router.push("/login");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="cursor-pointer text-red-500 bg-transparent p-0 w-full text-left"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
}