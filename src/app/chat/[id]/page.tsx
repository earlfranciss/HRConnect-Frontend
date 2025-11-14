"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, X, Send } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ChatLayout from "@/components/chat/chat-layout";
import { Button } from "@/components/ui/button";

type Message = { sender: "user" | "ai"; text: string; time: string };

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

export default function ChatHistory() {
  const router = useRouter();
  const params = useParams();
  const conversation_id = params?.id;
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

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: message,
        time: new Date().toLocaleTimeString(),
      },
    ]);
    setMessage("");

    // Optionally, send to backend API
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#44B997] to-[#4AADB9] text-white shadow-md">
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
          <ChatLayout onExpand={() => setIsExpanded(!isExpanded)} />
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          >
            {loading && (
              <div className="text-center text-gray-500">
                Loading messages...
              </div>
            )}

            {!loading && messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                <div className="bg-gradient-to-r from-[#44B997] to-[#4AADB9] w-16 h-16 rounded-full flex items-center justify-center">
                  <Bot className="text-white" size={32} />
                </div>
                <h2 className="text-lg font-semibold mt-5 mb-1">
                  Hello! I'm Aiva your assistant.
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  How can I help you today?
                </p>

                <div className="grid grid-cols-3 gap-2 w-full">
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
                      onClick={() => setMessage(text)}
                      className="flex-1 min-w-[45%] py-3 px-4 text-sm bg-white border-[#4AADB9] border rounded-lg transition cursor-pointer"
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
                      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm break-words whitespace-pre-wrap ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-[#44B997] to-[#4AADB9] text-white rounded-br-none"
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
