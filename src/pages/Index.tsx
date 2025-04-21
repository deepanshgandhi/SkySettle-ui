import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import SkySettleHeader from '@/components/SkySettleHeader';
import FlightForm from '@/components/FlightForm';
import FlightResult from '@/components/FlightResult';
import { Plane } from 'lucide-react';

/**
 * Main page component for the SkySettle application
 * 
 * Handles flight compensation eligibility checks with streaming responses,
 * and manages the overall application state between form input and result views.
 * 
 * @returns React component
 */
const Index = () => {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  /**
   * Handles form submission and fetches compensation check results
   * 
   * Performs API request with streaming response handling to provide
   * real-time updates to the user as data is processed.
   * 
   * @param {string} flightNumber - Flight number entered by user
   * @param {Date} flightDate - Selected flight date
   */
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
      // Format date as YYYY-MM-DD
      const dateStr = flightDate.toISOString().split('T')[0];
      
      // Call the compensation API with streaming response
      const response = await fetch(`http://localhost:8000/compensation?flight_number=${encodeURIComponent(flightNumber)}&date=${dateStr}`, {
        headers: {
          'Accept': 'text/plain',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch compensation data');
      }

      // Get the response reader for streaming
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      // Process stream chunks as they arrive
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        const chunk = new TextDecoder().decode(value);
        setResult(prev => prev + chunk);
      }

      toast({
        title: "Success",
        description: "Flight check completed",
        variant: "success"
      });
    } catch (error: unknown) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to check flight compensation";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resets the application state to start a new flight check
   */
  const handleNewCheck = () => {
    if (result) {
      setResult('');
      toast({
        title: "New Check",
        description: "Started a new flight check",
        variant: "success"
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
              // Form view - shown when no result is available
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
              </>
            ) : (
              // Results view - shown when result data is available
              <>
                <FlightResult content={result} />
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleNewCheck}
                    className="flex items-center gap-2 text-skysettle-primary hover:underline"
                    aria-label="Check another flight"
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
