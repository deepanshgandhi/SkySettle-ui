
import { useEffect, useRef, useState } from "react";
import { BarChart, Plane, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip,
  Cell
} from "recharts";
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

  const renderFlightHistoryChart = () => {
    if (!historyData) return null;
    
    const chartData = [
      { name: 'On Time', value: historyData.onTime, color: '#10B981' },
      { name: 'Delayed', value: historyData.delayed, color: '#F59E0B' },
      { name: 'Cancelled', value: historyData.cancelled, color: '#ea384c' }
    ];

    return (
      <div className="mt-6 space-y-4">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg w-full md:w-auto">
            <h3 className="text-lg font-medium text-skysettle-dark">Total Flights</h3>
            <div className="text-3xl font-bold text-skysettle-primary mt-2">{historyData.totalFlights}</div>
          </div>
          
          <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg w-full md:w-auto">
            <h3 className="text-lg font-medium text-skysettle-dark">Average Delay</h3>
            <div className="text-3xl font-bold text-skysettle-warning mt-2">{historyData.averageDelayMinutes} min</div>
          </div>
        </div>
        
        <div className="mt-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-skysettle-dark mb-4">Last 7 Days Flight Status</h3>
          <div className="h-[300px]">
            <ChartContainer
              config={{
                onTime: { label: "On Time", color: "#10B981" },
                delayed: { label: "Delayed", color: "#F59E0B" },
                cancelled: { label: "Cancelled", color: "#ea384c" }
              }}
            >
              <RechartsBarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-2 border rounded shadow-sm">
                          <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="value" barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ChartContainer>
          </div>
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
      
      {showHistory && renderFlightHistoryChart()}
    </div>
  );
};

export default FlightResult;
