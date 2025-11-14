"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  Ellipsis,
  Trash,
} from "lucide-react";

import { useParams, useRouter } from "next/navigation";

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
  const [expand, setExpand] = useState(false);
  const router = useRouter();
  const params = useParams();
  const conversation_id = params?.id;
  const [open, setOpen] = useState(false);
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

  return (
    <div className="flex w-full bg-white">
      {/* Sidebar */}
      <aside className="hidden md:flex justify-between flex-col w-64 bg-linear-to-b from-[#44B997] to-[#4AADB9] text-white  space-y-6 border-r border-[#D8CBB0] py-5">
        <Button
          onClick={() => {
            onExpand?.(); // expand the sidebar first
            router.push("/"); // then navigate
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

              <div className="space-y-2">
                {history.length === 0 ? (
                  <div className="block"></div>
                ) : (
                  history.map((chat) => (
                    <div
                      key={chat.conversation_id}
                      className="flex items-center justify-between group px-2 py-1 rounded-lg relative"
                    >
                      {/* Tooltip for the link */}
                      <Link
                        href={`/chat/${chat.conversation_id}`}
                        className="flex gap-2 items-center text-xs text-gray-200 truncate hover:opacity-60 flex-1"
                      >
                        <MessageCircle className="w-4 h-4" />
                        {chat.title}
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </aside>
    </div>
  );
}
