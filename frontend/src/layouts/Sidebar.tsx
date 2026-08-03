import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home,
  Search,
  MessageSquare,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Tooltip } from "@/components/ui/Tooltip";
import { cn } from "@/utils/cn";

// ─── Nav Item Definition ─────────────────────────────────────────────────────

interface NavItemDef {
  id: string;
  label: string;
  path: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItemDef[] = [
  { id: "home", label: "Home", path: "/", icon: Home },
  { id: "search", label: "Search", path: "/search", icon: Search },
  { id: "chat", label: "Chat", path: "/chat", icon: MessageSquare },
  { id: "history", label: "History", path: "/history", icon: History },
];

const BOTTOM_NAV_ITEMS: NavItemDef[] = [
  { id: "settings", label: "Settings", path: "/settings", icon: Settings },
];

// ─── Sidebar Component ────────────────────────────────────────────────────────

export function Sidebar(): React.ReactElement {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const location = useLocation();

  return (
    <aside
      className={cn(
        "flex flex-col h-full flex-shrink-0",
        "bg-[var(--bg-secondary)] border-r border-[var(--border)]",
        "transition-[width] duration-[200ms] ease-in-out",
        collapsed ? "w-14" : "w-[220px]"
      )}
      aria-label="Main navigation"
    >
      {/* ── Logo ── */}
      <div
        className={cn(
          "flex items-center h-12 px-3 border-b border-[var(--border)]",
          "flex-shrink-0 gap-2.5",
          collapsed ? "justify-center" : "justify-start"
        )}
      >
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-accent flex-shrink-0">
          <Zap size={15} className="text-white" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <span className="text-[15px] font-semibold text-[var(--text-primary)] tracking-tight">
            Omnix
          </span>
        )}
      </div>

      {/* ── Main Navigation ── */}
      <nav className="flex-1 flex flex-col gap-0.5 p-2 overflow-y-auto" role="navigation">
        {!collapsed && (
          <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-disabled)] px-2 py-1 mt-1 mb-0.5">
            Navigation
          </p>
        )}
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            isActive={
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.path)
            }
          />
        ))}
      </nav>

      {/* ── Bottom Section ── */}
      <div className="flex flex-col gap-0.5 p-2 border-t border-[var(--border)]">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            collapsed={collapsed}
            isActive={location.pathname.startsWith(item.path)}
          />
        ))}

        {/* Collapse Toggle */}
        <button
          onClick={toggleSidebar}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex items-center gap-2 w-full h-8 px-2 rounded-md mt-1",
            "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
            "hover:bg-[var(--bg-tertiary)]",
            "transition-colors duration-[100ms] ease-out",
            "text-[13px]",
            collapsed ? "justify-center" : "justify-start"
          )}
        >
          {collapsed ? (
            <ChevronRight size={15} strokeWidth={2} />
          ) : (
            <>
              <ChevronLeft size={15} strokeWidth={2} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}

// ─── NavItem ─────────────────────────────────────────────────────────────────

interface NavItemProps {
  item: NavItemDef;
  collapsed: boolean;
  isActive: boolean;
}

function NavItem({ item, collapsed, isActive }: NavItemProps): React.ReactElement {
  const Icon = item.icon;

  const linkContent = (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      aria-label={item.label}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-2.5 h-8 px-2 rounded-md w-full",
        "text-[13px] font-medium",
        "transition-colors duration-[100ms] ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
        isActive
          ? "bg-[var(--accent-muted)] text-accent dark:bg-[var(--accent-muted-dark)] dark:text-blue-400"
          : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]",
        collapsed ? "justify-center" : "justify-start"
      )}
    >
      <Icon
        size={16}
        strokeWidth={isActive ? 2.5 : 2}
        className="flex-shrink-0"
      />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip content={item.label} side="right">
        {linkContent}
      </Tooltip>
    );
  }

  return linkContent;
}
