import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme } from "@/types/common";

// ─── State Shape ─────────────────────────────────────────────────────────────

interface AppStore {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Sidebar
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  // Active page (tracks current route for breadcrumbs/title etc.)
  activePage: string;
  setActivePage: (page: string) => void;
}

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ── Theme ──
      theme: "light",
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        set({ theme: next });
        applyTheme(next);
      },

      // ── Sidebar ──
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // ── Active Page ──
      activePage: "home",
      setActivePage: (page) => set({ activePage: page }),
    }),
    {
      name: "omnix-app-store",
      // Only persist theme and sidebar state
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
      // Re-apply theme on store rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.theme);
        }
      },
    }
  )
);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Applies theme to the document root element.
 * Tailwind CSS dark mode uses the `dark` class on <html>.
 */
function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}
