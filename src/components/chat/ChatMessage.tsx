import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Message } from "@/utils/chat-storage";
import { MessageFormatter } from "@/utils/message-formatter";

interface ChatMessageProps {
  message: Message;
  showTime?: boolean;
}

export function ChatMessage({ message, showTime = false }: ChatMessageProps) {
  const isUser = message.sender === "user";
  const isTyping = message.text === "Typing...";
  const isError = message.isError || false; // Check if message is an error

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      className={`flex items-end space-x-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          isError ? "bg-red-100" : "bg-[#E6F5F0]"
        }`}>
          <Bot className={isError ? "text-red-500" : "text-[#44B997]"} size={16} />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm whitespace-pre-wrap wrap-break-word ${
          isUser
            ? "bg-linear-to-r from-[#44B997] to-[#4AADB9] text-white rounded-br-none"
            : isError
            ? "bg-red-50 text-red-800 border border-red-200 rounded-bl-none"
            : "bg-[#F1F5F9] text-gray-800 rounded-bl-none"
        }`}
      >
        {isTyping ? (
          <TypingIndicator />
        ) : (
          <p dangerouslySetInnerHTML={{ __html: MessageFormatter.format(message.text) }} />
        )}
        
        {showTime && !isTyping && (
          <p className={`text-[10px] mt-1 ${
            isUser ? "text-[#DCF5EE]" : isError ? "text-red-400" : "text-gray-400"
          }`}>
            {message.time}
          </p>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>LM</AvatarFallback>
          </Avatar>
        </div>
      )}
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 pt-2">
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.2s]" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.1s]" />
      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
    </div>
  );
}