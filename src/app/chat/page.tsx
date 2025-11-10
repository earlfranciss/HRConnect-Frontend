"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import TextareaAutosize from "react-textarea-autosize";
import { ThumbsUp, ThumbsDown, Send, Paperclip, Bot } from "lucide-react";

const chatMessages = [
  {
    id: 1,
    textBeforeList: `You currently have 5 vacation leave credits remaining as of November 7, 2025.
Leave Summary:`,
    list: [
      "Vacation Leave: 5 days",
      "Sick Leave: 8 days",
      "Emergency Leave: 2 days",
    ],
    textAfterList: `Would you like me to show your leave history or help you file a new leave request?`,
    time:"4:30 pm",
  },
  {
    id: 2,
    textBeforeList: `You currently have 5 vacation l025.
Leave Summary:`,
    list: [
      "Vacation Leave: 5 days",
      "Sick Leave: 8 days",
      "Emergency Leave: 2 days",
    ],
    textAfterList: `Would you like to file a new leave request?`,
    time:"4:31 pm",
  },

];

export default function ChatPage() {
  const [input, setInput] = useState("The advantages of Artificial Intelligence");
  const [inputHeight, setInputHeight] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages load
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-white relative">

      {/* Scrollable chat */}
      <div
        ref={chatRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-6"
        style={{ paddingBottom: inputHeight + 80 }} // extra padding for floating input
      >
        {chatMessages.map((msg, idx) => (
          <div key={idx} className="flex gap-2">
            <div className="flex bg-[#4AADB9] w-10 h-10 p-2 rounded-full justify-center items-center">
              <Bot className="text-white" size={22} />
            </div>
            <div className="flex flex-col item-start">

            <div className="inline-block max-w-2xl pb-2 p-4 rounded-xl text-[#1B2559] bg-[#F0F6FF]">
              <p>{msg.textBeforeList}</p>
              {msg.list.length > 0 && (
                <ol className="list-decimal list-inside mt-3 space-y-2">
                  {msg.list.map((item, i) => <li key={i}>{item}</li>)}
                </ol>
              )}
              <p className="mt-3">{msg.textAfterList}</p>
              <div className="flex justify-end gap-2">
                <button className="p-2 rounded-full hover:bg-[#E4EFFF] transition">
                  <ThumbsUp className="w-4 h-4 text-[#1B2559]" />
                </button>
                <button className="p-2 rounded-full hover:bg-[#E4EFFF] transition">
                  <ThumbsDown className="w-4 h-4 text-[#1B2559]" />
                </button>
              </div>
              
            </div>
            <p className="text-xs text-[#7C8199] p-1">{msg.time}</p>
          </div>
          </div>
        ))}

        {/* Suggested actions */}
        <div className="flex flex-wrap gap-3 justify-start ml-8 mt-4">
          {["Can I file a vacation leave next week?", "Show my leave history for this year"].map((text, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="p-3 rounded-full bg-gradient-to-b from-[#4AADB9] to-[#44B997] text-white text-xs border-none hover:bg-[#2c3e1a] transition"
            >
              {text}
            </Button>
          ))}
        </div>
      </div>

      {/* Floating sticky input */}
      <div
        className="sticky bottom-18 left-4 right-4 z-20 bg-white p-4 flex flex-col gap-2 "
        style={{ maxWidth: "calc(100% - 32px)" }}
      >
        <div className="flex justify-center mb-2">
          <Button
            variant="ghost"
            className="rounded-full p-4 text-[#666D91] border border-[#666D91] hover:bg-[#CEEAE7] transition text-sm"
          >
            Regenerate response
          </Button>
        </div>

        <div className="flex items-end gap-2">
          <Button className="bg-[#F8FBFF] hover:bg-[#F0F6FF] text-[#1B2559] rounded-lg p-4 m-1">
            <Paperclip className="w-8 h-8" />
          </Button>

          <div className="flex items-center gap-2 w-full bg-[#F0F6FF] rounded-lg p-2">
            <TextareaAutosize
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onHeightChange={(height) => setInputHeight(height)}
              placeholder="Ask anything"
              minRows={1}
              maxRows={5}
              className="flex-1 border-none bg-transparent resize-none focus-visible:ring-0 text-sm p-1 text-[#1B2559] outline-none"
            />
          </div>

          <Button className="bg-[#4AADB9] hover:bg-[#62CAD6] text-white rounded-lg p-4 m-1">
            <Send className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </div>
  );
}
