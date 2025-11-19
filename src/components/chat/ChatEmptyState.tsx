import { Bot } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function ChatEmptyState({ 
  title = "Hello! I'm Aiva, your assistant.",
  description = "How can I help you today?"
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
        {description}
      </p>
    </div>
  );
}