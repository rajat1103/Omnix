import React from "react";
import { cn } from "@/utils/cn";

interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

export function Divider({ orientation = "horizontal", className }: DividerProps): React.ReactElement {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "bg-[var(--border)]",
        orientation === "horizontal" ? "h-px w-full" : "h-4 w-px",
        className
      )}
    />
  );
}
