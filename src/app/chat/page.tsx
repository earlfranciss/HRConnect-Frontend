"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { Bot, X, Settings, Trash, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import TextareaAutosize from "react-textarea-autosize";
import { useChatMessages } from "@/hooks/useChatMessages";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatEmptyState } from "@/components/chat/ChatEmptyState";
import { SuggestedPromptFull } from "@/components/chat/SuggestedPromptFull";
import { api } from "@/services/api";
import { Message, ChatStorage } from "@/utils/chat-storage";

// Import mobile menu components
import { MobileMenuProvider, MobileMenuButton, MobileMenuOverlay } from "@/components/chat/MobileMenuProvider";
import ChatLayoutWrapper from "@/components/chat/ChatLayoutWrapper";

export default function ChatPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [lastFetchedId, setLastFetchedId] = useState<number | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isNewChatClick = useRef(false);

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
    if (!conversationId && isNewChatClick.current) {
      setInputMessage("");
      setLastFetchedId(null);
      setLoading(false);
      clearMessages();
      isNewChatClick.current = false;
    }
  }, [conversationId, clearMessages]);

  // Load messages for existing conversation
  useEffect(() => {
    const fetchExistingChat = async (id: number) => {
      if (lastFetchedId === id) {
        return;
      }

      try {
        setLoading(true);
        
        const storedConversationId = ChatStorage.getConversationId();
        const storedMessages = ChatStorage.getMessages();
        
        if (storedConversationId === id && storedMessages.length > 0 && lastFetchedId === null) {
          setMessages(storedMessages);
          setLastFetchedId(id);
          setLoading(false);
          return;
        }
        
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
        setLastFetchedId(data.conversation_id);
        
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
      setRefreshHistory(prev => prev + 1);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleNewChat = () => {
    isNewChatClick.current = true;
    clearMessages();
    setConversationId(null);
    setInputMessage("");
    setLastFetchedId(null);
    setLoading(false);
  };

  return (
    <MobileMenuProvider>
      <div className="fixed inset-0 z-50 flex flex-col bg-gray-50">
        {/* Mobile Menu Button */}
        <MobileMenuButton />
        
        {/* Mobile Menu Overlay */}
        <MobileMenuOverlay />

        {/* Header */}
        <div className="flex items-center justify-between p-3 md:p-4 bg-linear-to-r from-[#44B997] to-[#4AADB9] text-white shadow-md">
          <div className="flex items-center gap-2 ml-12 md:ml-0">
            <div className="bg-white p-1.5 md:p-2 rounded-full">
              <Bot className="text-[#44B997] w-5 h-5 md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold">HRConnect Aiva</h2>
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
          {/* Sidebar with mobile responsive wrapper */}
          <ChatLayoutWrapper
            onExpand={() => setIsExpanded(!isExpanded)}
            setConversationId={setConversationId}
            refreshTrigger={refreshHistory}
            onNewChat={handleNewChat}
          />

          {/* Chat Content */}
          <div className="flex-1 flex flex-col bg-gray-50 w-full md:w-auto">
            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
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
              <div className="px-4 md:px-6 py-3 flex justify-center">
                <SuggestedPromptFull onPromptClick={handlePromptClick} maxHeight="300px" />
              </div>
            )}

            {/* Input */}
            <div className="p-3 md:p-4 border-t bg-white">
              <div className="flex items-end gap-2">
                {conversationId && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button className="cursor-pointer bg-transparent hover:bg-transparent p-2 md:p-3">
                        <Settings className="text-black w-5 h-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0 border-none">
                      <Button
                        className="cursor-pointer bg-red-400 hover:bg-red-500 text-white"
                        onClick={() => handleDeleteChat(conversationId)}
                      >
                        <Trash className="mr-2 w-4 h-4" /> Delete
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
                  className={`bg-linear-to-r from-[#44B997] to-[#4AADB9] hover:bg-[#3fa687] rounded-full p-2.5 md:p-3 ${
                    isAiTyping ? "cursor-not-allowed pointer-events-none" : ""
                  }`}
                  disabled={isAiTyping}
                >
                  <Send className="w-4 h-4 md:w-5 md:h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MobileMenuProvider>
  );
}