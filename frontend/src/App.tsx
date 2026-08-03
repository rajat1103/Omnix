import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Chat from "@/pages/Chat";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import { useTheme } from "@/hooks/useTheme";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/useAppStore";

// ─── Inner App (needs router context for hooks) ───────────────────────────────

function AppInner(): React.ReactElement {
  const navigate = useNavigate();
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const { toggleTheme } = useTheme();

  // Global keyboard shortcuts
  useKeyboardShortcut("ctrl+1", () => navigate("/"), { preventDefault: true });
  useKeyboardShortcut("ctrl+2", () => navigate("/search"), { preventDefault: true });
  useKeyboardShortcut("ctrl+3", () => navigate("/chat"), { preventDefault: true });
  useKeyboardShortcut("ctrl+4", () => navigate("/history"), { preventDefault: true });
  useKeyboardShortcut("ctrl+,", () => navigate("/settings"), { preventDefault: true });
  useKeyboardShortcut("ctrl+b", () => toggleSidebar(), { preventDefault: true });

  // Theme shortcut: Ctrl+Shift+L
  useKeyboardShortcut("ctrl+shift+l", () => toggleTheme(), { preventDefault: true });

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        {/* Catch-all → Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App(): React.ReactElement {
  // Initialize theme on mount (reads from persisted Zustand store)
  useTheme();

  return (
    <BrowserRouter>
      <AppInner />
    </BrowserRouter>
  );
}
