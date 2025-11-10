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

import ChatWidget from "@/components/workflow/chat-widget";
import LogoutButton from "@/components/logout/logout";

export default function Home() {
  const [show, setShow] = useState(true);
  const [message, setMessage] = useState("");
  const [authChecked, setAuthChecked] = useState(false); // ✅ track auth check
  const router = useRouter();

  // -------------------------
  // Guard: Check token before rendering page
  // -------------------------
  useEffect(() => {
    const match = document.cookie.match(/(^|;) ?auth_token=([^;]*)/);
    const token = match ? match[2] : null;

    if (!token) {
      router.replace("/login"); // redirect if no token
    } else {
      setAuthChecked(true); // token exists → allow page to render
    }
  }, [router]);

  // -------------------------
  // Hide welcome message after 5s
  // -------------------------
  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = () => {
    console.log("User message:", message);
    setMessage("");
  };

  // -------------------------
  // Wait for auth check before rendering page
  // -------------------------
  if (!authChecked) {
    return null; // or a loading spinner if you want
  }

  return (
    <main className="h-screen w-full bg-[#CCEEEE]">
      <div className="">
        <div className="w-full flex items-center justify-center">
          <Image
            src="/img/workflow.png"
            alt="Workflow Illustration"
            width={1100}
            height={1100}
            className="object-cover"
            priority
          />
        </div>
        <LogoutButton />
      </div>

      <div className="absolute bottom-0 right-0 w-[300px] h-[350px] flex flex-col items-end justify-end mr-5">
        <AnimatePresence>
          {show && (
            <>
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
                  Nice to meet you! If you have any question about services,
                  feel free to contact us.
                </p>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Floating icon */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Popover>
            <PopoverTrigger asChild>
              <Button className="w-16 h-16 relative mb-5 bg-linear-to-r from-[#44B997] to-[#4AADB9] rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                <Image
                  src="/img/chat-icon.png"
                  fill
                  alt="Chat Icon"
                  className="object-contain p-4"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="PopoverContent mb-2 w-[420px] h-[580px] flex border-none shadow-xl rounded-2xl overflow-hidden p-0"
              side="top"
              align="end"
            >
              <ChatWidget />
            </PopoverContent>
          </Popover>
        </motion.div>
      </div>
    </main>
  );
}
