
import { useEffect, useRef, useState } from "react";
import { Plane } from "lucide-react";

interface FlightResultProps {
  content: string;
}

const FlightResult = ({ content }: FlightResultProps) => {
  const resultRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div className="w-full max-w-3xl mx-auto rounded-xl bg-white border border-skysettle-border p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-skysettle-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
          <Plane className="h-4 w-4 text-skysettle-primary rotate-45" />
        </div>
        <h2 className="text-lg font-semibold text-skysettle-dark">Flight Check Result</h2>
      </div>
      
      <div 
        ref={resultRef}
        className="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-y-auto"
      >
        {content ? (
          <div className="whitespace-pre-wrap">{content}</div>
        ) : (
          <div className="text-skysettle-dark/50 text-center py-8">
            Submit a flight number and date to check compensation eligibility
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightResult;
