"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Toaster } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import ChatWidget from "@/components/chatwidget/chat-widget";
import Dashboard from "@/components/dashboard/dashboard";
import SessionMonitor from "@/utils/session-monitor";

export default function DashboardPage() {
  const [show, setShow] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="h-screen w-full bg-[#FDFDFD] overflow-y-auto">
      {/* Session Monitor Component */}
      <SessionMonitor />
      
      <div className="w-full flex items-center justify-center flex-col gap-2 px-4 md:px-0">
        <Dashboard />
      </div>

      <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col items-end justify-end z-50">
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="bg-white w-[280px] sm:w-[300px] mb-4 p-4 sm:p-6 rounded-xl rounded-br-none shadow-md"
            >
              <h1 className="text-lg sm:text-xl font-bold mb-2">Welcome to HRConnect!</h1>
              <p className="text-gray-400 text-xs sm:text-sm">
                Nice to meet you! If you have any question about services, feel
                free to contact us.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key="widget"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button className="w-14 h-14 sm:w-16 sm:h-16 relative bg-linear-to-r from-[#44B997] to-[#4AADB9] rounded-full shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <span className="absolute flex size-3 left-0 top-0 -ml-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex size-3 rounded-full bg-green-500"></span>
                  </span>
                  <Image
                    src="/img/chat-icon.png"
                    fill
                    alt="Chat Icon"
                    className="object-contain p-3 sm:p-4"
                  />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="p-0 w-[calc(100vw-2rem)] sm:w-[420px] h-[550px] sm:h-[580px] flex flex-col mb-2 border-none shadow-xl rounded-2xl overflow-hidden bg-transparent"
                side="top"
                align="end"
              >
                <ChatWidget onClose={() => setIsOpen(false)} />
              </PopoverContent>
            </Popover>
          </motion.div>
        </AnimatePresence>
      </div>

      <Toaster position="top-center" />
    </main>
  );
}