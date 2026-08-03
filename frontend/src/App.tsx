import React, { useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
  History as HistoryIcon,
  Home as HomeIcon,
  MessageSquare,
  Moon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { CommandPalette, type CommandPaletteItem } from "@/components/CommandPalette";
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
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const commands = useMemo<CommandPaletteItem[]>(
    () => [
      { id: "home", label: "Go Home", shortcut: "Ctrl 1", icon: HomeIcon, onSelect: () => navigate("/") },
      { id: "search", label: "Go Search", shortcut: "Ctrl 2", icon: SearchIcon, onSelect: () => navigate("/search") },
      { id: "chat", label: "Go Chat", shortcut: "Ctrl 3", icon: MessageSquare, onSelect: () => navigate("/chat") },
      { id: "history", label: "Go History", shortcut: "Ctrl 4", icon: HistoryIcon, onSelect: () => navigate("/history") },
      { id: "settings", label: "Open Settings", shortcut: "Ctrl ,", icon: SettingsIcon, onSelect: () => navigate("/settings") },
      { id: "theme", label: "Toggle Theme", shortcut: "Ctrl Shift L", icon: Moon, onSelect: toggleTheme },
    ],
    [navigate, toggleTheme]
  );

  // Global keyboard shortcuts
  useKeyboardShortcut("ctrl+k", () => setCommandPaletteOpen(true), { preventDefault: true });
  useKeyboardShortcut("ctrl+1", () => navigate("/"), { preventDefault: true });
  useKeyboardShortcut("ctrl+2", () => navigate("/search"), { preventDefault: true });
  useKeyboardShortcut("ctrl+3", () => navigate("/chat"), { preventDefault: true });
  useKeyboardShortcut("ctrl+4", () => navigate("/history"), { preventDefault: true });
  useKeyboardShortcut("ctrl+,", () => navigate("/settings"), { preventDefault: true });
  useKeyboardShortcut("ctrl+b", () => toggleSidebar(), { preventDefault: true });

  // Theme shortcut: Ctrl+Shift+L
  useKeyboardShortcut("ctrl+shift+l", () => toggleTheme(), { preventDefault: true });

  return (
    <>
    <Routes>
      <Route element={<AppLayout onOpenCommandPalette={() => setCommandPaletteOpen(true)} />}>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        {/* Catch-all → Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
    <CommandPalette
      open={commandPaletteOpen}
      onClose={() => setCommandPaletteOpen(false)}
      commands={commands}
    />
    </>
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
