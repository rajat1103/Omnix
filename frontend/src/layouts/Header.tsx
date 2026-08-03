import React from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  Search,
  Sun,
  Moon,
  Settings,
  Minus,
  Square,
  X,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Tooltip } from "@/components/ui/Tooltip";
import { Kbd } from "@/components/ui/Kbd";
import { Avatar } from "@/components/ui/Avatar";
import { Divider } from "@/components/ui/Divider";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/utils/cn";

// ─── Header Component ─────────────────────────────────────────────────────────

interface HeaderProps {
  onOpenCommandPalette: () => void;
}

export function Header({ onOpenCommandPalette }: HeaderProps): React.ReactElement {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

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
        <button
          type="button"
          onClick={onOpenCommandPalette}
          aria-label="Open command palette"
          className={cn(
            "relative flex h-8 items-center flex-1 max-w-md text-left",
            "h-8 rounded-md",
            "border border-[var(--border)] bg-[var(--bg-secondary)] transition-colors duration-[100ms] ease-out",
            "hover:border-[var(--border-strong)] hover:bg-[var(--bg-primary)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
          )}
        >
          <Search
            size={14}
            className="absolute left-2.5 text-[var(--text-secondary)] pointer-events-none"
            strokeWidth={2}
          />
          <span className="w-full truncate pl-8 pr-16 text-[13px] text-[var(--text-disabled)]">
            Ask Omnix or search your workspace...
          </span>
          <div className="absolute right-2.5 flex items-center gap-1 pointer-events-none">
            <Kbd>Ctrl</Kbd>
            <Kbd>K</Kbd>
          </div>
        </button>
      </div>

      {/* ── Right Controls ── */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Theme Toggle */}
        <Tooltip content={isDark ? "Light mode" : "Dark mode"} side="bottom">
          <IconButton
            onClick={toggleTheme}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
          </IconButton>
        </Tooltip>

        {/* Settings shortcut */}
        <Tooltip content="Settings" side="bottom">
          <IconButton
            onClick={() => navigate("/settings")}
            aria-label="Open settings"
          >
            <Settings size={16} strokeWidth={2} />
          </IconButton>
        </Tooltip>

        {/* Divider */}
        <Divider orientation="vertical" className="mx-1" />

        {/* User Avatar Placeholder */}
        <Tooltip content="Account" side="bottom">
          <IconButton aria-label="User account" size="sm" className="rounded-full hover:bg-[var(--border)]">
            <Avatar size="sm" />
          </IconButton>
        </Tooltip>

        {/* Divider */}
        <Divider orientation="vertical" className="mx-1" />

        {/* Window Controls Placeholder (Tauri) */}
        <WindowControls />
      </div>
    </header>
  );
}

// ─── Header Icon Button ───────────────────────────────────────────────────────

// ─── Window Controls (Tauri Placeholder) ─────────────────────────────────────

function WindowControls(): React.ReactElement {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Window controls">
      <Tooltip content="Minimize" side="bottom">
        <IconButton
          size="sm"
          aria-label="Minimize window"
          onClick={() => runWindowAction((appWindow) => appWindow.minimize())}
        >
          <Minus size={13} strokeWidth={2} />
        </IconButton>
      </Tooltip>
      <Tooltip content="Maximize" side="bottom">
        <IconButton
          size="sm"
          aria-label="Maximize window"
          onClick={() => runWindowAction((appWindow) => appWindow.toggleMaximize())}
        >
          <Square size={12} strokeWidth={2} />
        </IconButton>
      </Tooltip>
      <Tooltip content="Close" side="bottom">
        <IconButton
          size="sm"
          className="hover:bg-red-500 hover:text-white focus-visible:ring-[var(--error)]"
          aria-label="Close window"
          onClick={() => runWindowAction((appWindow) => appWindow.close())}
        >
          <X size={13} strokeWidth={2} />
        </IconButton>
      </Tooltip>
    </div>
  );
}

function runWindowAction(
  action: (appWindow: ReturnType<typeof getCurrentWindow>) => Promise<void>
): void {
  if (!("__TAURI_INTERNALS__" in window)) return;
  void action(getCurrentWindow()).catch(() => undefined);
}
