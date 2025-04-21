import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to conditionally join Tailwind CSS classes
 * 
 * Uses clsx for conditional class joining and twMerge to properly
 * merge Tailwind CSS classes without conflicts.
 * 
 * @param inputs - Class values to be merged (strings, objects, arrays, etc.)
 * @returns Merged class string with proper Tailwind handling
 * 
 * @example
 * // Basic usage with conditional classes
 * cn('px-2 py-1', isActive && 'bg-blue-500', isDisabled && 'opacity-50')
 * 
 * @example
 * // With class overrides
 * cn('text-red-500', className) // className will override text-red-500 if they conflict
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
