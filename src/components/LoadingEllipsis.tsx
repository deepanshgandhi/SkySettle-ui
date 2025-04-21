import React from "react";

/**
 * Interface for props accepted by the LoadingEllipsis component
 * 
 * @property {string} className - Optional additional CSS classes to apply
 * @property {string} color - Optional Tailwind color class for the dots
 */
interface LoadingEllipsisProps {
  className?: string;
  color?: string;
}

/**
 * Renders an animated ellipsis loading indicator
 * 
 * Creates a sequence of three dots with staggered animation to indicate loading.
 * Each dot bounces with a delay to create a wave-like motion.
 * 
 * @param {LoadingEllipsisProps} props - Component props
 * @returns Animated ellipsis loading indicator
 */
const LoadingEllipsis: React.FC<LoadingEllipsisProps> = ({ 
  className = "", 
  color = "text-skysettle-primary"
}) => {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className={`animate-bounce ${color} text-lg`} style={{ animationDelay: "0ms" }}>.</span>
      <span className={`animate-bounce ${color} text-lg`} style={{ animationDelay: "200ms" }}>.</span>
      <span className={`animate-bounce ${color} text-lg`} style={{ animationDelay: "400ms" }}>.</span>
    </span>
  );
};

export default LoadingEllipsis;