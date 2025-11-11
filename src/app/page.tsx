"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import ChatWidget from "@/components/chatwidget/chat-widget";
import LogoutButton from "@/components/logout/logout";

type Message = { sender: "user" | "ai"; text: string; time: string };

export default function Home() {
  const [show, setShow] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  // -------------------------
  // Auth guard
  // -------------------------
  useEffect(() => {
    const match = document.cookie.match(/(^|;) ?auth_token=([^;]*)/);
    const token = match ? match[2] : null;
    if (!token) router.replace("/login");
    else setAuthChecked(true);
  }, [router]);

  // -------------------------
  // Hide welcome message after 5s
  // -------------------------
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!authChecked) return null;

  return (
    <main className="h-screen w-full bg-[#CCEEEE]">
      <div className="w-full flex items-center justify-center flex-col gap-2">
        <Image
          src="/img/workflow.png"
          alt="Workflow Illustration"
          width={1100}
          height={1100}
          className="object-cover"
          priority
        />

        <LogoutButton />
      </div>

      <div className="absolute bottom-0 right-0 w-[300px] h-[350px] flex flex-col items-end justify-end mr-5">
        <AnimatePresence>
          {show && (
            <motion.div
              id="first"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="bg-white w-full mb-4 p-6 rounded-xl rounded-br-none shadow-md"
            >
              <h1 className="text-xl font-bold mb-2">Welcome to Nxpert!</h1>
              <p className="text-gray-400 text-sm">
                Nice to meet you! If you have any question about services, feel
                free to contact us.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Chat Icon */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button className="w-16 h-16 relative mb-5 bg-linear-to-r from-[#44B997] to-[#4AADB9] rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer ">
                <span className="absolute flex size-3 left-0 top-0 -ml-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
                </span>
                <Image
                  src="/img/chat-icon.png"
                  fill
                  alt="Chat Icon"
                  className="object-contain p-4"
                />
              </Button>
            </PopoverTrigger>

            <PopoverContent
              className="p-0 w-[420px] h-[580px] flex flex-col mb-2 border-none shadow-xl rounded-2xl overflow-hidden bg-transparent"
              side="top"
              align="end"
            >
              <ChatWidget
                messages={messages}
                setMessages={setMessages}
                close={() => setIsOpen(false)} // ✅ pass the close function
              />
            </PopoverContent>
          </Popover>
        </motion.div>
      </div>
    </main>
  );
}
