// ─── Theme ───────────────────────────────────────────────────────────────────

export type Theme = "light" | "dark";

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string; // lucide icon name
}

// ─── Page ────────────────────────────────────────────────────────────────────

export interface PageProps {
  title?: string;
}

// ─── Utility Types ───────────────────────────────────────────────────────────

/** Value or null */
export type Maybe<T> = T | null;

/** Value or undefined */
export type Optional<T> = T | undefined;

/** Generic async state */
export interface AsyncState<T> {
  data: Maybe<T>;
  loading: boolean;
  error: Maybe<string>;
}

// ─── App ─────────────────────────────────────────────────────────────────────

export interface AppState {
  theme: Theme;
  sidebarCollapsed: boolean;
}
