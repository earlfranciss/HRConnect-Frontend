"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import Collapsible from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
  Home,
  MessageSquare,
  Plus,
  Settings,
  Share2,
  MoreVertical,
  Trash2,
  MoreHorizontal,
  MessageCircle,
  X,
  Minus,
  File,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import LogoutButton from "../logout/logout";

interface ChatLayoutProps {
  onExpand: () => void;
}

type Conversation = {
  conversation_id: number;
  title: string | null;
  created_at: string;
  updated_at: string;
  user_id: number;
};

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return null;
}

export default function ChatLayout({ onExpand }: ChatLayoutProps) {
  const [history, setHistory] = useState<Conversation[]>([]);

  const chatHistory = async () => {
    try {
      const token = getCookie("auth_token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/v1/chatbot/history`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      const data = await res.json();
      setHistory(data.conversations || []); // depends on your backend structure
      return data; // chat history response
    } catch (error) {
      console.error("Error fetching chat history:", error);
      return null;
    }
  };

  useEffect(() => {
    chatHistory();
  }, []);

  const router = useRouter();

  return (
    <div className="flex w-full bg-white">
      {/* Sidebar */}
      <aside className="hidden md:flex justify-between flex-col w-64 bg-linear-to-b from-[#44B997] to-[#4AADB9] text-white  space-y-6 border-r border-[#D8CBB0] py-5">
        <Button
          onClick={(e) => {
            onExpand(); // trigger expand
            router.push("/"); // navigate without full reload
          }}
          className="flex justify-start gap-2 bg-gray-100 text-black text-sm rounded-lg p-6 mx-2 cursor-pointer hover:bg-gray-200 border border-[#4AADB9]"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
        <div className="flex-1 overflow-hidden py-2 px-3">
          <ScrollArea className="h-full pr-2">
            <div className="mt-4">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <h2 className="text-sm text-white">Recent Conversations</h2>
              </div>

              <div className="space-y-1">
                {history.length === 0 ? (
                  <p className="text-xs text-gray-500 px-2">
                    No conversation history
                  </p>
                ) : (
                  history.map((chat) => (
                    <Link
                      key={chat.conversation_id}
                      href={`/chat/${chat.conversation_id}`}
                      className="flex gap-1 p-2 text-xs rounded-lg transition truncate text-gray-200 hover:opacity-60"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {chat.title}
                    </Link>
                  ))
                )}
              </div>
            </div>
          </ScrollArea>
        </div>

        <div className="px-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="cursor-pointer bg-transparent border-none p-6 rounded-lg hover:bg-transparent ">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>LM</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-sm font-semibold text-white tracking-wide">
                    Louell Grey Miones
                  </h1>
                  <p className="text-xs text-gray-200">
                    ERP - Software Engineer
                  </p>
                  {/* <Button className="w-[140px] rounded-full text-white hover:bg-[#2c3e1a] bg-red-400">
                Logout
              </Button> */}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-55">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <LogoutButton />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </aside>
    </div>
  );
}
