"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, ThumbsDown, Send, Paperclip, Bot, User, Pencil, X } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type Message = { sender: "user" | "ai"; text: string; time: string };

interface ChatFullScreenProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  close: () => void;
}

export default function ChatFullScreen({
  messages = [],
  setMessages = () => {},
  close = () => {},
}: ChatFullScreenProps) {
  const [inputHeight, setInputHeight] = useState(0);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-linear-to-r from-[#44B997] to-[#4AADB9] text-white shadow-md">
        <div className="flex items-center gap-2">
          <div className="bg-white p-2 rounded-full">
            <Bot className="text-[#44B997]" size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold m-0">Aiva</h2>
            <p className="text-xs opacity-80">Online</p>
          </div>
        </div>
        <button onClick={close} className="text-white hover:opacity-80">
          <X size={24} />
        </button>
      </div>

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
            className="flex-1 bg-gray-50 overflow-y-auto py-5 pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          >
            <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.25 }}
                  className={`flex items-end space-x-2 
                    ${msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >

                  {/* Bot avatar */}
                  {msg.sender === "ai" && (
                  <div className="shrink-0 bg-[#E6F5F0] w-8 h-8 rounded-full flex items-center justify-center">
                    <Bot className="text-[#44B997]" size={16} />
                  </div>
                )}

                  {msg.sender === "user" && (
                    <div className="flex w-full justify-end mt-2 gap-2 mb-10">

                      {/* Edit */}
                      <Pencil className="w-4 h-4 text-xs text-[#7C8199] hover:text-slate-700" />

                    </div>
                  )}


                  {/* Chat Bubble */}
                  <div className="flex flex-col items-start">
                    <div
                      className={`inline-block max-w-3xl p-4 text-sm min-w-12 
                        ${msg.sender === "user"
                          ? "bg-linear-to-r from-[#44B997] to-[#4AADB9] text-white rounded-t-xl rounded-bl-xl"
                          : "bg-[#F0F6FF] text-[#1B2559] rounded-t-xl rounded-br-xl"
                        }`}
                    >

                      <p className="whitespace-pre-wrap">{msg.text}</p>

                    </div>
                    {msg.sender === "ai" && (
                      <div className="flex w-full justify-between items-center mt-2">
                        {/* Timestamp */}
                        <p className="text-xs text-[#7C8199]">{msg.time}</p>

                        {/* Action buttons */}
                        <div className="flex gap-2 text-[#7C8199] pr-2">
                          <button
                            aria-label="Like message"
                            className="transition hover:text-green-500"
                          >
                            <ThumbsUp className="w-4 h-4 " />
                          </button>
                          <button
                            aria-label="Dislike message"
                            className="rounded-full transition hover:text-red-500"
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {msg.sender === "user" && (
                      <div className="flex w-full justify-end mt-2 gap-2">

                        {/* Timestamp */}
                        <p className="text-[10px] text-[#7C8199]">{msg.time}</p>
                      </div>
                    )}

                  </div>



                  {/* User avatar */}
                  {msg.sender === "user" && (
                  <div className="w-12 mb-6">
                    <div className="shrink-0 bg-[#E6F5F0] w-8 h-8 rounded-full flex items-center justify-center">
                      <User className="text-[#44B997]" size={20} />
                    </div>
                  </div>
                )}
                </motion.div>
              )
            )}




            {/* Suggested actions */}
            {/* {messages.length > 0 && messages[messages.length - 1].sender === "ai" && (
              <div className="flex flex-wrap gap-3 justify-start ml-8 mt-4">
                {[
                  "Can I file a vacation leave next week?",
                  "Show my leave history for this year",
                ].map((text, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className="p-3 rounded-full bg-gradient-to-b from-[#4AADB9] to-[#44B997] text-white text-xs border-none hover:bg-[#2c3e1a] transition"
                  >
                    {text}
                  </Button>
                ))}
              </div>
            )} */}
            </AnimatePresence>
          </CardContent>
        )}
    

      {/* Floating sticky input */}
      <div
        className="sticky bottom-0 left-0 right-0 z-20 p-6 flex flex-col gap-2 "
        style={{ maxWidth: "calc(100% - 32px)" }}
      >
        {/* <div className="flex justify-center mb-2">
          <Button
            variant="ghost"
            className="rounded-full p-4 text-[#666D91] border border-[#666D91] hover:bg-[#CEEAE7] transition text-sm"
          >
            Regenerate response
          </Button>
        </div> */}

        <div className="flex items-end gap-2">
          <Button className="bg-gray-100 hover:bg-gray-200 text-[#1B2559] rounded-lg p-4 m-1">
            <Paperclip className="w-8 h-8" />
          </Button>

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
              placeholder="Ask anything"
              minRows={1}
              maxRows={5}
              className="flex-1 border-none bg-transparent resize-none focus-visible:ring-0 text-sm p-1 text-[#1B2559] outline-none"
            />

          </div>


          <Button
            className="bg-[#4AADB9] hover:bg-[#62CAD6] text-white rounded-full p-5 m-1"
            onClick={handleSend}
          >
            <Send className="w-8 h-8" />
          </Button>

        </div>
      </div>
    </div>
  );
}
