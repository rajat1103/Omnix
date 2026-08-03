import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Sun,
  Moon,
  Settings,
  User,
  Minus,
  Square,
  X,
  Command,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Tooltip } from "@/components/ui/Tooltip";
import { Kbd } from "@/components/ui/Kbd";
import { cn } from "@/utils/cn";

// ─── Header Component ─────────────────────────────────────────────────────────

export function Header(): React.ReactElement {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header
      className={cn(
        "flex items-center h-12 px-3 gap-3 flex-shrink-0",
        "bg-[var(--bg-primary)] border-b border-[var(--border)]"
      )}
      role="banner"
    >
      {/* ── Tauri Window Drag Region ── */}
      {/* data-tauri-drag-region tells Tauri this area is draggable */}
      <div className="flex-1 flex items-center gap-3" data-tauri-drag-region>
        {/* ── Global Search Bar ── */}
        <div
          className={cn(
            "relative flex items-center flex-1 max-w-md",
            "h-8 rounded-md",
            "border transition-colors duration-[100ms] ease-out",
            searchFocused
              ? "border-accent bg-[var(--bg-primary)] ring-1 ring-accent/20"
              : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--border-strong)]"
          )}
        >
          <Search
            size={14}
            className="absolute left-2.5 text-[var(--text-secondary)] pointer-events-none"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Search everything..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            aria-label="Global search"
            className={cn(
              "w-full h-full pl-8 pr-16 bg-transparent",
              "text-[13px] text-[var(--text-primary)]",
              "placeholder:text-[var(--text-disabled)]",
              "focus:outline-none"
            )}
          />
          <div className="absolute right-2.5 flex items-center gap-1 pointer-events-none">
            <Kbd>
              <Command size={9} strokeWidth={2.5} />
            </Kbd>
            <Kbd>K</Kbd>
          </div>
        </div>
      </div>

      {/* ── Right Controls ── */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Theme Toggle */}
        <Tooltip content={isDark ? "Light mode" : "Dark mode"} side="bottom">
          <HeaderIconButton
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
          </HeaderIconButton>
        </Tooltip>

        {/* Settings shortcut */}
        <Tooltip content="Settings" side="bottom">
          <HeaderIconButton
            onClick={() => navigate("/settings")}
            aria-label="Open settings"
          >
            <Settings size={16} strokeWidth={2} />
          </HeaderIconButton>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-4 bg-[var(--border)] mx-1" role="separator" />

        {/* User Avatar Placeholder */}
        <Tooltip content="Account" side="bottom">
          <button
            className={cn(
              "flex items-center justify-center w-7 h-7 rounded-full",
              "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]",
              "hover:bg-[var(--border)] hover:text-[var(--text-primary)]",
              "transition-colors duration-[100ms] ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
            )}
            aria-label="User account"
          >
            <User size={14} strokeWidth={2} />
          </button>
        </Tooltip>

        {/* Divider */}
        <div className="w-px h-4 bg-[var(--border)] mx-1" role="separator" />

        {/* Window Controls Placeholder (Tauri) */}
        <WindowControls />
      </div>
    </header>
  );
}

// ─── Header Icon Button ───────────────────────────────────────────────────────

interface HeaderIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function HeaderIconButton({
  children,
  className,
  ...props
}: HeaderIconButtonProps): React.ReactElement {
  return (
    <button
      className={cn(
        "flex items-center justify-center w-8 h-8 rounded-md",
        "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
        "hover:bg-[var(--bg-tertiary)]",
        "transition-colors duration-[100ms] ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Window Controls (Tauri Placeholder) ─────────────────────────────────────

function WindowControls(): React.ReactElement {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Window controls">
      <Tooltip content="Minimize" side="bottom">
        <button
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-md",
            "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            "hover:bg-[var(--bg-tertiary)]",
            "transition-colors duration-[100ms] ease-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
          )}
          aria-label="Minimize window"
          onClick={() => {
            // Tauri: appWindow.minimize()
            console.info("[WindowControls] minimize — connect Tauri in Sprint 2");
          }}
        >
          <Minus size={13} strokeWidth={2} />
        </button>
      </Tooltip>
      <Tooltip content="Maximize" side="bottom">
        <button
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-md",
            "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            "hover:bg-[var(--bg-tertiary)]",
            "transition-colors duration-[100ms] ease-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
          )}
          aria-label="Maximize window"
          onClick={() => {
            // Tauri: appWindow.maximize()
            console.info("[WindowControls] maximize — connect Tauri in Sprint 2");
          }}
        >
          <Square size={12} strokeWidth={2} />
        </button>
      </Tooltip>
      <Tooltip content="Close" side="bottom">
        <button
          className={cn(
            "flex items-center justify-center w-7 h-7 rounded-md",
            "text-[var(--text-secondary)]",
            "hover:bg-red-500 hover:text-white",
            "transition-colors duration-[100ms] ease-out",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--error)] focus-visible:ring-offset-1"
          )}
          aria-label="Close window"
          onClick={() => {
            // Tauri: appWindow.close()
            console.info("[WindowControls] close — connect Tauri in Sprint 2");
          }}
        >
          <X size={13} strokeWidth={2} />
        </button>
      </Tooltip>
    </div>
  );
}
