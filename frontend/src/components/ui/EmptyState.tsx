import React from "react";
import { cn } from "@/utils/cn";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps): React.ReactElement {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-disabled)]">
        {icon}
      </div>
      <h3 className="text-[13px] font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="mt-1 max-w-sm text-[12px] leading-5 text-[var(--text-secondary)]">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
