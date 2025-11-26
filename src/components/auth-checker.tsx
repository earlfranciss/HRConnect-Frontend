"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthChecker() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip auth check for public routes
    const publicRoutes = ["/", "/login", "/register"];
    if (publicRoutes.includes(pathname)) {
      // console.log("✅ Public route, skipping auth check");
      return;
    }

    const checkAuth = () => {
      // Check localStorage
      const token = localStorage.getItem("auth_token");

      if (!token) {
        router.push("/login");
        router.refresh();
      } 
    };

    checkAuth(); // Check immediately
    const interval = setInterval(checkAuth, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [pathname, router]);

  return null;
}