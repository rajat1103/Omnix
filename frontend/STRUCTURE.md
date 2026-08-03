# Frontend Structure — Omnix

This document explains the purpose of every folder inside `frontend/src/`.

The frontend is built with **React + TypeScript + Tailwind CSS**, packaged as a native desktop application using **Tauri**.

---

## Folder Map

```
frontend/
└── src/
    ├── components/
    ├── pages/
    ├── layouts/
    ├── features/
    ├── hooks/
    ├── services/
    ├── store/
    ├── assets/
    ├── styles/
    ├── types/
    ├── utils/
    ├── App.tsx
    └── main.tsx
```

---

## Folder Explanations

### `components/`
**Reusable UI primitives.**

Contains atomic and molecular UI components that are not tied to any specific feature or page. These are building blocks used across the entire application.

Examples:
- `Button.tsx`, `Input.tsx`, `Tooltip.tsx` — atomic elements
- `CommandPalette.tsx`, `SearchBar.tsx`, `Modal.tsx` — composed primitives
- `FileCard.tsx`, `ChatBubble.tsx` — domain-aware but reusable elements

Rule: A component in this folder must not import from `features/`, `pages/`, or `store/`.

---

### `pages/`
**Top-level route components.**

Each file in this folder corresponds to a distinct screen in the application. Pages are thin — they compose layouts and features together but contain minimal logic themselves.

Examples:
- `Home.tsx` — Main dashboard
- `Chat.tsx` — AI conversation interface
- `Search.tsx` — Semantic search results
- `Settings.tsx` — User preferences and configuration
- `FileExplorer.tsx` — Indexed file browser

Rule: Pages import from `layouts/`, `features/`, and `components/` — never from other pages.

---

### `layouts/`
**Page layout wrappers.**

Defines the structural shell that wraps pages. Handles persistent UI chrome like sidebars, navigation bars, and header areas.

Examples:
- `AppLayout.tsx` — Main layout with sidebar + content area
- `FullscreenLayout.tsx` — Distraction-free full-screen wrapper
- `SettingsLayout.tsx` — Two-panel settings layout

Rule: Layouts should not contain business logic. They only define structure.

---

### `features/`
**Self-contained feature modules.**

This is the most important folder. Each feature is a vertically sliced module that contains everything specific to that feature: sub-components, local state, feature-specific hooks, and local types.

Structure of a feature module:
```
features/
└── search/
    ├── components/      # Components used only by this feature
    ├── hooks/           # Hooks used only by this feature
    ├── types/           # Types used only by this feature
    ├── utils/           # Utils used only by this feature
    └── index.ts         # Public export barrel
```

Examples of features:
- `search/` — Semantic search interface
- `chat/` — AI conversation feature
- `fileIntelligence/` — File indexing and browsing
- `settings/` — Settings management
- `memory/` — Knowledge and memory browser

Rule: Features expose a public API through `index.ts`. Other features should never reach into each other's internals.

---

### `hooks/`
**Global custom React hooks.**

Hooks that are reused across multiple features and pages. These abstract common patterns like data fetching, keyboard shortcuts, window events, or Tauri-specific APIs.

Examples:
- `useKeyboardShortcut.ts` — Register global hotkeys
- `useTauri.ts` — Wrapper for Tauri invoke and event APIs
- `useDebounce.ts` — Debounce a value
- `useLocalStorage.ts` — Persistent local storage with React state
- `useTheme.ts` — Current theme mode (light/dark)

Rule: Hooks here must be generic and reusable. Feature-specific hooks live inside `features/<name>/hooks/`.

---

### `services/`
**API and external service clients.**

Contains all communication with the backend FastAPI server and any other external services. Provides typed functions that abstract away fetch/axios calls.

Examples:
- `api.ts` — Base API client (Axios instance, interceptors)
- `search.service.ts` — Search endpoint calls
- `chat.service.ts` — Chat/AI endpoint calls
- `files.service.ts` — File indexing and browsing endpoints
- `tauri.service.ts` — Tauri-specific IPC calls that don't belong in hooks

Rule: No UI logic, no React imports. Pure data-fetching and transformation.

---

### `store/`
**Global application state.**

Manages shared application state that spans multiple features. Uses a state management solution (e.g., Zustand, Jotai, or Redux Toolkit — to be decided in Sprint 1).

Examples:
- `useAppStore.ts` — Global app settings (theme, active model, etc.)
- `useChatStore.ts` — Active conversation state
- `useSearchStore.ts` — Current search query and results
- `useIndexingStore.ts` — File indexing progress and status

Rule: Only put state here if it genuinely needs to be shared across multiple unrelated features. Prefer local state and feature-level state first.

---

### `assets/`
**Static assets.**

All static files that are bundled with the application.

```
assets/
├── icons/       # SVG icons (prefer inline SVG or icon library)
├── fonts/       # Custom font files (if self-hosted)
└── images/      # Static images, logos, illustrations
```

Rule: Large images should be optimized before committing. Use SVG for icons wherever possible.

---

### `styles/`
**Global CSS and design token configuration.**

Contains the Tailwind CSS configuration, global base styles, and CSS custom properties (design tokens).

```
styles/
├── globals.css       # Base styles, CSS resets, root variables
├── tokens.css        # Design tokens as CSS custom properties
└── typography.css    # Global typography rules
```

Rule: Avoid writing component-specific styles here. Component styles belong in the component file using Tailwind classes. This folder is for truly global styles only.

---

### `types/`
**Shared TypeScript types and interfaces.**

Type definitions that are used across multiple features and layers of the application.

Examples:
- `models.ts` — Core domain types (File, Message, Memory, etc.)
- `api.ts` — API request/response payload types
- `events.ts` — Tauri event payload types
- `common.ts` — Utility types (Maybe<T>, Paginated<T>, etc.)

Rule: Types used by only one feature live inside that feature's `types/` subfolder. Only promote to this folder when a type is needed by two or more features.

---

### `utils/`
**Pure utility functions.**

Stateless helper functions with no side effects and no React dependencies.

Examples:
- `formatDate.ts` — Date formatting helpers
- `truncate.ts` — String truncation utilities
- `fileSize.ts` — Human-readable file size formatting
- `classNames.ts` — Conditional class name builder
- `debounce.ts` — Debounce implementation

Rule: Every function here must be pure and independently testable. No API calls, no hooks, no state.

---

### `App.tsx`
**Root application component.**

Sets up the router, global providers (state, theme, error boundaries), and renders the top-level layout. This file should be short and declarative.

---

### `main.tsx`
**Application entry point.**

Mounts the React application into the DOM. Configures any pre-mount setup (Tauri initialization, dev tools, etc.).
