import { useEffect, useRef, useState } from "react";
import { Plane, History, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface FlightResultProps {
  content: string;
}

interface FlightHistoryData {
  totalFlights: number;
  onTime: number;
  delayed: number;
  cancelled: number;
  averageDelayMinutes: number;
}

const FlightResult = ({ content }: FlightResultProps) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState<FlightHistoryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [content]);

  const parseStreamedContent = (content: string) => {
    const reasoningMatch = content.match(/<think>(.*?)<\/think>/s);
    const finalAnswerMatch = content.replace(/<think>.*?<\/think>/s, '').trim();

    return {
      reasoning: reasoningMatch ? reasoningMatch[1].trim() : '',
      finalAnswer: finalAnswerMatch
    };
  };

  const { reasoning, finalAnswer } = parseStreamedContent(content);

  const fetchFlightHistory = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, replace with actual API call
      // const response = await fetch('https://your-fastapi-endpoint.com/flight-history', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   }
      // });
      
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      const mockData: FlightHistoryData = {
        totalFlights: 42,
        onTime: 28,
        delayed: 12,
        cancelled: 2,
        averageDelayMinutes: 45
      };
      
      setHistoryData(mockData);
      setShowHistory(true);
      
      toast({
        title: "Success",
        description: "Flight history loaded",
      });
    } catch (error) {
      console.error("Error fetching flight history:", error);
      toast({
        title: "Error",
        description: "Failed to load flight history",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFlightHistoryCards = () => {
    if (!historyData) return null;
    
    return (
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-skysettle-border">
            <CardContent className="p-4 flex flex-col items-center">
              <h3 className="text-lg font-medium text-skysettle-dark">Total Flights</h3>
              <div className="text-3xl font-bold text-skysettle-primary mt-2">{historyData.totalFlights}</div>
            </CardContent>
          </Card>
          
          <Card className="border-skysettle-border">
            <CardContent className="p-4 flex flex-col items-center">
              <h3 className="text-lg font-medium text-skysettle-dark">Average Delay</h3>
              <div className="text-3xl font-bold text-skysettle-warning mt-2">{historyData.averageDelayMinutes} min</div>
            </CardContent>
          </Card>
        </div>
        
        <h3 className="text-lg font-medium text-skysettle-dark mt-6 mb-2">Last 7 Days Flight Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-skysettle-border bg-white">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-skysettle-dark">On Time</h3>
              <div className="text-2xl font-bold text-green-600 mt-2">{historyData.onTime}</div>
              <div className="text-sm text-gray-500 mt-1">
                {Math.round((historyData.onTime / historyData.totalFlights) * 100)}% of flights
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-skysettle-border bg-white">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center mb-2">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-skysettle-dark">Delayed</h3>
              <div className="text-2xl font-bold text-amber-600 mt-2">{historyData.delayed}</div>
              <div className="text-sm text-gray-500 mt-1">
                {Math.round((historyData.delayed / historyData.totalFlights) * 100)}% of flights
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-skysettle-border bg-white">
            <CardContent className="p-4 flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-skysettle-dark">Cancelled</h3>
              <div className="text-2xl font-bold text-red-600 mt-2">{historyData.cancelled}</div>
              <div className="text-sm text-gray-500 mt-1">
                {Math.round((historyData.cancelled / historyData.totalFlights) * 100)}% of flights
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

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
        className="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-y-auto space-y-4"
      >
        {content ? (
          <>
            {reasoning && (
              <div>
                <h3 className="text-sm font-semibold text-skysettle-dark mb-2">Reasoning</h3>
                <p className="text-sm text-skysettle-dark/80 bg-white p-3 rounded-md border border-skysettle-border">
                  {reasoning}
                </p>
              </div>
            )}
            
            {finalAnswer && (
              <div>
                <h3 className="text-sm font-semibold text-skysettle-dark mb-2">Final Answer</h3>
                <p className="text-sm text-skysettle-dark/80 bg-white p-3 rounded-md border border-skysettle-border">
                  {finalAnswer}
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-skysettle-dark/50 text-center py-8">
            Submit a flight number and date to check compensation eligibility
          </div>
        )}
      </div>
      
      {content && (
        <div className="mt-4">
          <Button
            onClick={fetchFlightHistory}
            variant="outline"
            className="w-full border-skysettle-border bg-gray-50 hover:bg-gray-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>Loading flight history...</>
            ) : (
              <>
                <History className="mr-2 h-4 w-4" />
                Show past 7 days flight history
              </>
            )}
          </Button>
        </div>
      )}
      
      {showHistory && renderFlightHistoryCards()}
    </div>
  );
};

export default FlightResult;
