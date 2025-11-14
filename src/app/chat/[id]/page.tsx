"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, Send, Settings, Trash } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ChatLayout from "@/components/chat/chat-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

type Message = { sender: "user" | "ai"; text: string; time: string };

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

export default function ChatHistory() {
  const router = useRouter();
  const params = useParams();
  const conversation_id = Number(params.id); // make sure it's a number
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [inputHeight, setInputHeight] = useState(40);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchChatHistory = async (id: string | number) => {
    try {
      setLoading(true);
      const token = getCookie("auth_token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/v1/chatbot/history/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error(`Error: ${res.status}`);

      const data = await res.json();

      const mappedMessages = (data.messages || []).map(
        (msg: any, index: number) => ({
          sender: index % 2 === 0 ? "user" : "ai",
          text: msg.text || msg.content || "",
          time: new Date(msg.time || msg.created_at).toLocaleTimeString(),
        })
      );

      setMessages(mappedMessages);
    } catch (err) {
      console.error("Error fetching chat history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (conversation_id) {
      const id = Array.isArray(conversation_id)
        ? conversation_id[0]
        : conversation_id;
      fetchChatHistory(id);
    }
  }, [conversation_id]);

  // Auto-scroll
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
          body: JSON.stringify({
            question: userMessage,
            conversation_id: conversation_id,
          }),
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

  const deleteChat = async (conversation_id: number) => {
    try {
      const token = getCookie("auth_token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/v1/chatbot/history/${conversation_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        console.error("Failed to delete:", await res.text());
        return false;
      }
      router.push("/");
      return true;
    } catch (err) {
      console.error("Delete error:", err);
      return false;
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
          <button
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
          <ChatLayout onExpand={() => setIsExpanded(isExpanded)} />
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          >
            {!loading && messages.length === 0 ? (
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

                      {/* <p
                        className={`text-[10px] mt-1 ${
                          msg.sender === "user"
                            ? "text-[#DCF5EE]"
                            : "text-gray-400"
                        }`}
                      >
                        {msg.time}
                      </p> */}
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button className="cursor-pointer bg-transparent hover:bg-transparent">
                    <Settings className="text-black" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 border-none">
                  <Button
                    className="cursor-pointer border-nonetext-white bg-red-400 hover:bg-red-500"
                    onClick={() => deleteChat(conversation_id)}
                  >
                    <Trash className="text-white" />
                    Delete
                  </Button>
                </PopoverContent>
              </Popover>

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
