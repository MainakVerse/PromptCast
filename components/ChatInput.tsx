// ChatInput.tsx
import React from "react";

interface ChatInputProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => Promise<void>;
  isGenerating: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  prompt,
  setPrompt,
  handleSend,
  isGenerating,
}) => {
  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex gap-3 items-end">
        <textarea
          className="flex-1 px-4 py-3 border rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={1}
          placeholder="Type your message..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          disabled={isGenerating}
        />
        <button
          onClick={handleSend}
          disabled={!prompt.trim() || isGenerating}
          className="p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-gray-300"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
