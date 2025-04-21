import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Button component variant and size configurations
 * 
 * Defines different visual styles and sizes for buttons using the class-variance-authority pattern.
 * 
 * Variants:
 * - default: Primary action button with brand color
 * - destructive: For destructive actions like delete
 * - outline: Bordered button with transparent background
 * - secondary: Alternative action button
 * - ghost: Minimal button that only shows background on hover
 * - link: Text-only button that looks like a hyperlink
 * 
 * Sizes:
 * - default: Standard size for most contexts
 * - sm: Small button for compact UIs
 * - lg: Large button for prominent actions
 * - icon: Square button for icon-only buttons
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Props for the Button component
 * 
 * @property {boolean} asChild - When true, button behavior is applied to child component instead of rendering a button element
 * @property {string} variant - Visual style variant of the button (default, destructive, outline, etc)
 * @property {string} size - Size variant of the button (default, sm, lg, icon)
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

/**
 * Versatile button component with multiple variants and sizes
 * 
 * Renders either a button element or wraps children depending on asChild prop.
 * Fully accessible and styleable with consistent focus states.
 * 
 * @example
 * // Basic usage
 * <Button>Click me</Button>
 * 
 * @example
 * // With variant and size
 * <Button variant="destructive" size="lg">Delete</Button>
 * 
 * @example
 * // As child component (wrapping another element)
 * <Button asChild>
 *   <Link href="/dashboard">Dashboard</Link>
 * </Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
