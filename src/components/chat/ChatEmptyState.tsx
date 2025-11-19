"use client";

import { Bot } from "lucide-react";
import { SuggestedPrompts } from "../chatwidget/SuggestedPrompts";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showSuggestedPrompts?: boolean;
  onPromptClick?: (prompt: string) => void;
  customPrompts?: string[];
}

export function ChatEmptyState({ 
  title = "Hello! I'm Aiva, your assistant.",
  subtitle = "How can I help you today?",
  showSuggestedPrompts = true,
  onPromptClick,
  customPrompts,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
      <div className="bg-linear-to-r from-[#44B997] to-[#4AADB9] w-16 h-16 rounded-full flex items-center justify-center">
        <Bot className="text-white" size={32} />
      </div>
      <h2 className="text-lg font-semibold mt-5 mb-1">
        {title}
      </h2>
      <p className="text-gray-500 text-sm mb-4">
        {subtitle}
      </p>
      {/* Suggested Prompts */}
      {/* {showSuggestedPrompts && onPromptClick && (
        <SuggestedPrompts 
          onPromptClick={onPromptClick}
          prompts={customPrompts}
        />
      )} */}
    </div>
  );
}