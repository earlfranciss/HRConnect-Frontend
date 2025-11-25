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
import { Bell, Settings, } from "lucide-react";
import LogoutButton from "../logout/logout";
import { api } from "@/services/api";
import Link from "next/link";
import ApplyLeave from "./ApplyLeave";
import { Button } from "../ui/button";

interface User {
    email: string;
    [key: string]: any;
}

interface UserHeaderProps {
  onLeaveApplied?: () => void;
}

export default function UserHeader({ onLeaveApplied }: UserHeaderProps) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        api
            .validate()
            .then((data) => setUser(data))
            .catch((err) => console.error("Failed to fetch user:", err));
    }, []);

    return (
        <div className="w-full">
            {/* Top Bar - User Avatar and Settings buttons */}
            <div className="flex justify-between items-center p-3 sm:p-4">
                <div className="flex items-center gap-2">
                    <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="font-semibold text-sm sm:text-base truncate">{user?.email ?? "User"}</p>
                        <p className="text-xs text-[#6C6767] hidden sm:block">Software Engineer</p>
                    </div>
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
                <div className="justify-start">
                    <p className="text-base sm:text-lg font-semibold">Welcome back, {user?.email?.split("@")[0] ?? "User"}! 👋</p>
                    <p className="text-xs text-[#6C6767] mt-1">Here's what's happening with your work today</p>
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto whitespace-nowrap">
                    <ApplyLeave onLeaveApplied={onLeaveApplied} />
                </Button>
            </div>
        </div>
    )
}