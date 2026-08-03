import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import type { Theme } from "@/types/common";

/**
 * useTheme — Global theme hook
 *
 * Reads the current theme from the global store and provides
 * a setter that syncs both the store and the DOM class.
 */
export function useTheme(): {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
} {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);

  // Ensure DOM class is in sync on mount (handles SSR / fresh load)
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return {
    theme,
    isDark: theme === "dark",
    setTheme,
    toggleTheme,
  };
}
