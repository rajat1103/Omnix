import React from "react";
import { cn } from "@/utils/cn";

// ─── Types ───────────────────────────────────────────────────────────────────

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Show a loading spinner */
  loading?: boolean;
  /** Render as full-width block */
  fullWidth?: boolean;
  /** Left-side icon element */
  leftIcon?: React.ReactNode;
  /** Right-side icon element */
  rightIcon?: React.ReactNode;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-[#1D4ED8] active:bg-[#1E40AF] shadow-sm",
  secondary:
    "bg-transparent text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--bg-tertiary)] active:bg-[var(--bg-tertiary)]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] active:bg-[var(--bg-tertiary)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-7 px-3 text-[13px] gap-1.5",
  md: "h-8 px-3 text-[13px] gap-2",
  lg: "h-9 px-4 text-[14px] gap-2",
};

// ─── Component ───────────────────────────────────────────────────────────────

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "secondary",
      size = "md",
      loading = false,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        className={cn(
          // Base
          "inline-flex items-center justify-center font-medium rounded-md",
          "transition-colors duration-[100ms] ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "select-none",
          // Variant
          variantStyles[variant],
          // Size
          sizeStyles[size],
          // Full width
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-3.5 h-3.5 rounded-full bg-current opacity-50" aria-hidden="true" />
        ) : (
          leftIcon
        )}
        {children && <span>{children}</span>}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";
