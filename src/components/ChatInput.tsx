
import { useState } from "react";
import { ArrowUp, Loader2, Plane } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

const ChatInput = ({ onSend, isLoading = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSend(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative flex w-full flex-col items-center">
      <div className="relative w-full">
        <textarea
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about flight compensation..."
          className="w-full resize-none rounded-xl bg-white border border-skysettle-border px-4 py-4 pr-12 focus:outline-none focus:ring-1 focus:ring-skysettle-primary"
          style={{ maxHeight: "200px" }}
          disabled={isLoading}
        />
        <button 
          onClick={handleSubmit}
          disabled={isLoading || !message.trim()}
          className="absolute right-3 top-[50%] -translate-y-[50%] p-1.5 bg-skysettle-primary rounded-full hover:bg-skysettle-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-white animate-spin" />
          ) : (
            <ArrowUp className="h-4 w-4 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
