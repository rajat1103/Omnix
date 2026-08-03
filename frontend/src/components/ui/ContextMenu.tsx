import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

interface ContextMenuProps {
  children: React.ReactNode;
  menu: React.ReactNode;
  className?: string;
}

export function ContextMenu({ children, menu, className }: ContextMenuProps): React.ReactElement {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = () => setPosition(null);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    window.addEventListener("click", close);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div
      className={className}
      onContextMenu={(event) => {
        event.preventDefault();
        setPosition({ x: event.clientX, y: event.clientY });
      }}
    >
      {children}
      {position && (
        <div
          ref={menuRef}
          role="menu"
          className={cn(
            "fixed z-50 min-w-40 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-1 shadow-[var(--shadow-md)]",
            "animate-[menu-enter_160ms_ease-out]"
          )}
          style={{ left: position.x, top: position.y }}
          onClick={(event) => event.stopPropagation()}
        >
          {menu}
        </div>
      )}
    </div>
  );
}

interface ContextMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
}

export function ContextMenuItem({ inset = false, className, children, ...props }: ContextMenuItemProps): React.ReactElement {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(
        "flex h-8 w-full items-center rounded-md px-2 text-left text-[13px] text-[var(--text-secondary)] transition-colors duration-[100ms] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
