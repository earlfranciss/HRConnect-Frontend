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
  const [conversationId, setConversationId] = useState<number | null>(
    ChatStorage.getConversationId()
  );
  const [messages, setMessages] = useState<Message[]>(ChatStorage.getMessages());

  // Persist conversationId changes
  useEffect(() => {
    ChatStorage.setConversationId(conversationId);
  }, [conversationId]);

  // Persist messages changes
  useEffect(() => {
    ChatStorage.setMessages(messages);
  }, [messages]);

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