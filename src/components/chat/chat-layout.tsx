"use client";

import { ReactNode } from "react";
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ChatLayout({ children }: { children: ReactNode }) {
  const handleShare = () => {
    console.log("Share link copied!");
  };

  const handleDelete = () => {
    console.log("Chat deleted");
  };

  const chatHistory = [
    { id: 1, title: "How to apply for leave?" },
    { id: 2, title: "Company policies overview" },
    { id: 3, title: "Payroll inquiry" },
    { id: 4, title: "Schedule meeting with HR" },
    { id: 5, title: "Work from home request" },
  ];

  return (
    <div className="flex h-screen w-full bg-white">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-linear-to-b from-[#4AADB9] to-[#44B997] text-white  space-y-6 border-r border-[#D8CBB0]">
        <div className="text-2xl font-semibold text-center tracking-wide p-4">
          <h1>
            HRConnect <span className="font-medium">Aiva</span>
          </h1>
        </div>

        <Button
          onClick={() => {
            // handle new chat logic here
            console.log("Starting new chat...");
          }}
          className="flex justify-start gap-2 bg-[#F0F6FF] text-[#1B2559] text-sm transition font-medium rounded-lg p-6 mx-2 cursor-pointer hover:bg-[#D3E1F6]"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>

        <div className="flex-1 overflow-y-auto space-y-6 p-2 text-sm">
          <Collapsible title="Files">
            <div className="flex items-center gap-2">
              <File className="w-6 h-6" />
              <div className="flex flex-col">
                <p className="text-sm text[#1B2559]">CompanyPolicy.pdf</p>
                <p className="text-xs text-[#A3A9C7]">256.81 mb</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <File className="w-6 h-6" />
              <div className="flex flex-col">
                <p className="text-sm text[#1B2559]">VacationLeave.docx</p>
                <p className="text-xs text-[#A3A9C7]">64.4 mb</p>
              </div>
            </div>
          </Collapsible>

          <Collapsible title="Links">
            <p className="text-[#505674]">workflow.com</p>
            <p className="text-[#505674]">n-pax.com</p>
          </Collapsible>
        </div>

        {/* <nav className="flex flex-col space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 p-2 rounded-full hover:bg-[#2c3e1a] transition"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link
            href="/dashboard/chat-history"
            className="flex items-center gap-2 p-2 rounded-full hover:bg-[#2c3e1a] transition"
          >
            <MessageSquare className="w-4 h-4" /> Chat History
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 p-2 rounded-full hover:bg-[#2c3e1a] transition"
          >
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </nav> */}

        {/* <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-2">
            <div className="mt-4">
              <div className="flex items-center gap-2 text-gray-300 mb-2">
                <h2 className="text-sm text-gray-300">Recent Conversations</h2>
              </div>

              <div className="space-y-1">
                {chatHistory.map((chat) => (
                  <Link
                    key={chat.id}
                    href={`/dashboard/chat/${chat.id}`}
                    className="flex gap-2 p-2 text-xs rounded-full hover:bg-[#2c3e1a] transition truncate"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {chat.title}
                  </Link>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div> */}

        <div className="mt-auto">
          <div className="flex justify-start items-center gap-4 hover:bg-[#1B2559] p-2 m-2 rounded-lg transition cursor-pointer ">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>LM</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-sm font-semibold text-white tracking-wide">
                Louell Grey Miones
              </h1>
              <p className="text-xs text-gray-300">ERP - Software Engineer</p>
            </div>
            {/* <Button className="w-[140px] rounded-full text-white hover:bg-[#2c3e1a] bg-red-400">
              Logout
            </Button> */}
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden ">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-linear-to-r from-[#4AADB9] to-[#44B997] border-b border-[#D8CBB0]">
          <h1 className="text-lg font-semibold text-[#435334]"></h1>

          <div className="flex items-center gap-4 text-center">
            <Minus className="text-white hover:text-red-500" />
            <X className="text-white hover:text-red-500" />
            {/* Share Button
            <Button
              onClick={handleShare}
              className=" bg-[#39462C] border-none text-white text-xs border rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>

            {/* Ellipsis Dropdown 
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  className=" bg-[#39462C] text-white hover: bg-[#39462C]  rounded-full p-2 cursor-pointer border-black"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-[#39462C] rounded-full border-none"
              >
                <Button
                  onClick={handleDelete}
                  className="text-red-400 cursor-pointer hover:bg-transparent bg-transparent flex items-center gap-2 flex items-center justify-center w-full"
                >
                  {/* <Trash2 className="h-4 w-4 text-red-400" />
                  Delete 
                </Button>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
        </header>

        {/* Scrollable content */}
        <ScrollArea className="flex-1 p-4">{children}</ScrollArea>
      </div>
    </div>
  );
}
