"use client";

import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { Send, Plus, MessageSquare, LogOut, Menu, X } from "lucide-react";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Chat {
  role: "user" | "ai";
  message: string;
  createdAt: string;
}

interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messageCount: number;
}

export default function DashboardClient({ user }: { user: User }) {
  const [prompt, setPrompt] = useState("");
  const [chats, setChats] = useState<Chat[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch chat sessions on mount
  useEffect(() => {
    fetchChatSessions();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, isGenerating]);

  const fetchChatSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat-sessions");
      if (res.ok) {
        const sessions = await res.json();
        setChatSessions(sessions);
        
        // Only auto-select first session if no active chat and sessions exist
        // Don't auto-select if user just created a new chat
        if (sessions.length > 0 && activeChatId === null && chats.length === 0) {
          // Check if we're not in a "new chat" state
          const urlParams = new URLSearchParams(window.location.search);
          const isNewChat = urlParams.get('new') === 'true';
          if (!isNewChat) {
            setActiveChatId(sessions[0].id);
          }
        }
      } else {
        console.error("Failed to fetch chat sessions");
      }
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChats = async (chatId: string) => {
    if (!chatId) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch(`/api/chats?sessionId=${chatId}`);
      if (res.ok) {
        const data = await res.json();
        setChats(data || []);
      } else if (res.status === 404) {
        // Session doesn't exist yet - this is fine for new sessions
        setChats([]);
      } else {
        const errorData = await res.json();
        setChats([]);
        setError(errorData.error || "Failed to fetch chat history");
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      setChats([]);
      setError("Failed to fetch chat history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setError("");
    setIsGenerating(true);

    const userMessage = prompt;
    const sessionIdToUse = activeChatId || undefined;

    // Optimistic UI update
    const newUserMessage: Chat = {
      role: "user",
      message: userMessage,
      createdAt: new Date().toISOString()
    };
    setChats(prev => [...prev, newUserMessage]);
    setPrompt("");

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: userMessage, 
          sessionId: sessionIdToUse 
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      const aiMessage: Chat = {
        role: "ai",
        message: data.response || "I'm here to help!",
        createdAt: new Date().toISOString()
      };
      
      setChats(prev => [...prev, aiMessage]);

      const newSessionId = data.sessionId;
      
      // Update active session
      if (!activeChatId || activeChatId !== newSessionId) {
        setActiveChatId(newSessionId);
      }

      // Update or add session in the list
      setChatSessions(prev => {
        const existingIndex = prev.findIndex(s => s.id === newSessionId);
        const updatedSession: ChatSession = {
          id: newSessionId,
          title: data.generatedTitle || prev.find(s => s.id === newSessionId)?.title || "New Chat",
          lastMessage: aiMessage.message.slice(0, 50) + (aiMessage.message.length > 50 ? "..." : ""),
          timestamp: "Just now",
          messageCount: (prev.find(s => s.id === newSessionId)?.messageCount || 0) + 2
        };

        if (existingIndex >= 0) {
          // Update existing session
          const updated = [...prev];
          updated[existingIndex] = updatedSession;
          // Move to top
          return [updatedSession, ...updated.filter((_, i) => i !== existingIndex)];
        } else {
          // Add new session at the top
          return [updatedSession, ...prev];
        }
      });

    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message");
      // Remove the optimistic user message on error
      setChats(prev => prev.slice(0, -1));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const createNewChat = () => {
    setActiveChatId(null);
    setChats([]);
    setError("");
    setIsSidebarOpen(false);
    setIsLoading(false); // Ensure loading state is reset
    
    // Focus on the textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const selectChat = async (chatId: string) => {
    if (chatId === activeChatId) {
      setIsSidebarOpen(false);
      return;
    }
    
    setActiveChatId(chatId);
    setChats([]);
    setError("");
    setIsSidebarOpen(false);
    
    await fetchChats(chatId);
  };

  // Auto-fetch chats when active chat changes
  useEffect(() => {
    if (activeChatId) {
      fetchChats(activeChatId);
    } else {
      // If no active chat (new chat), clear everything
      setChats([]);
      setError("");
      setIsLoading(false);
    }
  }, [activeChatId]);

  const getCurrentChatTitle = () => {
    if (!activeChatId) return "New Chat";
    const currentSession = chatSessions.find(s => s.id === activeChatId);
    return currentSession?.title || "Chat";
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Sidebar Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Chat History</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="lg:hidden p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <button 
            onClick={createNewChat} 
            className="w-full flex items-center gap-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-5 h-5" /> New Chat
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading && chatSessions.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : chatSessions.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No chat sessions yet</p>
            </div>
          ) : (
            chatSessions.map(session => (
              <button 
                key={session.id} 
                onClick={() => selectChat(session.id)} 
                className={`w-full text-left p-3 rounded-lg transition-colors border ${
                  activeChatId === session.id 
                    ? 'bg-green-50 border-green-200' 
                    : 'hover:bg-gray-50 border-transparent'
                }`}
              >
                <div className="flex items-start gap-3">
                  <MessageSquare className={`w-4 h-4 mt-1 flex-shrink-0 ${
                    activeChatId === session.id ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-sm text-gray-900 truncate">
                      {session.title}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {session.lastMessage || "No messages yet"}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-400">{session.timestamp}</p>
                      <span className="text-xs text-gray-400">
                        {session.messageCount} msg{session.messageCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            {user.image && (
              <img 
                src={user.image} 
                alt={user.name || "User"} 
                className="w-10 h-10 rounded-full" 
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut()} 
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-900">
              {getCurrentChatTitle()}
            </h1>
            <p className="text-sm text-gray-500">
              {activeChatId ? "Continue your conversation" : "Start a new conversation"}
            </p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading && chats.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : chats.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-32 text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-4" />
              <p>Start a conversation by sending a message below</p>
            </div>
          ) : (
            chats.map((chat, index) => (
              <div key={index} className={`flex gap-4 ${
                chat.role === "user" ? "justify-end" : "justify-start"
              }`}>
                {chat.role === "ai" && (
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    AI
                  </div>
                )}
                <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                  chat.role === "user" 
                    ? "bg-green-600 text-white" 
                    : "bg-white border border-gray-200 text-gray-900"
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {chat.message}
                  </p>
                  <p className={`text-xs mt-2 ${
                    chat.role === "user" ? "text-green-100" : "text-gray-400"
                  }`}>
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
            ))
          )}
          
          {isGenerating && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                AI
              </div>
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          <div className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={1}
              placeholder="Type your message..."
              value={prompt}
              onChange={(e) => { 
                setPrompt(e.target.value); 
                e.target.style.height = 'auto'; 
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'; 
              }}
              onKeyDown={handleKeyPress}
              disabled={isGenerating}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button 
              onClick={handleSend} 
              disabled={!prompt.trim() || isGenerating} 
              className="p-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex-shrink-0 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}