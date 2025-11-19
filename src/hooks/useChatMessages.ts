import { useState, useEffect } from "react";
import { ChatStorage, Message } from "@/utils/chat-storage";

interface UseChatMessagesReturn {
  messages: Message[];
  conversationId: number | null;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setConversationId: React.Dispatch<React.SetStateAction<number | null>>;
  addMessage: (message: Message) => void;
  addTypingIndicator: (time: string) => void;
  removeTypingIndicator: () => void;
  clearMessages: () => void;
  isAiTyping: boolean;
}

export function useChatMessages(): UseChatMessagesReturn {
  // Initialize with null/empty array to prevent hydration mismatch
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage only on client side after mount
  useEffect(() => {
    if (!isInitialized) {
      setConversationId(ChatStorage.getConversationId());
      setMessages(ChatStorage.getMessages());
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Persist conversationId changes
  useEffect(() => {
    if (isInitialized) {
      ChatStorage.setConversationId(conversationId);
    }
  }, [conversationId, isInitialized]);

  // Persist messages changes (including error messages)
  useEffect(() => {
    if (isInitialized) {
      ChatStorage.setMessages(messages);
    }
  }, [messages, isInitialized]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const addTypingIndicator = (time: string) => {
    setMessages((prev) => [...prev, { sender: "ai", text: "Typing...", time }]);
  };

  const removeTypingIndicator = () => {
    setMessages((prev) => prev.filter((msg) => msg.text !== "Typing..."));
  };

  const clearMessages = () => {
    setMessages([]);
    setConversationId(null);
    ChatStorage.clear();
  };

  const isAiTyping = messages.some(
    (msg) => msg.sender === "ai" && msg.text === "Typing..."
  );

  return {
    messages,
    conversationId,
    setMessages,
    setConversationId,
    addMessage,
    addTypingIndicator,
    removeTypingIndicator,
    clearMessages,
    isAiTyping,
  };
}