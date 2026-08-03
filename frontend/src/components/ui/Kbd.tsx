import React from "react";
import { cn } from "@/utils/cn";

// ─── Types ───────────────────────────────────────────────────────────────────

interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Kbd — Keyboard shortcut display component
 *
 * Renders keyboard key labels in a semantic <kbd> element,
 * styled to look like actual keyboard keys.
 *
 * @example
 * <Kbd>⌘K</Kbd>
 * <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
 */
export function Kbd({ children, className }: KbdProps): React.ReactElement {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center",
        "px-1.5 py-0.5 min-w-[20px]",
        "text-[11px] font-mono font-medium leading-none",
        "text-[var(--text-secondary)]",
        "bg-[var(--bg-tertiary)]",
        "border border-[var(--border)] border-b-[var(--border-strong)]",
        "rounded shadow-sm",
        className
      )}
    >
      {children}
    </kbd>
  );
}
