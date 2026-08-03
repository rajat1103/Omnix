import React from "react";
import { cn } from "@/utils/cn";

// ─── Types ───────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Left-side icon element */
  leftIcon?: React.ReactNode;
  /** Right-side icon element */
  rightIcon?: React.ReactNode;
  /** Error state */
  error?: boolean;
  /** Helper text shown below the input */
  helperText?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { leftIcon, rightIcon, error, helperText, className, ...props },
    ref
  ) => {
    return (
      <div className="flex flex-col gap-1 w-full">
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-2.5 flex items-center text-[var(--text-secondary)] pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              // Base
              "h-9 w-full rounded-md px-3 text-[14px]",
              "bg-[var(--bg-primary)] text-[var(--text-primary)]",
              "border border-[var(--border)]",
              "placeholder:text-[var(--text-disabled)]",
              // Focus
              "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30",
              // Transition
              "transition-colors duration-[100ms] ease-out",
              // Disabled
              "disabled:opacity-50 disabled:cursor-not-allowed",
              // Error
              error && "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]/30",
              // Icon padding
              !!leftIcon && "pl-9",
              !!rightIcon && "pr-9",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-2.5 flex items-center text-[var(--text-secondary)]">
              {rightIcon}
            </span>
          )}
        </div>
        {helperText && (
          <p
            className={cn(
              "text-[12px]",
              error ? "text-[var(--error)]" : "text-[var(--text-secondary)]"
            )}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
