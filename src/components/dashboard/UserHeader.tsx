"use client";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Settings, } from "lucide-react";
import LogoutButton from "../logout/logout";
import { api } from "@/services/api";
import Link from "next/link";
import ApplyLeave from "./ApplyLeave";
import { Button } from "../ui/button";

interface User {
    email: string;
    user_id: number;
    [key: string]: any;
}

interface UserHeaderProps {
  onLeaveApplied?: () => void;
}

export default function UserHeader({ onLeaveApplied }: UserHeaderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [renderKey, setRenderKey] = useState(0);

    useEffect(() => {
        async function fetchUser() {
            // ✅ Clear user state immediately
            setUser(null);
            setIsLoading(true);
            
            try {
                const userData = await api.validate();
                
                // ✅ Log what we received
                console.log('🔍 Frontend UserHeader received:', {
                    user_id: userData?.user_id,
                    email: userData?.email
                });
                
                // ✅ Verify token matches received data
                const token = localStorage.getItem('auth_token');
                if (token) {
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        console.log('🎫 Token says:', {
                            user_id: payload.user_id,
                            email: payload.email
                        });
                        
                        // ✅ Check for mismatch
                        if (payload.user_id !== userData?.user_id) {
                            console.error('🚨 MISMATCH DETECTED!');
                            console.error('Token user_id:', payload.user_id);
                            console.error('API returned user_id:', userData?.user_id);
                            
                            // Clear everything and force re-login
                            localStorage.clear();
                            sessionStorage.clear();
                            window.location.href = '/login';
                            return;
                        }
                    } catch (e) {
                        console.error('Failed to decode token:', e);
                    }
                }
                
                // ✅ Force a small delay to ensure state clears
                await new Promise(resolve => setTimeout(resolve, 100));
                
                setUser(userData);
                setRenderKey(prev => prev + 1); // ✅ Force re-render
                
            } catch (err) {
                console.error("❌ Failed to fetch user:", err);
                setUser(null);
                // Redirect to login
                window.location.href = '/login';
            } finally {
                setIsLoading(false);
            }
        }

        fetchUser();
    }, []); // Runs on mount

    // ✅ Add key to force complete re-render when user changes
    return (
        <div className="w-full" key={`user-header-${user?.user_id || 'loading'}-${renderKey}`}>
            {/* Top Bar - User Avatar and Settings buttons */}
            <div className="flex justify-between items-center p-3 sm:p-4">
                <div className="flex items-center gap-2">
                    {isLoading ? (
                        <>
                            <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-full" />
                            <div className="min-w-0 space-y-2">
                                <Skeleton className="h-4 w-32 sm:w-40" />
                                <Skeleton className="h-3 w-24 hidden sm:block" />
                            </div>
                        </>
                    ) : (
                        <>
                            <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                                <p className="font-semibold text-sm sm:text-base truncate">
                                    {user?.email ?? "User"}
                                </p>
                                <p className="text-xs text-gray-600 hidden sm:block">
                                    ID: {user?.user_id}
                                </p>
                            </div>
                        </>
                    )}
                </div>
                <div className="flex gap-3 sm:gap-4">
                    {/* Settings */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer">
                            <Settings size={18} className="sm:w-5 sm:h-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><Link href="/chat">Chatbot</Link></DropdownMenuItem>
                            <DropdownMenuItem><LogoutButton /></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Separator />
            
            {/* Welcome Message and Apply for Leave button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 p-3 sm:p-4">
                {isLoading ? (
                    <>
                        <div className="justify-start space-y-2 flex-1">
                            <Skeleton className="h-5 sm:h-6 w-48 sm:w-64" />
                            <Skeleton className="h-3 w-56 sm:w-72" />
                        </div>
                        <Skeleton className="h-10 w-full sm:w-32" />
                    </>
                ) : (
                    <>
                        <div className="justify-start">
                            <p className="text-base sm:text-lg font-semibold">
                                Welcome back, {user?.email?.split("@")[0] ?? "User"}! 👋
                            </p>
                            <p className="text-xs text-[#6C6767] mt-1">
                                Here's what's happening with your work today
                            </p>
                        </div>
                        <Button className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto whitespace-nowrap">
                            <ApplyLeave onLeaveApplied={onLeaveApplied} />
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}