import React from "react";
import { cn } from "@/utils/cn";

// ─── Types ───────────────────────────────────────────────────────────────────

type BadgeVariant = "default" | "accent" | "success" | "warning" | "error";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]",
  accent:
    "bg-[var(--accent-muted)] text-accent dark:bg-[var(--accent-muted-dark)] dark:text-blue-400",
  success:
    "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400",
  warning:
    "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  error:
    "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400",
};

// ─── Component ───────────────────────────────────────────────────────────────

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps): React.ReactElement {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5",
        "text-[11px] font-medium leading-none rounded-full",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
