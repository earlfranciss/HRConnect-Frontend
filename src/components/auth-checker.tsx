"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthChecker() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip auth check for public routes
    const publicRoutes = ["/", "/login"];
    if (publicRoutes.includes(pathname)) {
      console.log("Public route, skipping auth check");
      return;
    }

    const checkAuth = () => {
      const cookies = document.cookie.split(";");
      const authCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("auth_token=")
      );
      const token = authCookie?.split("=")[1];

      if (!token) {
        console.log("⚠️ No auth token, redirecting to /login");
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