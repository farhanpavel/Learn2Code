"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot } from "react-icons/fa";
import { url } from "../Url/page";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ text: string; sender: "user" | "bot" }>
  >([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage = { text: inputValue, sender: "user" as const };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Make API call to your endpoint
      const response = await fetch(`${url}/api/bot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputValue }), // Changed from 'question' to 'message'
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add bot response
      const botMessage = {
        text:
          data.response ||
          data.answer ||
          "I received your message but didn't get a proper response.",
        sender: "bot" as const,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      const botMessage = {
        text: "Sorry, I'm having trouble responding right now. Please try again later.",
        sender: "bot" as const,
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="default"
              size="lg"
              className="rounded-full w-14 h-14 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-lg hover:shadow-xl transition-all duration-300 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600"
            >
              <h1>
                <FaRobot className="h-6 w-6 text-white" />
              </h1>
            </Button>
          </motion.div>
        </PopoverTrigger>
        <PopoverContent className="w-96 h-[500px] mr-4 mb-4 p-0 overflow-hidden rounded-2xl border-0 shadow-2xl">
          <div className="h-full flex flex-col bg-gradient-to-b from-slate-50 to-white">
            <div className="p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
              <h2 className="font-semibold text-lg text-white">AI Assistant</h2>
              <p className="text-sm text-white/80">Always here to help you</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence>
                {messages.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="h-full flex items-center justify-center text-center p-6"
                  >
                    <div className="text-gray-500 space-y-2">
                      <p className="text-lg font-medium">Welcome! 👋</p>
                      <p className="text-sm">How can I assist you today?</p>
                    </div>
                  </motion.div>
                ) : (
                  messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </motion.div>
                  ))
                )}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-gray-100 text-gray-800">
                      <p className="text-sm">Thinking...</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="rounded-full bg-gray-50 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading}
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleSendMessage}
                    className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send"}
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
