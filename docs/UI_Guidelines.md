# UI Guidelines — Omnix

---

## Document Purpose

This document defines the **design language, visual system, and UX principles** for Omnix. It is the single source of truth for every visual and interactive decision made in the frontend. Any developer contributing to the UI should read this document before writing a single line of CSS or JSX.

---

## Design Philosophy

Omnix is a **professional desktop productivity tool**, not an AI showcase. The interface should feel like it belongs alongside Linear, Raycast, VS Code, and Notion — tools that developers and knowledge workers trust and use for hours every day.

### The Interface Must Feel:
- **Fast** — Interactions should feel instantaneous. No loading spinners for operations under 200ms.
- **Calm** — No visual noise, aggressive animations, or color overload.
- **Confident** — Clear visual hierarchy. The user always knows where they are and what to do next.
- **Precise** — Pixel-level attention to alignment, spacing, and proportion.

### The Interface Must NOT Feel:
- Like an AI product demo (no purple gradients, no neon glows)
- Like a web app running in a browser (this is a native desktop application)
- Like it's trying to impress — it impresses by being useful, not flashy

---

## Color System

### Core Palette

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--bg-primary` | `#FFFFFF` | `#111827` | Main background |
| `--bg-secondary` | `#F9FAFB` | `#1F2937` | Sidebar, panels |
| `--bg-tertiary` | `#F3F4F6` | `#374151` | Hover states, inset areas |
| `--border` | `#E5E7EB` | `#374151` | All borders and dividers |
| `--border-strong` | `#D1D5DB` | `#4B5563` | Focused elements, separators |
| `--text-primary` | `#111827` | `#F9FAFB` | Body text, headings |
| `--text-secondary` | `#6B7280` | `#9CA3AF` | Labels, descriptions, metadata |
| `--text-disabled` | `#9CA3AF` | `#4B5563` | Disabled states |

### Accent Color

Omnix uses **a single accent color**. The chosen accent is:

```
Blue — #2563EB (Tailwind: blue-600)
```

| Token | Value | Usage |
|---|---|---|
| `--accent` | `#2563EB` | Primary buttons, active states, links |
| `--accent-hover` | `#1D4ED8` | Button hover (blue-700) |
| `--accent-muted` | `#EFF6FF` | Accent backgrounds, badges (light mode) |
| `--accent-muted-dark` | `#1E3A5F` | Accent backgrounds (dark mode) |

**Rules:**
- Use the accent sparingly. It should draw the eye only to the most important interactive element on screen.
- Never use multiple accent colors on the same screen.
- Teal (`#0F766E`) is the reserved alternative. If the user switches themes, swap to teal — never use both simultaneously.

### Semantic Colors

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--success` | `#16A34A` | `#22C55E` | Successful operations |
| `--warning` | `#D97706` | `#F59E0B` | Warnings, incomplete states |
| `--error` | `#DC2626` | `#EF4444` | Errors, destructive actions |
| `--info` | `#2563EB` | `#3B82F6` | Informational states |

---

## Typography

### Font Family

```
Primary: "Inter", sans-serif
Monospace: "JetBrains Mono", "Geist Mono", monospace
```

Inter is loaded from Google Fonts or self-hosted. It is the only non-system font in the application.

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `heading-xl` | 24px | 600 | 1.3 | Page titles |
| `heading-lg` | 20px | 600 | 1.3 | Section headers |
| `heading-md` | 16px | 600 | 1.4 | Card titles, dialog headers |
| `heading-sm` | 14px | 600 | 1.4 | Sidebar section labels |
| `body-lg` | 15px | 400 | 1.6 | Primary body text |
| `body` | 14px | 400 | 1.6 | Standard body text |
| `body-sm` | 13px | 400 | 1.5 | Secondary descriptions, metadata |
| `caption` | 12px | 400 | 1.4 | Timestamps, helper text |
| `label` | 12px | 500 | 1.2 | Form labels, tags |
| `code` | 13px | 400 | 1.6 | Inline code, paths |

### Rules

- **Never** use font sizes below 12px
- **Never** use font weights below 400 for body text
- Avoid using more than 3 different weights on a single screen
- Line lengths should stay between 55–80 characters for reading comfort

---

## Spacing System

