
import { Plane, MapPin, Calendar, Clock, FileText, HelpCircle, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onApiKeyChange: (apiKey: string) => void;
}

const Sidebar = ({ isOpen, onToggle, onApiKeyChange }: SidebarProps) => {
  const [apiKey, setApiKey] = useState("");
  const recentSearches = [
    { title: "Recent Searches", items: ["LH1234 Frankfurt to London", "BA789 Delayed 3 hours"] },
    { 
      title: "Saved Claims", 
      items: [
        "Air France AF1234 - 05/12/2024",
        "Lufthansa LH4321 - 10/03/2024",
        "British Airways BA789 - 22/01/2024",
        "Delta DL456 - 15/12/2023"
      ] 
    },
    {
      title: "Information",
      items: [
        "EU Regulation 261/2004",
        "US Department of Transportation",
        "Montreal Convention",
        "Claim Eligibility Calculator",
        "Compensation Amounts"
      ]
    }
  ];

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    onApiKeyChange(newApiKey);
  };

  return (
    <div className={cn(
      "fixed top-0 left-0 z-40 h-screen bg-skysettle-sidebar border-r border-skysettle-border transition-all duration-300",
      isOpen ? "w-64" : "w-0"
    )}>
      <nav className="flex h-full w-full flex-col px-3" aria-label="Flight history">
        <div className="flex justify-between flex h-[60px] items-center">
          <button onClick={onToggle} className="h-10 rounded-lg px-2 text-skysettle-dark hover:bg-skysettle-hover">
            <Plane className="h-5 w-5 rotate-45" />
          </button>
          <span className="font-semibold text-skysettle-primary">SkySettle</span>
        </div>

        <div className="flex-col flex-1 transition-opacity duration-500 relative -mr-2 pr-2 overflow-y-auto">
          {isOpen && (
            <div className="p-2 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Key className="h-4 w-4 text-skysettle-dark" />
                <span className="text-sm font-medium">API Key</span>
              </div>
              <Input
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={handleApiKeyChange}
                className="bg-white border-skysettle-border"
              />
            </div>
          )}

          <div className="pt-0">
            <div className="flex flex-col gap-2 px-2 py-2">
              <div className="group flex h-10 items-center gap-2.5 rounded-lg px-2 hover:bg-skysettle-hover cursor-pointer bg-skysettle-primary/10">
                <div className="h-6 w-6 flex items-center justify-center">
                  <Plane className="h-4 w-4 text-skysettle-primary" />
                </div>
                <span className="text-sm font-medium">Flight Status</span>
              </div>
              <div className="group flex h-10 items-center gap-2.5 rounded-lg px-2 hover:bg-skysettle-hover cursor-pointer">
                <div className="h-6 w-6 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-skysettle-dark" />
                </div>
                <span className="text-sm">Compensation Claims</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4">
              {recentSearches.map((section) => (
                <div key={section.title}>
                  <div className="px-3 py-2 text-xs font-medium text-skysettle-dark/70">{section.title}</div>
                  {section.items.map((item) => (
                    <div key={item} className="group flex h-10 items-center gap-2.5 rounded-lg px-3 hover:bg-skysettle-hover cursor-pointer text-skysettle-dark/80">
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="flex flex-col py-2 border-t border-skysettle-border">
            <button className="group flex gap-2 p-2.5 text-sm items-start hover:bg-skysettle-hover rounded-lg px-2 text-left w-full">
              <span className="flex w-full flex-row flex-wrap-reverse justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-skysettle-border bg-skysettle-primary text-white">
                    <HelpCircle className="h-4 w-4" />
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium">Help Center</span>
                    <span className="line-clamp-1 text-xs text-skysettle-dark/70">Get assistance with claims</span>
                  </div>
                </div>
              </span>
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
