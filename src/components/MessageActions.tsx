
import { Volume2, ThumbsUp, ThumbsDown, Copy, RotateCcw, MoreHorizontal } from "lucide-react";

const MessageActions = () => {
  return (
    <div className="flex items-center gap-2 text-skysettle-dark/50">
      <button className="p-1 hover:text-skysettle-primary transition-colors">
        <Volume2 className="h-4 w-4" />
      </button>
      <button className="p-1 hover:text-skysettle-primary transition-colors">
        <ThumbsUp className="h-4 w-4" />
      </button>
      <button className="p-1 hover:text-skysettle-primary transition-colors">
        <ThumbsDown className="h-4 w-4" />
      </button>
      <button className="p-1 hover:text-skysettle-primary transition-colors">
        <Copy className="h-4 w-4" />
      </button>
      <button className="p-1 hover:text-skysettle-primary transition-colors">
        <RotateCcw className="h-4 w-4" />
      </button>
      <button className="p-1 hover:text-skysettle-primary transition-colors">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
};

export default MessageActions;
