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

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

type Message = { sender: "user" | "ai"; text: string; time: string };

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return null;
}

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const close = () => {
    console.log("Close button clicked"); // You can replace this with actual close logic
  };

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const userMessage = message;
    setMessage("");

    // Add user message
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMessage, time: formattedTime },
    ]);

    // Add typing indicator
    setMessages((prev) => [
      ...prev,
      { sender: "ai", text: "Typing...", time: formattedTime },
    ]);

    const token = getCookie("auth_token");
    if (!token) {
      console.error("No auth token found in cookies.");
      setMessages((prev) => prev.filter((msg) => msg.text !== "Typing..."));
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/v1/chatbot/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: userMessage,
            conversation_id: conversationId,
          }),
        }
      );

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      if (data.conversation_id) setConversationId(data.conversation_id);

      // Replace typing indicator with AI response
      setMessages((prev) => {
        const updated = [...prev];
        const typingIndex = updated.findIndex(
          (msg) => msg.text === "Typing..."
        );
        if (typingIndex !== -1) updated.splice(typingIndex, 1);

        return [
          ...updated,
          {
            sender: "ai",
            text: data.answer || "Sorry, I couldn't find an answer.",
            time: new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          },
        ];
      });
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      setMessages((prev) => {
        const updated = [...prev];
        const typingIndex = updated.findIndex(
          (msg) => msg.text === "Typing..."
        );
        if (typingIndex !== -1) updated.splice(typingIndex, 1);

        return [
          ...updated,
          {
            sender: "ai",
            text: "Oops! Something went wrong. Please try again later.",
            time: new Date().toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          },
        ];
      });
    }
  };

  const isAiTyping = messages.some(
    (msg) => msg.sender === "ai" && msg.text === "Typing..."
  );

  return (
    <Card className="p-0 border-none h-full flex flex-col">
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
          <Link
            href="/chat"
            className={`text-white opacity-80 hover:opacity-100 text-xl leading-none ${
              isAiTyping
                ? "cursor-not-allowed pointer-events-none"
                : "cursor-pointer"
            }`}
          >
            <SquareArrowOutUpRight size={18} />
          </Link>
          <button
            aria-label="Exit"
            className="text-white opacity-80 hover:opacity-100 text-xl leading-none cursor-pointer"
            onClick={close}
          >
            <X size={18} />
          </button>
        </div>
      </CardHeader>

      {/* Content */}
      {messages.length === 0 ? (
        <CardContent className="flex-1 bg-white px-6 flex flex-col items-center justify-center text-center space-y-3">
          <div className="bg-linear-to-r from-[#44B997] to-[#4AADB9] w-16 h-16 rounded-full flex items-center justify-center">
            <Bot className="text-white" size={32} />
          </div>
          <h2 className="text-lg font-semibold m-0 mt-5 mb-1">
            Hello! I'm Aiva, your assistant.
          </h2>
          <p className="text-gray-500 text-sm mb-4">
            How can I help you today?
          </p>
        </CardContent>
      ) : (
        <CardContent
          ref={scrollRef}
          className="flex-1 overflow-y-auto bg-white py-5 pl-4 pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
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
                  <div className="shrink-0 bg-[#E6F5F0] w-8 h-8 rounded-full flex items-center justify-center">
                    <Bot className="text-[#44B997]" size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm whitespace-pre-wrap wrap-break-word ${
                    msg.sender === "user"
                      ? "bg-linear-to-r from-[#44B997] to-[#4AADB9] text-white rounded-br-none"
                      : "bg-[#F1F5F9] text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text === "Typing..." ? (
                    <div className="flex items-center space-x-1 pt-2">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.1s]" />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}
                </div>

                {msg.sender === "user" && (
                  <div className="w-8">
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>LM</AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      )}

      {/* Footer */}
      <CardFooter className="flex items-center border-t bg-white px-3 py-5">
        <TextareaAutosize
          placeholder="Ask anything about HR..."
          minRows={1}
          maxRows={6}
          className="flex-1 mx-2 border-none bg-gray-100 rounded-xl resize-none focus-visible:ring-0 text-sm py-3 px-4 whitespace-pre-wrap wrap-break-word outline-0"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (isAiTyping) return;
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button
          className={`rounded-full bg-linear-to-r from-[#44B997] to-[#4AADB9] hover:bg-[#3fa687] ${
            isAiTyping
              ? "cursor-not-allowed pointer-events-none"
              : "cursor-pointer"
          }`}
          size="icon"
          onClick={handleSend}
          disabled={isAiTyping}
        >
          <Send size={18} className="text-white" />
        </Button>
      </CardFooter>
    </Card>
  );
}
