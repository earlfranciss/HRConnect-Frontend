"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import ChatWidget from "@/components/workflow/chat-widget";

export default function Home() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000); // Hide after 3s
    return () => clearTimeout(timer);
  }, []);

  const [message, setMessage] = useState("");

  const handleSend = () => {
    console.log("User message:", message);
    setMessage("");
  };

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
      </div>

      <div className="absolute bottom-0 right-0 w-[300px] h-[350px] flex flex-col items-end justify-end mr-5">
        <AnimatePresence>
          {show && (
            <>
              {/* Message box */}
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

              {/* Chat button */}
              {/* <motion.div
                id="second"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-linear-to-r from-[#44B997] to-[#4AADB9] rounded-full shadow-lg hover:shadow-xl 
              text-lg text-white px-4 py-3 mb-2 w-full text-center cursor-pointer"
              >
                Chat with us
              </motion.div> */}
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
                />{" "}
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
