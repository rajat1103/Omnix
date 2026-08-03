import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

// ─── AppLayout ────────────────────────────────────────────────────────────────

/**
 * AppLayout — The main application shell.
 *
 * Structure:
 * ┌────────────────────────────────────────┐
 * │           Header (48px)                │
 * ├──────────┬─────────────────────────────┤
 * │          │                             │
 * │ Sidebar  │   <Outlet /> (page content) │
 * │ 220/56px │                             │
 * │          │                             │
 * └──────────┴─────────────────────────────┘
 *
 * The layout itself contains no business logic.
 */
interface AppLayoutProps {
  onOpenCommandPalette: () => void;
}

export function AppLayout({ onOpenCommandPalette }: AppLayoutProps): React.ReactElement {
  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--bg-primary)] overflow-hidden min-w-[900px] min-h-[600px]">
      {/* Top navigation bar */}
      <Header onOpenCommandPalette={onOpenCommandPalette} />

      {/* Body: Sidebar + Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <Sidebar />

        {/* Main content area */}
        <main
          className="flex-1 overflow-y-auto bg-[var(--bg-primary)]"
          id="main-content"
          role="main"
          aria-label="Main content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
