"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Send, Bot, X } from "lucide-react";

export default function ChatWidget() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    console.log("User message:", message);
    setMessage("");
  };

  return (
    <Card className="p-0 border-none gap-0!">
      {/* Header */}
      <CardHeader className="bg-linear-to-r from-[#44B997] to-[#4AADB9] text-white flex items-center justify-between py-3 px-4">
        <div className="flex items-center space-x-2">
          <div className="bg-white p-2 rounded-full">
            <Bot className="text-[#44B997]" size={22} />
          </div>
          <div>
            <CardTitle className="text-white text-sm font-medium">
              Aiva
            </CardTitle>
            <p className="text-xs opacity-80">Online</p>
          </div>
        </div>
        {/* <button className="text-white opacity-80 hover:opacity-100 text-xl leading-none cursor-pointer">
          <X size={20} />
        </button> */}
      </CardHeader>

      {/* Content */}
      <CardContent className="flex-1 bg-gray-50 px-6 flex flex-col items-center justify-center text-center space-y-3">
        <div className="bg-linear-to-r from-[#44B997] to-[#4AADB9] w-16 h-16 rounded-full flex items-center justify-center">
          <Bot className="text-white" size={32} />
        </div>
        <h2 className="text-lg font-semibold m-0 mt-5 mb-1">
          Hello! I'm Aiva your assistant.
        </h2>
        <p className="text-gray-500 text-sm mb-4">How can I help you today?</p>

        {/* Suggestion buttons */}
        <div className="space-y-2 w-full mt-2">
          {[
            "What are the benefits for regular employees?",
            "How many vacation leave credits do I have left?",
            "Did I have any late or missing logs this week?",
          ].map((text, i) => (
            <button
              key={i}
              className="w-full text-sm bg-white hover:bg-gray-100 border border-gray-200 rounded-full py-2 px-3 transition cursor-pointer "
            >
              {text}
            </button>
          ))}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex items-center border-t bg-white px-3 py-5">
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <Paperclip size={18} />
        </Button>
        <Input
          placeholder="Reply..."
          className="flex-1 mx-2 border-none bg-gray-100 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm py-5"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          className="rounded-full bg-linear-to-r from-[#44B997] to-[#4AADB9] hover:bg-[#3fa687] cursor-pointer"
          size="icon"
          onClick={handleSend}
        >
          <Send size={18} className="text-white " />
        </Button>
      </CardFooter>
    </Card>
  );
}
