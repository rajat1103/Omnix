import React, { useState, useRef } from "react";
import { cn } from "@/utils/cn";

// ─── Types ───────────────────────────────────────────────────────────────────

type TooltipSide = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  content: string;
  side?: TooltipSide;
  children: React.ReactElement;
  disabled?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Tooltip({
  content,
  side = "top",
  children,
  disabled = false,
}: TooltipProps): React.ReactElement {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = () => {
    timeoutRef.current = setTimeout(() => setVisible(true), 400);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  if (disabled) return children;

  const positionStyles: Record<TooltipSide, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
    left: "right-full top-1/2 -translate-y-1/2 mr-1.5",
    right: "left-full top-1/2 -translate-y-1/2 ml-1.5",
  };

  return (
    <div className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {visible && (
        <div
          role="tooltip"
          className={cn(
            "absolute z-50 pointer-events-none",
            "px-2 py-1 rounded-md",
            "bg-[#111827] dark:bg-[#F9FAFB]",
            "text-[#F9FAFB] dark:text-[#111827]",
            "text-[12px] font-medium leading-tight whitespace-nowrap",
            "shadow-md",
            "animate-in fade-in-0",
            positionStyles[side]
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}
