import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface DropdownProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
  align?: "start" | "end";
}

export function Dropdown({ trigger, children, align = "end" }: DropdownProps): React.ReactElement {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative inline-flex">
      {React.cloneElement(trigger, {
        "aria-expanded": open,
        "aria-haspopup": "menu",
        onClick: () => setOpen((current) => !current),
      })}
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute top-[calc(100%+6px)] z-50 min-w-44 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-1 shadow-[var(--shadow-md)] animate-[menu-enter_160ms_ease-out]",
            align === "start" ? "left-0" : "right-0"
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  destructive?: boolean;
}

export function DropdownItem({ destructive = false, className, children, ...props }: DropdownItemProps): React.ReactElement {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        "flex h-8 w-full items-center rounded-md px-2 text-left text-[13px] transition-colors duration-[100ms] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        destructive
          ? "text-[var(--error)] hover:bg-red-500/10"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
