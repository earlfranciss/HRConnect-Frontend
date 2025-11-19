import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  placeholder = "Ask anything about HR..."
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (disabled) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <TextareaAutosize
        placeholder={placeholder}
        minRows={1}
        maxRows={6}
        className="flex-1 mx-2 border-none bg-gray-100 rounded-xl resize-none focus-visible:ring-0 text-sm py-3 px-4 whitespace-pre-wrap wrap-break-word outline-0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />

      <Button
        className={`rounded-full bg-linear-to-r from-[#44B997] to-[#4AADB9] hover:bg-[#3fa687] ${
          disabled ? "cursor-not-allowed pointer-events-none" : "cursor-pointer"
        }`}
        size="icon"
        onClick={onSend}
        disabled={disabled}
      >
        <Send size={18} className="text-white" />
      </Button>
    </div>
  );
}