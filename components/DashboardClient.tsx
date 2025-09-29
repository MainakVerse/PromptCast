"use client";

import { useState, useEffect, useRef } from "react";
import { signOut } from "next-auth/react";
import { Send, Plus, MessageSquare, LogOut, Menu, X, Edit2, Trash2, Check } from "lucide-react";

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
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Add a small delay to ensure session is properly loaded
    const timer = setTimeout(() => {
      fetchChatSessions();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const fetchChatSessions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat-sessions", {
        method: "GET",
        credentials: 'include', // Ensure cookies are sent
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (res.ok) {
        const sessions = await res.json();
        console.log("Fetched sessions:", sessions); // Debug log
        setChatSessions(sessions);
        if (sessions.length > 0 && !activeChatId) {
          setActiveChatId(sessions[0].id);
        }
      } else {
        console.error("Failed to fetch sessions:", res.status, res.statusText);
        // Clear sessions if unauthorized or error
        setChatSessions([]);
      }
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      setChatSessions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, isGenerating]);

  const fetchChats = async () => {
    if (!activeChatId) return;
    
    setIsLoading(true);
    try {
      const res = await fetch(`/api/chats?sessionId=${activeChatId}`, {
        method: "GET",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log(`Fetched ${data.length} messages for session ${activeChatId}`); // Debug log
        setChats(data);
      } else {
        console.error("Failed to fetch chats:", res.status, res.statusText);
        setError("Failed to fetch chat history");
        setChats([]);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
      setError("Failed to fetch chats");
      setChats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateChatTitle = (userMessage: string): string => {
    // Extract meaningful words and create a title
    const words = userMessage.split(' ').filter(word => 
      word.length > 3 && !['what', 'how', 'when', 'where', 'why', 'the', 'and', 'but', 'for', 'with'].includes(word.toLowerCase())
    );
    
    let title = words.slice(0, 4).join(' ');
    if (title.length > 30) {
      title = title.substring(0, 30) + '...';
    }
    
    return title || 'New Conversation';
  };

  const handleSend = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    const userMessage = prompt;
    const isFirstMessage = chats.length === 0;
    setPrompt("");
    setError("");
    setIsGenerating(true);
    
    // Create new chat session if this is the first message and no active chat
    let currentChatId = activeChatId;
    if (!currentChatId) {
      currentChatId = Date.now().toString();
      const newSession: ChatSession = {
        id: currentChatId,
        title: generateChatTitle(userMessage),
        lastMessage: userMessage,
        timestamp: "Just now",
        messageCount: 1
      };
      setChatSessions(prev => [newSession, ...prev]);
      setActiveChatId(currentChatId);
    }
    
    // Add user message immediately
    const newUserMessage: Chat = {
      role: "user",
      message: userMessage,
      createdAt: new Date().toISOString()
    };
    setChats(prev => [...prev, newUserMessage]);

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: userMessage, 
          sessionId: currentChatId,
          isFirstMessage 
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }

      // Add AI response
      const aiMessage: Chat = {
        role: "ai",
        message: data.response || "I'm here to help! How can I assist you today?",
        createdAt: new Date().toISOString()
      };
      setChats(prev => [...prev, aiMessage]);
      
      // Update session with new title if it was auto-generated
      if (isFirstMessage && data.generatedTitle) {
        setChatSessions(prev => prev.map(session => 
          session.id === currentChatId 
            ? { ...session, title: data.generatedTitle, messageCount: 2 }
            : session
        ));
      } else {
        // Update last message and count
        setChatSessions(prev => prev.map(session => 
          session.id === currentChatId 
            ? { 
                ...session, 
                lastMessage: userMessage,
                timestamp: "Just now",
                messageCount: session.messageCount + 2
              }
            : session
        ));
      }
      
    } catch (error) {
      setError("Failed to send message");
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
    setIsSidebarOpen(false);
  };

  const selectChat = async (chatId: string) => {
    if (chatId === activeChatId) return;
    
    console.log(`Selecting chat: ${chatId}`); // Debug log
    setActiveChatId(chatId);
    setIsSidebarOpen(false);
    setChats([]);
    setIsLoading(true);
    
    // Fetch chat history for selected session
    try {
      const res = await fetch(`/api/chats?sessionId=${chatId}`, {
        method: "GET",
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log(`Loaded ${data.length} messages for session ${chatId}`); // Debug log
        setChats(data);
      } else {
        console.error("Failed to load chat history:", res.status);
        setError("Failed to load chat history");
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
      setError("Failed to load chat history");
    } finally {
      setIsLoading(false);
    }
  };

  const startRename = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId);
    setEditingTitle(currentTitle);
  };

  const cancelRename = () => {
    setEditingChatId(null);
    setEditingTitle("");
  };

  const saveRename = async (chatId: string) => {
    if (!editingTitle.trim()) return;
    
    try {
      const res = await fetch(`/api/chat-sessions/${chatId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle.trim() }),
      });

      if (res.ok) {
        setChatSessions(prev => prev.map(session => 
          session.id === chatId 
            ? { ...session, title: editingTitle.trim() }
            : session
        ));
        cancelRename();
      } else {
        setError("Failed to rename chat");
      }
    } catch (error) {
      setError("Failed to rename chat");
    }
  };

  const deleteChat = async (chatId: string) => {
    if (!confirm("Are you sure you want to delete this chat? This action cannot be undone.")) {
      return;
    }
    
    try {
      const res = await fetch(`/api/chat-sessions/${chatId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setChatSessions(prev => prev.filter(session => session.id !== chatId));
        
        if (activeChatId === chatId) {
          const remainingSessions = chatSessions.filter(s => s.id !== chatId);
          if (remainingSessions.length > 0) {
            setActiveChatId(remainingSessions[0].id);
          } else {
            setActiveChatId(null);
            setChats([]);
          }
        }
      } else {
        setError("Failed to delete chat");
      }
    } catch (error) {
      setError("Failed to delete chat");
    }
  };

  useEffect(() => {
    if (activeChatId) {
      fetchChats();
    }
  }, [activeChatId]);

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
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
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>

        {/* Chat Sessions */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {chatSessions.map((session) => (
              <div
                key={session.id}
                className={`
                  group relative rounded-lg transition-colors border
                  ${activeChatId === session.id 
                    ? 'bg-green-50 border-green-200' 
                    : 'hover:bg-gray-50 border-transparent'
                  }
                `}
              >
                <button
                  onClick={() => selectChat(session.id)}
                  className="w-full text-left p-3 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <MessageSquare className={`w-4 h-4 mt-1 flex-shrink-0 ${
                      activeChatId === session.id ? 'text-green-600' : 'text-gray-400'
                    }`} />
                    <div className="min-w-0 flex-1">
                      {editingChatId === session.id ? (
                        <div className="flex gap-2" onClick={e => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="flex-1 text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveRename(session.id);
                              if (e.key === 'Escape') cancelRename();
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => saveRename(session.id)}
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={cancelRename}
                            className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-medium text-sm text-gray-900 truncate">
                            {session.title}
                          </h3>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {session.lastMessage || "No messages yet"}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-400">
                              {session.timestamp}
                            </p>
                            <span className="text-xs text-gray-400">
                              {session.messageCount} msgs
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </button>
                
                {editingChatId !== session.id && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startRename(session.id, session.title);
                        }}
                        className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        title="Rename chat"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteChat(session.id);
                        }}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            {user.image && (
              <img 
                src={user.image} 
                alt={user.name || "User"} 
                className="w-10 h-10 rounded-full flex-shrink-0"
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
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">
                {activeChatId && chatSessions.find(s => s.id === activeChatId)?.title || "New Chat"}
              </h1>
              <p className="text-sm text-gray-500">
                {activeChatId ? "Continue your conversation" : "Start a new conversation"}
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading && chats.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : chats.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-center">
              <div>
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Start a conversation by sending a message below</p>
              </div>
            </div>
          ) : (
            chats.map((chat, index) => (
              <div
                key={index}
                className={`flex gap-4 ${chat.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {chat.role === "ai" && (
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">AI</span>
                  </div>
                )}
                
                <div className={`
                  max-w-[70%] px-4 py-3 rounded-2xl 
                  ${chat.role === "user" 
                    ? "bg-green-600 text-white" 
                    : "bg-white border border-gray-200 text-gray-900"
                  }
                `}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{chat.message}</p>
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

          {/* Typing Indicator */}
          {isGenerating && (
            <div className="flex gap-4 justify-start">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">AI</span>
              </div>
              
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Fixed at Bottom */}
        <div className="bg-white border-t border-gray-200 p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                rows={1}
                placeholder="Type your message..."
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  // Auto-resize textarea
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                }}
                onKeyDown={handleKeyPress}
                disabled={isGenerating}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            
            <button
              onClick={handleSend}
              disabled={!prompt.trim() || isGenerating}
              className="p-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}