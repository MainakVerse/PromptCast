"use client";

import { useEffect, useRef } from "react";

interface User {
  name?: string | null;
  image?: string | null;
}

interface Chat {
  role: "user" | "ai";
  message: string;
  createdAt: string;
}

interface ChatMessagesProps {
  chats: Chat[];
  user: User;
  isGenerating: boolean;
}

export function ChatMessages({ chats, user, isGenerating }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, isGenerating]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {chats.length === 0 && !isGenerating ? (
        <div className="flex items-center justify-center h-32 text-center">
          <div>
            <p className="text-gray-500">Start a conversation by sending a message below</p>
          </div>
        </div>
      ) : (
        <>
          {chats.map((chat, index) => (
            <div
              key={index}
              className={`flex gap-4 ${chat.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {chat.role === "ai" && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">AI</span>
                </div>
              )}

              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                  chat.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-900"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{chat.message}</p>
                <p
                  className={`text-xs mt-2 ${
                    chat.role === "user" ? "text-blue-100" : "text-gray-400"
                  }`}
                >
                  {new Date(chat.createdAt).toLocaleTimeString()}
                </p>
              </div>

              {chat.role === "user" && user.image && (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isGenerating && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">AI</span>
              </div>

              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
