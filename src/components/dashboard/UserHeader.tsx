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
        <div>
            <div className="flex justify-between items-center p-4">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{user?.email ?? "User"}</p>
                        <p className="text-xs text-[#6C6767]">Software Engineer</p>
                    </div>
                </div>
                <div className="flex gap-4 ">
                    {/* <Popover>
                        <PopoverTrigger>
                            <Bell size={18} />
                        </PopoverTrigger>
                        <PopoverContent className="">Notifications</PopoverContent>
                    </Popover> */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer">
                            <Settings size={18} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent >
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem><Link href="/chat">Chatbot</Link></DropdownMenuItem>
                            <DropdownMenuItem><LogoutButton /></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Separator />

            <div className="flex justify-between items-center ">
                <div className="justify-start p-4">
                    <p className="text-lg font-semibold">Welcome back, {user?.email?.split("@")[0] ?? "User"}! 👋</p>
                    <p className="text-xs text-[#6C6767]">Here's what's happening with your work today</p>
                </div>
                <Button className="bg-blue-500 hover:bg-blue-600">
                    <ApplyLeave onLeaveApplied={onLeaveApplied} />
                </Button>
            </div>
        </div>

    )
}