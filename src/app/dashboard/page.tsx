"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, Send } from "lucide-react";

export default function ChatPage() {
  const [input, setInput] = useState(
    "The advantages of Artificial Intelligence"
  );

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FFEED6]">
      {/* Scrollable chat content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-36">
        {/* Chat response */}
        <div className="bg-[#FFEED6] p-4 rounded-xl text-[#435334]">
          <p>
            Artificial Intelligence (AI) offers numerous advantages and has the
            potential to revolutionize various aspects of our lives. Here are
            some key advantages of AI:
          </p>
          <ol className="list-decimal list-inside mt-3 space-y-2">
            <li>
              <strong>Automation:</strong> AI can automate repetitive and
              mundane tasks, saving time and effort for humans. It can handle
              large volumes of data and perform complex calculations
              efficiently.
            </li>
            <li>
              <strong>Decision-making:</strong> AI systems can analyze data,
              identify patterns, and make informed decisions based on that
              analysis.
            </li>
            <li>
              <strong>Improved accuracy:</strong> AI algorithms can achieve high
              precision in image recognition, natural language processing, and
              data analysis.
            </li>
            <li>
              <strong>Continuous operation:</strong> AI systems can work
              tirelessly without breaks, resulting in uninterrupted 24/7
              operations.
            </li>
          </ol>

          <div className="flex justify-end gap-2 mt-4">
            <button className="p-2 rounded-full hover:bg-[#EADBC8] transition">
              <ThumbsUp className="w-4 h-4 text-[#435334]" />
            </button>
            <button className="p-2 rounded-full hover:bg-[#EADBC8] transition">
              <ThumbsDown className="w-4 h-4 text-[#435334]" />
            </button>
          </div>
        </div>

        {/* Suggested actions */}
        <div className="flex flex-wrap gap-3 justify-start">
          {[
            "Make Response Shorter",
            "Explain it to me like a lawyer",
            "Tell me about more",
          ].map((text, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="rounded-full bg-[#435334] text-white border-none hover:bg-[#2c3e1a] transition"
            >
              {text}
            </Button>
          ))}
        </div>
      </div>

      {/* Fixed input area (bottom) */}
      <div className="w-full border-t border-[#D8CBB0] bg-[#FFEED6] p-4 absolute bottom-[7rem] pr-10">
        <div className="flex justify-center mb-3">
          <Button
            variant="ghost"
            className="rounded-full text-[#435334] border border-[#435334] hover:bg-[#EADBC8] transition"
          >
            Regenerate response
          </Button>
        </div>

        <div className="flex items-center gap-2 w-full bg-[#EADBC8] rounded-xl p-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border-none bg-transparent resize-none focus-visible:ring-0 text-[#435334]"
            rows={1}
          />
          <Button className="bg-[#435334] hover:bg-[#2c3e1a] text-white rounded-xl p-3">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
