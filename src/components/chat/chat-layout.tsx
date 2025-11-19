"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import {
  Plus,
  MessageCircle,
  Ellipsis,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { useParams, useRouter } from "next/navigation";
import { api } from "@/services/api";


interface ChatLayoutProps {
  onExpand: () => void;
  setConversationId: (id: number | null) => void;
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

export default function ChatLayout({ onExpand, setConversationId }: ChatLayoutProps) {

  const [history, setHistory] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
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

  const handleDelete = async (conversation_id: number) => {
    if (loading) return;

    setLoading(true);

    try {
      await api.deleteConversation(conversation_id);
      setHistory((prev) =>
        prev.filter((c) => c.conversation_id !== conversation_id)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete conversation");
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    // Clear localStorage first
    localStorage.removeItem("conversationId");
    localStorage.removeItem("chatMessages");
    
    // Set conversation ID to null - this will trigger the useEffect in ChatPage
    setConversationId(null);
    
    // Navigate to chat page
    router.push("/chat");
    
    // Call onExpand if needed
    onExpand?.();
  };

  return (
    <div className="flex w-full bg-white  h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-linear-to-b from-[#44B997] to-[#4AADB9] text-white py-2 px-4">
        {/* New chat button */}
        <Button
          onClick={handleNewChat}
          className="flex justify-start gap-2 bg-gray-100 text-black text-sm rounded-lg p-6 cursor-pointer hover:bg-gray-200 border border-[#4AADB9]"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
        
        {/* Recent Conversations */}
        <div className="flex flex-col flex-1">
          <ScrollArea className="flex-1 pr-2 overflow-y-auto">
            <div className="mt-4">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <h2 className="text-sm text-white">Recent Conversations</h2>
              </div>

              {/* Conversation history list */}
              <div className="space-y-2 w-54">
                {history.length === 0 ? (
                  <div className="block"></div>
                ) : (
                  history.map((chat) => (
                    <div key={chat.conversation_id} className="flex">
                      <div
                        className="flex items-center justify-between rounded-sm text-xs hover:bg-gray-200/20 overflow-hidden whitespace-nowrap w-full"
                      >
                        <button
                          onClick={() => setConversationId(chat.conversation_id)}
                          className="flex gap-2 p-2 w-full text-left"
                        >
                          <MessageCircle className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate w-36">
                            {chat.title?.replace(/^Query:\s*/, "") || "Untitled"}
                          </span>
                        </button>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="p-2 cursor-pointer hover:bg-gray-200/20 rounded-sm">
                            <Ellipsis size={16} />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-20 p-0! text-center bg-gray-200  hover:text-white hover:bg-red-500">
                          <AlertDialog>
                            <AlertDialogTrigger
                              disabled={loading}
                              className="text-red-500 bg-transparent outline-none focus:outline-none text-sm p-2! hover:text-white hover:bg-red-500"
                            >
                              {loading ? "Deleting..." : "Delete"}
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your account
                                  and remove your data from our servers.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(chat.conversation_id)} className="bg-red-500 hover:bg-red-600">Continue</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </PopoverContent>
                      </Popover>
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