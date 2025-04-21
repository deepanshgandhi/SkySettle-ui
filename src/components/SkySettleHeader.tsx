import { Plane } from "lucide-react";

/**
 * Props for the SkySettleHeader component
 * 
 * @property {Function} onNewChat - Optional callback for creating a new flight check
 */
interface SkySettleHeaderProps {
  onNewChat?: () => void;
}

/**
 * Application header component with branding and navigation elements
 * 
 * Displays the SkySettle logo and app name in a fixed position at the top of the application.
 * 
 * @param {SkySettleHeaderProps} props - Component props
 * @returns React component
 */
const SkySettleHeader = ({ onNewChat }: SkySettleHeaderProps) => {
  return (
    <header className="fixed top-0 z-30 w-full border-b border-skysettle-border bg-white shadow-sm">
      <div className="flex h-[60px] items-center justify-between px-4">
        <div className="flex items-center cursor-pointer" onClick={onNewChat} aria-label="SkySettle Home">
          <Plane className="h-6 w-6 text-skysettle-primary rotate-45" aria-hidden="true" />
          <span className="ml-2 font-bold text-skysettle-primary text-xl">SkySettle</span>
        </div>    
      </div>
    </header>
  );
};

export default SkySettleHeader;
