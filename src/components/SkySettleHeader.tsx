
import { Plane, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SkySettleHeaderProps {
  onNewChat?: () => void;
}

const SkySettleHeader = ({ onNewChat }: SkySettleHeaderProps) => {
  return (
    <div className="fixed top-0 z-30 w-full border-b border-skysettle-border bg-white shadow-sm">
      <div className="flex h-[60px] items-center justify-between px-4">
        <div className="flex items-center">
          <Plane className="h-6 w-6 text-skysettle-primary rotate-45" />
          <span className="ml-2 font-bold text-skysettle-primary text-xl">SkySettle</span>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 border-skysettle-border hover:bg-skysettle-hover hover:text-skysettle-primary"
            onClick={onNewChat}
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
          <span className="text-xs bg-skysettle-success/10 text-skysettle-success px-2 py-1 rounded-full">Assistant Online</span>
        </div>
      </div>
    </div>
  );
};

export default SkySettleHeader;
