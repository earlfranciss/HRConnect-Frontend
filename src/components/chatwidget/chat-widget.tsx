"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Bot, X, SquareArrowOutUpRight, Maximize2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import Link from "next/link";
import { api } from "@/services/api";
import { useChatMessages } from "@/hooks/useChatMessages";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import { ChatInput } from "@/components/chat/ChatInput";
import { SuggestedPrompts } from "@/components/chatwidget/SuggestedPrompts";

interface ChatWidgetProps {
  onClose: () => void;
}

export default function ChatWidget({ onClose }: ChatWidgetProps) {
  const [inputMessage, setInputMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    conversationId,
    setConversationId,
    addMessage,
    addTypingIndicator,
    removeTypingIndicator,
    clearMessages,
    isAiTyping,
  } = useChatMessages();

  // Clear conversation on fresh login
  useEffect(() => {
    const isNewSession = sessionStorage.getItem("chatInitialized");
    
    if (!isNewSession) {
      // New session detected - clear chat storage
      clearMessages();
      sessionStorage.setItem("chatInitialized", "true");
    }
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async (message?: string) => {
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim() || isAiTyping) return;

    const formattedTime = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    setInputMessage("");

    // Add user message
    addMessage({ sender: "user", text: messageToSend, time: formattedTime });
    
    // Add typing indicator
    addTypingIndicator(formattedTime);

    try {
      const data: any = await api.query(messageToSend, conversationId ?? undefined);

      if (data?.conversation_id) {
        setConversationId(data.conversation_id);
      }

      // Remove typing indicator and add AI response
      removeTypingIndicator();
      addMessage({
        sender: "ai",
        text: data?.answer || "Sorry, I couldn't find an answer.",
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      });
    } catch (error: any) {
      console.error("Chatbot API error:", error);

      // Remove typing indicator and show error
      removeTypingIndicator();
      addMessage({
        sender: "ai",
        text: error?.message || "Oops! Something went wrong. Please try again later.",
        time: new Date().toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
      });
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  return (
    <Card className="p-0 border-none h-full flex flex-col">
      {/* Header */}
      <CardHeader className="bg-linear-to-r from-[#44B997] to-[#4AADB9] text-white flex items-center justify-between py-3 px-4">
        <Link href={conversationId ? `/chat?id=${conversationId}` : "/chat"} className="flex items-center space-x-2">
          <div className="bg-white p-2 rounded-full">
            <Bot className="text-[#44B997]" size={22} />
          </div>
          <div>
            <CardTitle className="text-white text-sm font-medium">
              Aiva
            </CardTitle>
            <p className="text-xs opacity-80">Online</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href={conversationId ? `/chat?id=${conversationId}` : "/chat"}
            className={`text-white opacity-80 hover:opacity-100 text-xl leading-none ${
              isAiTyping ? "cursor-not-allowed pointer-events-none" : "cursor-pointer"
            }`}
            aria-label="Open fullscreen"
          >
            <Maximize2 size={16} />
          </Link>

          <button
            aria-label="Exit"
            className="text-white opacity-80 hover:opacity-100 text-xl leading-none cursor-pointer"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
      </CardHeader>

      {/* Message Content */}
      {messages.length === 0 ? (
        <CardContent className="flex-1 bg-white px-6 flex flex-col items-center justify-center text-center space-y-3">
          <ChatEmptyState />
        </CardContent>
      ) : (
        <CardContent
          ref={scrollRef}
          className="flex-1 overflow-y-auto bg-white py-5 pl-4 pr-2 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
          </AnimatePresence>
        </CardContent>
      )}

      {/* Suggested Prompts - Only show when no messages */}
      {messages.length === 0 && (
        <div className="px-4 py-1 flex justify-center">
          <SuggestedPrompts onPromptClick={handlePromptClick} maxHeight="200px" />
        </div>
      )}

      {/* Footer - Input Area */}
      <CardFooter className="flex items-center border-t bg-white px-3 py-3!">
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={() => handleSend()}
          disabled={isAiTyping}
        />
      </CardFooter>
    </Card>
  );
}