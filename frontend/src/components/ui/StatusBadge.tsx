import React from "react";
import { cn } from "@/utils/cn";

type Status = "neutral" | "info" | "success" | "warning" | "error";

interface StatusBadgeProps {
  status?: Status;
  children: React.ReactNode;
  className?: string;
}

const statusStyles: Record<Status, string> = {
  neutral: "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]",
  info: "bg-[var(--accent-muted)] text-accent dark:bg-[var(--accent-muted-dark)] dark:text-blue-300",
  success: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  error: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
};

export function StatusBadge({ status = "neutral", children, className }: StatusBadgeProps): React.ReactElement {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium leading-none", statusStyles[status], className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  );
}
