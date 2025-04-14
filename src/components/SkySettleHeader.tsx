
import { Plane, Menu } from "lucide-react";

interface SkySettleHeaderProps {
  isSidebarOpen?: boolean;
  onToggleSidebar: () => void;
}

const SkySettleHeader = ({ isSidebarOpen = true, onToggleSidebar }: SkySettleHeaderProps) => {
  return (
    <div className="fixed top-0 z-30 w-full border-b border-skysettle-border bg-white shadow-sm">
      <div className="flex h-[60px] items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <button onClick={onToggleSidebar} className="p-1 rounded-md hover:bg-skysettle-hover">
            <Menu className="h-5 w-5 text-skysettle-dark" />
          </button>
          <div className="flex items-center">
            <Plane className="h-6 w-6 text-skysettle-primary rotate-45" />
            <span className="ml-2 font-bold text-skysettle-primary text-xl">SkySettle</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-skysettle-success/10 text-skysettle-success px-2 py-1 rounded-full">Assistant Online</span>
        </div>
      </div>
    </div>
  );
};

export default SkySettleHeader;
