"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp,
  ThumbsDown,
  Send,
  Paperclip,
  Bot,
  User,
  Pencil,
  X,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import ChatLayout from "./chat-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useRouter, usePathname } from "next/navigation";

type Message = { sender: "user" | "ai"; text: string; time: string };

interface ChatFullScreenProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  close: () => void;
  conversation_id?: string | string[];
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

export default function ChatFullScreen({
  messages = [],
  setMessages = () => {},
  close = () => {},
  conversation_id = [],
}: ChatFullScreenProps) {
  const [inputHeight, setInputHeight] = useState(0);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expand, setExpand] = useState(false);
  const [history, setHistory] = useState<Conversation[]>([]);

  const router = useRouter();

  const pathname = usePathname();

  const isChatPage = pathname?.startsWith("/chat/");

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
    setMessages((prev: any) => [
      ...prev,
      { sender: "ai", text: "Typing...", time: formattedTime },
    ]);

    // Read token from cookie
    const token = getCookie("auth_token");

    if (!token) {
      console.error("No auth token found in cookies.");
      // Remove typing indicator
      setMessages((prev) => prev.filter((msg) => msg.text !== "Typing..."));
      return;
    }

    console.log("user message: ", message);
    console.log("user token:", token);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/v1/chatbot/query`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ question: userMessage }),
        }
      );

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      console.log("Chatbot response:", data);

      // Replace typing indicator with AI response
      setMessages((prev: any) => {
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
      setMessages((prev: any) => {
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
          {isChatPage ? (
            // Show first button on /chat/{conversation_id}
            <button
              onClick={() => {
                close(); // trigger expand/close logic
                router.push("/"); // navigate to home
              }}
              className="text-white hover:opacity-80 transition cursor-pointer"
            >
              <X size={24} />
            </button>
          ) : (
            // Show second button on /
            <button
              onClick={close} // just trigger expand/close logic
              className="text-white hover:opacity-80 transition cursor-pointer"
            >
              <X size={24} />
            </button>
          )}
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
              <div className="flex flex-col items-center justify-end h-full text-center space-y-3">
                <div className="bg-linear-to-r from-[#44B997] to-[#4AADB9] w-16 h-16 rounded-full flex items-center justify-center">
                  <Bot className="text-white" size={32} />
                </div>
                <h2 className="text-lg font-semibold mt-5 mb-1">
                  Hello! I'm Aiva your assistant.
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  How can I help you today?
                </p>

                <div className="grid grid-cols-3 mt-50 gap-2 w-full">
                  {[
                    "How can I update my personal information?",
                    "Can I view my payslips online?",
                    "What is the process for applying for sick leave?",
                    "Are there any upcoming company events?",
                    "How do I submit my timesheet for approval?",
                    "Who can I contact for IT support?",
                  ].map((text, i) => (
                    <button
                      key={i}
                      className="flex-1 min-w-[45%] py-3 px-4 text-sm  bg-white border-[#4AADB9] border rounded-lg transition cursor-pointer"
                      onClick={() => handleSend()}
                    >
                      {text}
                    </button>
                  ))}
                </div>
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
                      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm wrap-break-word whitespace-pre-wrap ${
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
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  onHeightChange={(height) => setInputHeight(height)}
                  placeholder="Ask anything about HR..."
                  minRows={1}
                  maxRows={5}
                  className="flex-1 border-none bg-transparent resize-none focus-visible:ring-0 text-sm p-1 text-[#1B2559] outline-none"
                />
              </div>
              <Button
                className="bg-[#4AADB9] hover:bg-[#62CAD6] text-white rounded-full p-4 cursor-pointer"
                onClick={handleSend}
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
