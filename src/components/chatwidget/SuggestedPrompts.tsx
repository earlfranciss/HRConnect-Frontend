"use client";

import { motion } from "framer-motion";

interface SuggestedPromptsProps {
  onPromptClick: (prompt: string) => void;
  prompts?: string[];
  maxHeight?: string;
}

const defaultPrompts = [
  "How many leave credits do I have left?",
  "What is the policy for filing a leave?",
  "When is the payout schedule / payroll release date?",
  "How should employees log their attendance?",
  "How do I apply for a leave?",
  "Can unused leave be converted to cash?",
];

export function SuggestedPrompts({ 
  onPromptClick, 
  prompts = defaultPrompts,
  maxHeight = "320px"
}: SuggestedPromptsProps) {
  return (
    <div 
      className="flex flex-col gap-3 w-full max-w-md overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2 scrollbar-hide"
      style={{ maxHeight }}
    >
      {prompts.map((prompt, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onPromptClick(prompt)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-left shadow-sm hover:shadow-md flex-shrink-0"
        >
          {prompt}
        </motion.button>
      ))}
    </div>
  );
}