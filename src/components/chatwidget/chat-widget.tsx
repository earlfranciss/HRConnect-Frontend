"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Paperclip,
  Send,
  Bot,
  User,
  X,
  Expand,
  SquareArrowOutUpRight,
} from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type Message = { sender: "user" | "ai"; text: string; time: string };

interface ChatWidgetProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  close: () => void; // function from parent
}

export default function ChatWidget({
  messages,
  setMessages,
  close,
}: ChatWidgetProps) {
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Load from localStorage once on mount
  useEffect(() => {
    const saved = localStorage.getItem("chatMessages");
    if (saved) setMessages(JSON.parse(saved));
  }, [setMessages]);

  // Persist to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: message, time: formattedTime },
    ]);
    setMessage("");
  };

  const handleSuggestionClick = (text: string) => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    setMessages((prev) => [
      ...prev,
      { sender: "user", text, time: formattedTime },
    ]);
  };

  return (
    <Card className="p-0 border-none gap-0! h-full">
      {/* Header */}
      <CardHeader className="bg-linear-to-r from-[#44B997] to-[#4AADB9] text-white flex items-center justify-between py-3 px-4">
        <div className="flex items-center space-x-2">
          <div className="bg-white p-2 rounded-full">
            <Bot className="text-[#44B997]" size={22} />
          </div>
          <div>
            <CardTitle className="text-white text-sm font-medium">
              Aiva
            </CardTitle>

            <p className="text-xs opacity-80">Online</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Close Button */}
          <Link
            href="/chat"
            className="text-white opacity-80 hover:opacity-100 text-xl leading-none cursor-pointer"
          >
            <SquareArrowOutUpRight size={18} className="cursor-pointer" />
          </Link>
          <button
            className="text-white opacity-80 hover:opacity-100 text-xl leading-none cursor-pointer"
            onClick={close}
          >
            <X size={18} />
          </button>
        </div>
      </CardHeader>

      {/* Content */}
      {messages.length === 0 ? (
        <CardContent className="flex-1 bg-gray-50 px-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="bg-linear-to-r from-[#44B997] to-[#4AADB9] w-16 h-16 rounded-full flex items-center justify-center">
            <Bot className="text-white" size={32} />
          </div>
          <h2 className="text-lg font-semibold m-0 mt-5 mb-1">
            Hello! I'm Aiva your assistant.
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            How can I help you today?
          </p>

          <div className="space-y-2 w-full mt-2">
            {[
              "What are the benefits for regular employees?",
              "How many vacation leave credits do I have left?",
              "Did I have any late or missing logs this week?",
            ].map((text, i) => (
              <button
                key={i}
                className="w-full text-sm bg-white hover:bg-gray-100 border border-gray-200 rounded-full py-2 px-3 transition cursor-pointer"
                onClick={() => handleSuggestionClick(text)}
              >
                {text}
              </button>
            ))}
          </div>
        </CardContent>
      ) : (
        <CardContent
          ref={scrollRef}
          className="flex-1 overflow-y-auto bg-gray-50 py-5 pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25 }}
                className={`flex items-end space-x-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="flex-shrink-0 bg-[#E6F5F0] w-8 h-8 rounded-full flex items-center justify-center">
                    <Bot className="text-[#44B997]" size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm break-words whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-[#44B997] to-[#4AADB9] text-white rounded-br-none"
                      : "bg-[#F1F5F9] text-gray-800 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      msg.sender === "user" ? "text-[#DCF5EE]" : "text-gray-400"
                    }`}
                  >
                    {msg.time}
                  </p>
                </div>

                {msg.sender === "user" && (
                  <div className="w-8">
                    <div className="flex-shrink-0 bg-[#E6F5F0] w-8 h-8 rounded-full flex items-center justify-center">
                      <User className="text-[#44B997]" size={16} />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      )}

      {/* Footer */}
      <CardFooter className="flex items-center border-t bg-white px-3 py-5">
        <Button variant="ghost" size="icon">
          <Paperclip size={18} />
        </Button>
        <TextareaAutosize
          placeholder="Reply..."
          minRows={1}
          maxRows={6}
          className="flex-1 mx-2 border-none bg-gray-100 rounded-xl resize-none focus-visible:ring-0 text-sm py-3 px-4 whitespace-pre-wrap break-words outline-0"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          className="rounded-full bg-linear-to-r from-[#44B997] to-[#4AADB9] hover:bg-[#3fa687] cursor-pointer"
          size="icon"
          onClick={handleSend}
        >
          <Send size={18} className="text-white" />
        </Button>
      </CardFooter>
    </Card>
  );
}
