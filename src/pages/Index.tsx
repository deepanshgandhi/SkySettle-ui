
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import SkySettleHeader from '@/components/SkySettleHeader';
import FlightActionButtons from '@/components/FlightActionButtons';
import FlightForm from '@/components/FlightForm';
import FlightResult from '@/components/FlightResult';
import { Plane } from 'lucide-react';

const Index = () => {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (flightNumber: string, flightDate: Date) => {
    if (!flightNumber.trim() || !flightDate) {
      toast({
        title: "Error",
        description: "Please provide both flight number and date",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setResult('');

    try {
      // Here we would normally make a real API call to a FastAPI backend
      // For demonstration, we'll simulate streaming with a fake response
      
      // Simulate API endpoint call
      const response = await fetch('https://your-fastapi-endpoint.com/check-flight', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flightNumber,
          flightDate: flightDate.toISOString().split('T')[0],
        }),
      });

      // Check if the response is ok
      if (!response.ok) {
        throw new Error('Failed to fetch data from API');
      }

      // Simulate streaming response
      const reader = response.body?.getReader();
      
      // Since we can't actually connect to a real API, let's simulate a streaming response
      // In a real implementation, you would use the reader to read chunks
      await simulateStreamingResponse((chunk) => {
        setResult(prev => prev + chunk);
      });

      toast({
        title: "Success",
        description: "Flight check completed",
      });
    } catch (error: any) {
      // In a real app, replace this with actual API error handling
      console.error('Error:', error);
      
      // Simulate a streaming response for demonstration
      await simulateStreamingResponse((chunk) => {
        setResult(prev => prev + chunk);
      });
      
      toast({
        title: "Note",
        description: "Using simulated data (no actual API connected)",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // This function simulates a streaming response
  const simulateStreamingResponse = async (callback: (chunk: string) => void) => {
    const simulatedResponse = [
      "Checking flight details...\n\n",
      "Flight: {flightNumber}\n",
      "Date: {date}\n\n",
      "Processing flight information...\n",
      "Checking for delays or cancellations...\n\n",
      "Result: This flight was delayed by 3 hours and 45 minutes.\n\n",
      "Compensation eligibility: Based on EU Regulation 261/2004, you may be entitled to compensation of up to €600.\n\n",
      "Next steps: We recommend filing a claim with the airline. Would you like assistance with preparing your claim?"
    ];

    for (const chunk of simulatedResponse) {
      await new Promise(resolve => setTimeout(resolve, 500));
      callback(chunk);
    }
  };

  const handleNewCheck = () => {
    if (result) {
      setResult('');
      toast({
        title: "New Check",
        description: "Started a new flight check",
      });
    }
  };

  return (
    <div className="flex h-screen bg-skysettle-main">
      <main className="flex-1 w-full">
        <SkySettleHeader onNewChat={handleNewCheck} />
        
        <div className="flex h-full flex-col items-center pt-[76px] pb-4 px-4">
          <div className="w-full max-w-3xl space-y-6 mt-8">
            {!result ? (
              <>
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className="bg-skysettle-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                      <Plane className="h-8 w-8 text-skysettle-primary rotate-45" />
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-skysettle-dark mb-2">Welcome to SkySettle</h1>
                  <p className="text-skysettle-dark/70 max-w-md mx-auto mb-6">
                    Check your flight delay compensation eligibility. Enter your flight details below to get started.
                  </p>
                </div>
                <FlightForm onSubmit={handleSubmit} isLoading={isLoading} />
                <FlightActionButtons />
              </>
            ) : (
              <>
                <FlightResult content={result} />
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleNewCheck}
                    className="flex items-center gap-2 text-skysettle-primary hover:underline"
                  >
                    <Plane className="h-4 w-4 rotate-45" />
                    Check another flight
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="text-xs text-center text-skysettle-dark/50 mt-auto py-2">
            SkySettle - Making flight compensation simple
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
