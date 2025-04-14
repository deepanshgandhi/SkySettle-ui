
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import SkySettleHeader from '@/components/SkySettleHeader';
import ChatInput from '@/components/ChatInput';
import FlightActionButtons from '@/components/FlightActionButtons';
import MessageList from '@/components/MessageList';
import { Plane } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const newMessages = [
        ...messages,
        { role: 'user', content } as const
      ];
      
      setMessages(newMessages);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const assistantMessage: Message = {
        role: 'assistant',
        content: "Hello! I'm your SkySettle assistant, ready to help with your flight delay compensation. Could you please provide your flight details including airline, flight number, and the date of the delay?"
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-skysettle-main">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onApiKeyChange={() => {}} // Empty function since we don't need API key anymore
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <SkySettleHeader isSidebarOpen={isSidebarOpen} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <div className={`flex h-full flex-col ${messages.length === 0 ? 'items-center justify-center' : 'justify-between'} pt-[60px] pb-4`}>
          {messages.length === 0 ? (
            <div className="w-full max-w-3xl px-4 space-y-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-skysettle-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <Plane className="h-8 w-8 text-skysettle-primary rotate-45" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-skysettle-dark mb-2">Welcome to SkySettle</h1>
              <p className="text-skysettle-dark/70 max-w-md mx-auto mb-6">
                Your flight delay compensation assistant. Ask about your rights, check eligibility, and get help filing claims.
              </p>
              <div className="max-w-xl mx-auto">
                <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
              </div>
              <FlightActionButtons />
            </div>
          ) : (
            <>
              <MessageList messages={messages} />
              <div className="bg-skysettle-main border-t border-skysettle-border/30 pt-4">
                <div className="w-full max-w-3xl mx-auto px-4 py-2">
                  <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                </div>
                <div className="text-xs text-center text-skysettle-dark/50 py-2">
                  SkySettle - Making flight compensation simple
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
