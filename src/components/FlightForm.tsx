import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import LoadingEllipsis from "./LoadingEllipsis";

/**
 * Zod schema for form validation
 * 
 * Validates flight number and date inputs before submission
 */
const formSchema = z.object({
  flightNumber: z.string().min(2, {
    message: "Flight number must be at least 2 characters.",
  }),
  flightDate: z.date({
    required_error: "Flight date is required.",
  }),
});

/** Type representing validated form data */
type FlightFormValues = z.infer<typeof formSchema>;

/**
 * Props for the FlightForm component
 * 
 * @property {Function} onSubmit - Callback function executed when form is submitted with valid data
 * @property {boolean} isLoading - Optional flag indicating if submission is in progress
 */
interface FlightFormProps {
  onSubmit: (flightNumber: string, flightDate: Date) => Promise<void>;
  isLoading?: boolean;
}

/**
 * Flight information entry form component
 * 
 * Provides validated inputs for flight number and date selection
 * with loading states and error handling.
 * 
 * @param {FlightFormProps} props - Component props
 * @returns React component
 */
const FlightForm = ({ onSubmit, isLoading = false }: FlightFormProps) => {
  const { toast } = useToast();
  const [popoverOpen, setPopoverOpen] = useState(false);
  
  // Initialize form with zod resolver for validation
  const form = useForm<FlightFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flightNumber: "",
    },
  });

  /**
   * Handles form submission after validation
   * 
   * Saves flight data to session storage and calls the parent's onSubmit callback
   * 
   * @param {FlightFormValues} values - Validated form values
   */
  const handleSubmit = async (values: FlightFormValues) => {
    if (isLoading) return;
    
    try {
      // Store flight details in session storage for later use
      sessionStorage.setItem("flightNumber", values.flightNumber);
      sessionStorage.setItem("flightDate", values.flightDate.toString());
      await onSubmit(values.flightNumber, values.flightDate);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form 
        onSubmit={form.handleSubmit(handleSubmit)} 
        className="space-y-4 w-full max-w-md mx-auto"
      >
        <FormField
          control={form.control}
          name="flightNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Flight Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. BA1234" 
                  {...field} 
                  disabled={isLoading}
                  className="border-skysettle-border focus:ring-skysettle-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="flightDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Flight Date</FormLabel>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal border-skysettle-border",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={isLoading}
                    >
                      {field.value ? (
                        format(field.value, "PP")
                      ) : (
                        <span>Select flight date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent 
                  className="w-auto p-0 z-50 bg-white shadow-lg rounded-md border" 
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      field.onChange(date);
                      // Close the popover after selection
                      if (date) setPopoverOpen(false);
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full bg-skysettle-primary hover:bg-skysettle-primary/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              Processing<LoadingEllipsis className="ml-1" color="text-white" />
            </>
          ) : (
            <>
              <Plane className="mr-2 h-4 w-4 rotate-45" />
              Check Flight
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default FlightForm;
