"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Bot, X, Settings, Trash, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import TextareaAutosize from "react-textarea-autosize";
import ChatLayout from "@/components/chat/chat-layout";
import { useChatMessages } from "@/hooks/useChatMessages";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import { SuggestedPromptFull } from "@/components/chat/SuggestedPromptFull";
import { api } from "@/services/api";
import { Message, ChatStorage } from "@/utils/chat-storage";

export default function ChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastFetchedId, setLastFetchedId] = useState<number | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(0); // Add refresh trigger state
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    conversationId,
    setMessages,
    setConversationId,
    addMessage,
    addTypingIndicator,
    removeTypingIndicator,
    clearMessages,
    isAiTyping,
  } = useChatMessages();

  // Auto-scroll when messages change
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // Clear input field and reset state for new chat
  useEffect(() => {
    if (!conversationId) {
      setInputMessage("");
      setLastFetchedId(null);
      setLoading(false);
      clearMessages(); // Clear messages when starting a new chat
    }
  }, [conversationId, clearMessages]);

  // Load messages for existing conversation
  useEffect(() => {
    const fetchExistingChat = async (id: number) => {
      // If we already fetched this conversation, skip
      if (lastFetchedId === id) {
        return;
      }

      try {
        setLoading(true);
        
        // Check if we have messages from the SAME conversation in localStorage
        const storedConversationId = ChatStorage.getConversationId();
        const storedMessages = ChatStorage.getMessages();
        
        // Only use localStorage if:
        // 1. It's the same conversation
        // 2. We haven't explicitly clicked to switch to it (lastFetchedId check above handles this)
        // 3. It has messages
        if (storedConversationId === id && storedMessages.length > 0 && lastFetchedId === null) {
          setMessages(storedMessages);
          setLastFetchedId(id);
          setLoading(false);
          return;
        }
        
        // Fetch from backend
        const data: any = await api.getConversation(id);
        
        const mappedMessages: Message[] = (data.messages || []).map((msg: any, idx: number) => {
          const isUserMessage = idx % 2 === 0;
          
          return {
            sender: isUserMessage ? "user" : "ai",
            text: msg.content || msg.text || "",
            time: new Date(msg.created_at || Date.now()).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
            isError: msg.isError || false,
          };
        });

        setMessages(mappedMessages);
        setLastFetchedId(id);
      } catch (err) {
        console.error("Error fetching chat history:", err);
      } finally {
        setLoading(false);
      }
    };

    if (conversationId) {
      fetchExistingChat(conversationId);
    }
  }, [conversationId, setMessages, lastFetchedId]);

  const handleSend = async (message?: string) => {
    const messageToSend = message || inputMessage;
    if (!messageToSend.trim() || isAiTyping) return;

    const formattedTime = new Date().toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    setInputMessage("");

    addMessage({ sender: "user", text: messageToSend, time: formattedTime });
    addTypingIndicator(formattedTime);

    try {
      const data: any = await api.query(messageToSend, conversationId ?? undefined);

      if (data?.conversation_id) {
        const isNewConversation = conversationId !== data.conversation_id;
        
        setConversationId(data.conversation_id);
        // Update lastFetchedId to prevent re-fetching
        setLastFetchedId(data.conversation_id);
        
        // Trigger history refresh if this is a new conversation
        if (isNewConversation) {
          setRefreshHistory(prev => prev + 1);
        }
      }

      removeTypingIndicator();
      addMessage({
        sender: "ai",
        text: data?.answer || "Sorry, I couldn't find an answer.",
        time: formattedTime,
      });
    } catch (err) {
      console.error("Error sending message:", err);

      removeTypingIndicator();
      addMessage({
        sender: "ai",
        text: "Oops! Something went wrong. An unexpected error occurred while processing your request. Please give me a moment and try again.",
        time: formattedTime,
        isError: true,
      });
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  const handleDeleteChat = async (id: number) => {
    try {
      await api.deleteConversation(id);
      clearMessages();
      setConversationId(null);
      setLastFetchedId(null);
      router.push("/chat");
      // Refresh history after deletion
      setRefreshHistory(prev => prev + 1);
    } catch (err) {
      console.error("Delete error:", err);
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
        <button
          aria-label="Exit"
          onClick={() => router.push("/dashboard")}
          className="text-white hover:opacity-80"
        >
          <X size={24} />
        </button>
      </div>

      {/* Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 flex flex-col h-full">
          <ChatLayout
            onExpand={() => setIsExpanded(!isExpanded)}
            setConversationId={setConversationId}
            refreshTrigger={refreshHistory} // Pass refresh trigger to ChatLayout
          />
        </div>

        {/* Chat Content */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          >
            {!loading && messages.length === 0 ? (
              <ChatEmptyState 
                title="Hello! I'm Aiva your assistant."
              />
            ) : (
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <ChatMessage key={i} message={msg} showTime />
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* Suggested Prompts */}
          {!loading && messages.length === 0 && (
            <div className="px-6 py-3 flex justify-center">
              <SuggestedPromptFull onPromptClick={handlePromptClick} maxHeight="300px" />
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex items-end gap-2">
              {conversationId && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="cursor-pointer bg-transparent hover:bg-transparent">
                      <Settings className="text-black" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 border-none">
                    <Button
                      className="cursor-pointer bg-red-400 hover:bg-red-500 text-white"
                      onClick={() => handleDeleteChat(conversationId)}
                    >
                      <Trash className="mr-2" /> Delete
                    </Button>
                  </PopoverContent>
                </Popover>
              )}

              <div className="flex items-center gap-2 w-full bg-gray-100 rounded-lg p-2">
                <TextareaAutosize
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !isAiTyping) {
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
                onClick={() => handleSend()}
                className={`bg-linear-to-r from-[#44B997] to-[#4AADB9] hover:bg-[#3fa687] rounded-full p-3 ${
                  isAiTyping ? "cursor-not-allowed pointer-events-none" : ""
                }`}
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