Omnix uses a **4px base unit** spacing system. All spacing values are multiples of 4.

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Icon padding, tight gaps |
| `space-2` | 8px | Item padding, small gaps |
| `space-3` | 12px | Component internal padding |
| `space-4` | 16px | Standard element padding |
| `space-5` | 20px | Section padding |
| `space-6` | 24px | Card padding |
| `space-8` | 32px | Section gaps |
| `space-10` | 40px | Large section gaps |
| `space-12` | 48px | Page-level margins |

---

## Layout

### Application Shell

```
┌─────────────────────────────────────────────────────┐
│                  Title Bar (Tauri custom)             │
├──────────┬──────────────────────────────────────────┤
│          │                                           │
│ Sidebar  │            Main Content Area              │
│ (220px)  │                                           │
│          │                                           │
│          │                                           │
└──────────┴──────────────────────────────────────────┘
```

- **Sidebar width:** 220px (fixed, collapsible)
- **Content max-width:** 860px (centered in wider windows)
- **Minimum window size:** 900 × 600px

### Grid

Use a **12-column grid** for content layouts. Prefer explicit grid over flexbox for page-level composition.

---

## Motion & Animation

### Principles

Animation in Omnix must serve function, not decoration. Every animation should:
1. Confirm that an action was received
2. Orient the user during transitions
3. Provide feedback during loading states

### Timing

| Name | Duration | Easing | Usage |
|---|---|---|---|
| `instant` | 0ms | — | State changes with no perceived delay |
| `fast` | 100ms | `ease-out` | Micro-interactions: button presses, hover |
| `normal` | 150ms | `ease-in-out` | Dropdown open/close, tooltips |
| `slow` | 200ms | `ease-in-out` | Panel transitions, modal open |

**Hard rule:** No animation shall exceed **200ms**. Longer animations feel sluggish in productivity tools.

### What to Animate

✅ Allowed:
- Hover state color transitions
- Focus ring appearance
- Dropdown / tooltip fade in
- Sidebar collapse/expand
- Skeleton loading shimmer
- Toast notification slide in

❌ Not Allowed:
- Page transitions with slide or zoom effects
- Rotating logos or loading spinners for primary content
- Bounce or spring physics animations
- Parallax effects
- Any animation that can't be disabled via `prefers-reduced-motion`

### Reduced Motion

All animations must respect the `prefers-reduced-motion` media query. Set all animation durations to 0ms when this preference is active.

---

## Component Patterns

### Buttons

Three variants only:

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| `primary` | `--accent` | white | none | Single primary action per screen |
| `secondary` | transparent | `--text-primary` | `--border` | Secondary actions |
| `ghost` | transparent | `--text-secondary` | none | Tertiary actions, toolbar items |

Rules:
- Never use more than one `primary` button per view
- Destructive actions use the `secondary` variant with `--error` text color
- Buttons always show a visible focus ring (keyboard accessibility)

### Input Fields

- Height: 36px (single-line), auto-height (multi-line)
- Border: 1px solid `--border`
- Border on focus: 1px solid `--accent`
- Background: `--bg-primary`
- Placeholder text: `--text-disabled`

### Command Palette

The command palette is the primary interaction surface. It follows the Raycast / Linear / VS Code paradigm:
- Opens with `Cmd+K` / `Ctrl+K`
- Full-width search at the top, results list below
- Keyboard navigation only (arrow keys + Enter)
- Results grouped by category with a subtle label
- Appears centered in the window with a backdrop blur overlay

### Sidebar Navigation

- Item height: 32px
- Icon + label layout
- Active item: `--accent-muted` background, `--accent` text
- Hover: `--bg-tertiary` background
- Section labels: `caption` size, uppercase, `--text-disabled` color

---

## Accessibility

- All interactive elements must have visible focus states
- Color is never the sole indicator of state (always pair with text or icon)
- ARIA labels on all icon-only buttons
- Minimum contrast ratio: **4.5:1** for body text, **3:1** for large text and UI components
- All animations must respect `prefers-reduced-motion`
- Keyboard navigation must work on all interactive surfaces

---

## What NOT to Do

| ❌ Avoid | ✅ Instead |
|---|---|
| Purple or gradient backgrounds | Flat whites and charcoals |
| Neon or glowing text | Muted accent color |
| Glassmorphism panels | Solid, bordered panels |
| Multiple accent colors | One accent, used sparingly |
| Heavy drop shadows | Subtle 1–2px borders |
| Animated page transitions | Instant content swaps |
| Emoji in UI chrome | Use proper SVG icons |
| `font-size: 11px` for labels | Minimum 12px |
| Rounded corners > 8px on panels | 4–6px for components, 8px maximum |
