import React from "react";
import { cn } from "@/utils/cn";

type IconButtonSize = "sm" | "md";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: IconButtonSize;
}

const sizeStyles: Record<IconButtonSize, string> = {
  sm: "h-7 w-7",
  md: "h-8 w-8",
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ size = "md", className, children, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-[var(--text-secondary)] transition-colors duration-[100ms] ease-out",
        "hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);

IconButton.displayName = "IconButton";
