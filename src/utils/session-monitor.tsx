// src/utils/SessionMonitor.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/services/api";
import { toast } from "sonner";

export default function SessionMonitor() {
    const router = useRouter();

    useEffect(() => {
        // Check session every 2 minutes
        const interval = setInterval(async () => {
            try {
                await api.validate();
            } catch (error: any) {
                if (error?.status === 401 || error?.response?.status === 401) {
                    // Clear cookie
                    document.cookie = "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                    
                    // Show notification
                    toast.error("Your session has expired or another login was detected. Please log in again.", {
                        duration: 5000,
                    });
                    
                    // Redirect to login after a short delay
                    setTimeout(() => {
                        router.push("/login");
                    }, 1000);
                    
                    // Clear the interval
                    clearInterval(interval);
                }
            }
        }, 2 * 60 * 1000); // Check every 2 minutes

        // Also check once immediately when component mounts
        const checkSession = async () => {
            try {
                await api.validate();
            } catch (error: any) {
                if (error?.status === 401 || error?.response?.status === 401) {
                    document.cookie = "auth_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                    toast.error("Your session has expired. Please log in again.");
                    router.push("/login");
                }
            }
        };
        
        checkSession();

        return () => clearInterval(interval);
    }, [router]);

    return null;
}