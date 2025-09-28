// context/ChatContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messageCount: number;
}

interface ChatContextProps {
  sessions: ChatSession[];
  setSessions: (sessions: ChatSession[]) => void;
  selectedSessionId: string | null;
  setSelectedSessionId: (id: string | null) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  return (
    <ChatContext.Provider value={{ sessions, setSessions, selectedSessionId, setSelectedSessionId }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
