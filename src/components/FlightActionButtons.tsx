
import { Plane, Clock, FileText, HelpCircle, AlertCircle } from "lucide-react";

const FlightActionButtons = () => {
  const actions = [
    { icon: <Plane className="h-4 w-4 text-skysettle-primary" />, label: "Check flight status" },
    { icon: <Clock className="h-4 w-4 text-skysettle-accent" />, label: "Delay information" },
    { icon: <FileText className="h-4 w-4 text-skysettle-success" />, label: "File a claim" },
    { icon: <AlertCircle className="h-4 w-4 text-skysettle-warning" />, label: "Passenger rights" },
    { icon: <HelpCircle className="h-4 w-4 text-skysettle-secondary" />, label: "FAQ" },
  ];

  return (
    <div className="flex gap-2 flex-wrap justify-center mt-4">
      {actions.map((action) => (
        <button 
          key={action.label} 
          className="relative flex h-[42px] items-center gap-1.5 rounded-md bg-white border border-skysettle-border px-3 py-2 text-start text-[13px] shadow-sm transition hover:bg-skysettle-hover disabled:cursor-not-allowed xl:gap-2 xl:text-[14px]"
        >
          {action.icon}
          {action.label}
        </button>
      ))}
    </div>
  );
};

export default FlightActionButtons;
