"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, X } from "lucide-react";
import ChatLayout from "@/components/chat/chat-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter, usePathname } from "next/navigation";

type Message = { sender: "user" | "ai"; text: string; time: string };

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return null;
}

export default function ChatFullScreen() {
  const [inputMessage, setInputMessage] = useState(""); // For textarea input
  const [messages, setMessages] = useState<Message[]>([]); // Chat history
  const [expand, setExpand] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Persist messages
  useEffect(() => {
    const saved = localStorage.getItem("chatMessages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // Add user message
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: inputMessage, time: formattedTime },
    ]);

    setInputMessage(""); // clear textarea

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
            question: inputMessage,
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
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-linear-to-r from-[#44B997] to-[#4AADB9] text-white shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white p-2 rounded-full">
            <Bot className="text-[#44B997]" size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold">HRConnect Aiva</h2>
            <p className="text-xs opacity-80">Online</p>
          </div>
        </div>
        <div>
          <button
            aria-label="Exit"
            onClick={() => router.push("/")}
            className="text-white hover:opacity-80 transition cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white flex">
          <ChatLayout onExpand={() => setExpand(true)} />
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                <div className="bg-linear-to-r from-[#44B997] to-[#4AADB9] w-16 h-16 rounded-full flex items-center justify-center">
                  <Bot className="text-white" size={32} />
                </div>
                <h2 className="text-lg font-semibold mt-5 mb-1">
                  Hello! I'm Aiva your assistant.
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  How can I help you today?
                </p>
              </div>
            ) : (
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
                        <div className="flex items-center space-x-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.1s]" />
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        </div>
                      ) : (
                        <p>{msg.text}</p>
                      )}
                      <p
                        className={`text-[10px] mt-1 ${
                          msg.sender === "user"
                            ? "text-[#DCF5EE]"
                            : "text-gray-400"
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                    {msg.sender === "user" && (
                      <Avatar>
                        <AvatarImage
                          src="https://github.com/shadcn.png"
                          alt="@shadcn"
                        />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex items-end gap-2">
              <div className="flex items-center gap-2 w-full bg-gray-100 rounded-lg p-2">
                <TextareaAutosize
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (isAiTyping) return;
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask anything about HR..."
                  minRows={1}
                  maxRows={5}
                  className="flex-1 border-none bg-transparent resize-none focus-visible:ring-0 text-sm p-1 text-[#1B2559] outline-none"
                />
              </div>
              <Button
                className={`rounded-full bg-linear-to-r from-[#44B997] to-[#4AADB9] hover:bg-[#3fa687] ${
                  isAiTyping
                    ? "cursor-not-allowed pointer-events-none"
                    : "cursor-pointer"
                }`}
                onClick={handleSend}
                disabled={isAiTyping}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
