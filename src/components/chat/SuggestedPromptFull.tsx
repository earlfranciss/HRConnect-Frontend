"use client";

import { motion } from "framer-motion";

interface SuggestedPromptsGridProps {
  onPromptClick: (prompt: string) => void;
  prompts?: string[];
  maxHeight?: string;
}

const defaultPrompts = [
  "How many leave credits do I have left?",
  "What is the policy for filing a leave?",
  "When is the payout schedule / payroll release date?",
  "What are the company benefits?",
  "How do I apply for a leave?",
  "Can unused leave be converted to cash?",
];

export function SuggestedPromptFull({ 
  onPromptClick, 
  prompts = defaultPrompts,
  maxHeight = "300px"
}: SuggestedPromptsGridProps) {
  return (
    <div 
      className="flex flex-wrap gap-3 p-2 w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2"
      style={{ maxHeight }}
    >
      {prompts.map((prompt, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => onPromptClick(prompt)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 text-left shadow-sm hover:shadow-md flex-shrink-0 flex-1 min-w-[calc(33.333%-0.5rem)]"
        >
          {prompt}
        </motion.button>
      ))}
    </div>
  );
}