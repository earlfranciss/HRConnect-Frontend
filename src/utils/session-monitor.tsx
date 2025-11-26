// src/utils/SessionMonitor.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { toast } from "sonner";

export default function SessionMonitor() {
    const router = useRouter();

    useEffect(() => {
        let isActive = true;

        // Check session immediately and periodically
        const checkSession = async () => {
            if (!isActive) return;

            try {
                await api.validate();
            } catch (error: any) {
                if (!isActive) return;

                console.error('❌ Session validation failed:', error);

                if (error?.status === 401) {
                    // Clear localStorage
                    localStorage.removeItem('auth_token');
                    sessionStorage.clear();

                    // Show notification
                    toast.error("Your session has expired or another login was detected. Please log in again.", {
                        duration: 5000,
                    });

                    // Redirect to login after a short delay
                    setTimeout(() => {
                        if (isActive) {
                            router.push("/login");
                        }
                    }, 1000);
                }
            }
        };

        // Check immediately on mount
        checkSession();

        // Then check every 2 minutes
        const interval = setInterval(checkSession, 2 * 60 * 1000);

        return () => {
            isActive = false;
            clearInterval(interval);
        };
    }, [router]);

    return null;
}