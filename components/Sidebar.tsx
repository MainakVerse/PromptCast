// Sidebar.tsx
import React from "react";
import { Plus, Edit2, Trash2, Check, X } from "lucide-react";

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messageCount: number;
}

interface SidebarProps {
  chatSessions: ChatSession[];
  activeChatId: string | null;
  onSelect: (chatId: string) => void;
  onNewChat: () => void;
  onRename: (chatId: string, currentTitle: string) => void;
  onDelete: (chatId: string) => void;
  editingChatId: string | null;
  editingTitle: string;
  setEditingTitle: React.Dispatch<React.SetStateAction<string>>;
  cancelRename: () => void;
  saveRename: (chatId: string) => Promise<void>;
}

const Sidebar: React.FC<SidebarProps> = ({
  chatSessions,
  activeChatId,
  onSelect,
  onNewChat,
  onRename,
  onDelete,
  editingChatId,
  editingTitle,
  setEditingTitle,
  cancelRename,
  saveRename,
}) => {
  return (
    <div className="w-96 border-r border-gray-200 flex flex-col h-full bg-white shadow-sm">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Chats</h2>
        <button
          onClick={onNewChat}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          title="New Chat"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-2">
        {chatSessions.length === 0 && (
          <p className="text-gray-400 text-sm text-center mt-4">No chats yet</p>
        )}

        {chatSessions.map((session) => (
          <div
            key={session.id}
            className={`group relative rounded-lg p-3 cursor-pointer transition-colors ${
              activeChatId === session.id
                ? "bg-blue-50 border border-blue-200"
                : "hover:bg-gray-50"
            }`}
          >
            {editingChatId === session.id ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveRename(session.id);
                    if (e.key === "Escape") cancelRename();
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
              <div
                onClick={() => onSelect(session.id)}
                className="flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {session.title}
                  </h3>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRename(session.id, session.title);
                      }}
                      className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(session.id);
                      }}
                      className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 truncate mt-1">{session.lastMessage || "No messages"}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-gray-400">{session.timestamp}</p>
                  <span className="text-xs text-gray-400">{session.messageCount} msgs</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
