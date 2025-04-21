import { useEffect, useRef, useState } from "react";
import { Plane, History, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import LoadingEllipsis from "./LoadingEllipsis";

/**
 * Interface for the props passed to the FlightResult component
 * @property {string} content - The streamed content from flight compensation check API
 */
interface FlightResultProps {
  content: string;
}

/**
 * Interface defining the flight history data structure
 */
interface FlightHistoryData {
  total_flights: number;
  on_time: number;
  delayed: number;
  cancelled: number;
  avg_delay_minutes: number;
}

/**
 * Displays flight check results, history, and delay/cancellation analysis
 * 
 * Handles parsing streamed content and fetching additional flight data.
 * 
 * @param {FlightResultProps} props - The component props
 * @returns React component
 */
const FlightResult = ({ content }: FlightResultProps) => {
  const resultRef = useRef<HTMLDivElement>(null);
  const delayReasonRef = useRef<HTMLDivElement>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState<FlightHistoryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDelayReason, setShowDelayReason] = useState(false);
  const [delayReasonContent, setDelayReasonContent] = useState('');
  const [isLoadingDelayReason, setIsLoadingDelayReason] = useState(false);
  const { toast } = useToast();
  
  // Auto-scroll results when content changes
  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [content]);

  // Auto-scroll delay reason content when it changes
  useEffect(() => {
    if (delayReasonRef.current) {
      delayReasonRef.current.scrollTop = delayReasonRef.current.scrollHeight;
    }
  }, [delayReasonContent]);

  /**
   * Parses streamed content with <think> tags that separate reasoning from final answers
   * 
   * @param {string} content - Raw content from API
   * @returns Object containing reasoning and finalAnswer parts
   */
  const parseStreamedContent = (content: string) => {
    // Check if we have a complete <think> block
    const thinkTagOpened = content.includes('<think>');
    const thinkTagClosed = content.includes('</think>');
    
    // If we have an opening <think> tag but not a closing one, everything so far is reasoning
    if (thinkTagOpened && !thinkTagClosed) {
      return {
        reasoning: content.replace('<think>', '').trim(),
        finalAnswer: ''
      };
    }
    
    // If we have a complete <think></think> block
    const reasoningMatch = content.match(/<think>(.*?)<\/think>/s);
    let finalAnswer = '';
    
    if (reasoningMatch) {
      // Extract the final answer by removing the <think> block
      finalAnswer = content.replace(/<think>.*?<\/think>/s, '').trim();
      
      return {
        reasoning: reasoningMatch[1].trim(),
        finalAnswer
      };
    }
    
    // If there are no <think> tags at all, treat everything as final answer
    return {
      reasoning: '',
      finalAnswer: content
    };
  };

  const { reasoning, finalAnswer } = parseStreamedContent(content);

  /**
   * Fetches flight history data from the API
   */
  const fetchFlightHistory = async () => {
    setIsLoading(true);
    const flightNumber = sessionStorage.getItem("flightNumber");
    const flightDate = sessionStorage.getItem("flightDate");
    
    if (!flightNumber || !flightDate) {
      toast({
        title: "Error",
        description: "Please provide both flight number and date",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Format date to YYYY-MM-DD
    const formattedDate = new Date(flightDate).toISOString().split('T')[0];
    
    try {
      const response = await fetch(`http://localhost:8000/flight-stats?flight_number=${flightNumber}&date=${formattedDate}`, {        
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      const historyData: FlightHistoryData = {
        total_flights: data.total_flights,
        on_time: data.on_time,
        delayed: data.delayed,
        cancelled: data.cancelled,
        avg_delay_minutes: data.avg_delay_minutes,
      };
      
      setHistoryData(historyData);
      setShowHistory(true);
      
      toast({
        title: "Success",
        description: "Flight history loaded",
        variant: "success"
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

  /**
   * Fetches and processes delay/cancellation reasons from the API with streaming response
   */
  const fetchDelayReason = async () => {
    setIsLoadingDelayReason(true);
    setDelayReasonContent('');
    const flightNumber = sessionStorage.getItem("flightNumber");
    const flightDate = sessionStorage.getItem("flightDate");
    
    if (!flightNumber || !flightDate) {
      toast({
        title: "Error",
        description: "Please provide both flight number and date",
        variant: "destructive"
      });
      setIsLoadingDelayReason(false);
      return;
    }
    
    // Format date to YYYY-MM-DD
    const formattedDate = new Date(flightDate).toISOString().split('T')[0];
    
    try {
      const response = await fetch(`http://localhost:8000/cancellation-reason?flight_number=${flightNumber}&date=${formattedDate}`, {
        method: 'GET',
        headers: {
          'Accept': 'text/plain',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch delay reason data');
      }
      
      // Get the response reader for streaming
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }
      
      // Show the delay reason section
      setShowDelayReason(true);
      
      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        const chunk = new TextDecoder().decode(value);
        setDelayReasonContent(prev => prev + chunk);
      }
      
      toast({
        title: "Success",
        description: "Delay reason analysis loaded",
        variant: "success"
      });
    } catch (error) {
      console.error("Error fetching delay reason:", error);
      toast({
        title: "Error",
        description: "Failed to load delay reason data",
        variant: "destructive"
      });
      setShowDelayReason(false);
    } finally {
      setIsLoadingDelayReason(false);
    }
  };

  // Parse the delay reason content using the same parser
  const { reasoning: delayReasoning, finalAnswer: delayFinalAnswer } = delayReasonContent ? parseStreamedContent(delayReasonContent) : { reasoning: '', finalAnswer: '' };

  /**
   * Renders historical flight data cards with statistics
   */
  const renderFlightHistoryCards = () => {
    if (!historyData) return null;
    
    return (
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-skysettle-border">
            <CardContent className="p-4 flex flex-col items-center">
              <h3 className="text-lg font-medium text-skysettle-dark">Total Flights</h3>
              <div className="text-3xl font-bold text-skysettle-primary mt-2">{historyData.total_flights}</div>
            </CardContent>
          </Card>
          
          <Card className="border-skysettle-border">
            <CardContent className="p-4 flex flex-col items-center">
              <h3 className="text-lg font-medium text-skysettle-dark">Average Delay</h3>
              <div className="text-3xl font-bold text-skysettle-warning mt-2">{historyData.avg_delay_minutes} min</div>
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
              <div className="text-2xl font-bold text-green-600 mt-2">{historyData.on_time}</div>
              <div className="text-sm text-gray-500 mt-1">
                {Math.round((historyData.on_time / historyData.total_flights) * 100)}% of flights
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
                {Math.round((historyData.delayed / historyData.total_flights) * 100)}% of flights
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
                {Math.round((historyData.cancelled / historyData.total_flights) * 100)}% of flights
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-4">
          <Button
            onClick={fetchDelayReason}
            variant="outline"
            className="w-full border-skysettle-border bg-gray-50 hover:bg-gray-100"
            disabled={isLoadingDelayReason}
          >
            {isLoadingDelayReason ? (
              <>Analyzing delay/cancellation reasons<LoadingEllipsis /></>
            ) : (
              <>
                <AlertCircle className="mr-2 h-4 w-4 text-skysettle-primary" />
                Check delay/cancel reason
              </>
            )}
          </Button>
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
            {!finalAnswer && (
              <div className="text-skysettle-dark/50 text-center py-8">
                Loading final answer<LoadingEllipsis className="ml-1" />
              </div>
            )}
            {finalAnswer && (
              <div>
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
      
      {content && finalAnswer && (
        <div className="mt-4">
          <Button
            onClick={fetchFlightHistory}
            variant="outline"
            className="w-full border-skysettle-border bg-gray-50 hover:bg-gray-100"
            disabled={isLoading}
          >
            {isLoading ? (
              <>Loading flight history<LoadingEllipsis /></>
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
      
      {showDelayReason && (
        <div className="mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-skysettle-primary/10 w-8 h-8 rounded-full flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-skysettle-primary" />
            </div>
            <h2 className="text-lg font-semibold text-skysettle-dark">Delay/Cancellation Analysis</h2>
          </div>
          
          <div 
            ref={delayReasonRef}
            className="bg-gray-50 rounded-lg p-4 max-h-[400px] overflow-y-auto space-y-4"
          >
            {delayReasonContent ? (
              <>
                {delayReasoning && (
                  <div>
                    <h3 className="text-sm font-semibold text-skysettle-dark mb-2">Model Reasoning</h3>
                    <p className="text-sm text-skysettle-dark/80 bg-white p-3 rounded-md border border-skysettle-border">
                      {delayReasoning}
                    </p>
                  </div>
                )}
                
                {delayFinalAnswer && (
                  <div>
                    <h3 className="text-sm font-semibold text-skysettle-dark mb-2">Summary</h3>
                    <p className="text-sm text-skysettle-dark/80 bg-white p-3 rounded-md border border-skysettle-border">
                      {delayFinalAnswer}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-skysettle-dark/50 text-center py-8">
                Loading delay/cancellation analysis<LoadingEllipsis className="ml-1" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightResult;
