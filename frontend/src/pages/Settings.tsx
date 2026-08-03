import React, { useState } from "react";
import {
  Palette,
  Keyboard,
  Shield,
  Info,
  ChevronRight,
  Sun,
  Moon,
  Monitor,
  SlidersHorizontal,
} from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";
import type { Theme } from "@/types/common";

// ─── Settings Category ────────────────────────────────────────────────────────

interface SettingsCategory {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

const CATEGORIES: SettingsCategory[] = [
  {
    id: "general",
    label: "General",
    icon: SlidersHorizontal,
    description: "Workspace and navigation preferences",
  },
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    description: "Theme, colors, and display",
  },
  {
    id: "shortcuts",
    label: "Keyboard Shortcuts",
    icon: Keyboard,
    description: "Customize key bindings",
  },
  {
    id: "privacy",
    label: "Privacy & Data",
    icon: Shield,
    description: "Data storage and privacy controls",
  },
  {
    id: "about",
    label: "About Omnix",
    icon: Info,
    description: "Version, licenses, and updates",
  },
];

// ─── Setting Row ──────────────────────────────────────────────────────────────

interface SettingRowProps {
  label: string;
  description?: string;
  children?: React.ReactNode;
}

function SettingRow({ label, description, children }: SettingRowProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between gap-6 py-4 border-b border-[var(--border)] last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[var(--text-primary)]">{label}</p>
        {description && (
          <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">{description}</p>
        )}
      </div>
      {children && <div className="flex-shrink-0">{children}</div>}
    </div>
  );
}

// ─── Theme Selector ───────────────────────────────────────────────────────────

interface ThemeOptionProps {
  value: Theme;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
}

function ThemeOption({
  value: _value,
  label,
  icon: Icon,
  active,
  onClick,
}: ThemeOptionProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 p-3 rounded-lg w-24",
        "border transition-all duration-[100ms] ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
        active
          ? "border-accent bg-[var(--accent-muted)] dark:bg-[var(--accent-muted-dark)]"
          : "border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-secondary)]"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-md",
          active ? "text-accent dark:text-blue-400" : "text-[var(--text-secondary)]"
        )}
      >
        <Icon size={18} strokeWidth={active ? 2.5 : 2} />
      </div>
      <span
        className={cn(
          "text-[12px] font-medium",
          active ? "text-accent dark:text-blue-400" : "text-[var(--text-secondary)]"
        )}
      >
        {label}
      </span>
    </button>
  );
}

// ─── Shortcut Row ─────────────────────────────────────────────────────────────

function ShortcutRow({
  action,
  shortcut,
}: {
  action: string;
  shortcut: string;
}): React.ReactElement {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[var(--border)] last:border-0">
      <span className="text-[13px] text-[var(--text-primary)]">{action}</span>
      <code className="text-[12px] font-mono text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded border border-[var(--border)]">
        {shortcut}
      </code>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Settings(): React.ReactElement {
  const [activeCategory, setActiveCategory] = useState("general");
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex h-full">
      {/* ── Category Sidebar ── */}
      <div
        className={cn(
          "flex flex-col w-56 flex-shrink-0 h-full",
          "border-r border-[var(--border)]",
          "bg-[var(--bg-secondary)]",
          "p-3"
        )}
      >
        <h1 className="text-[13px] font-semibold text-[var(--text-primary)] px-2 py-2 mb-1">
          Settings
        </h1>

        <nav className="flex flex-col gap-0.5" role="navigation" aria-label="Settings categories">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2.5 w-full h-8 px-2 rounded-md text-left",
                  "text-[13px] font-medium",
                  "transition-colors duration-[100ms] ease-out",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
                  isActive
                    ? "bg-[var(--accent-muted)] text-accent dark:bg-[var(--accent-muted-dark)] dark:text-blue-400"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                )}
              >
                <Icon size={15} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ── Settings Content ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[680px]">
          {/* ── Appearance ── */}
          {activeCategory === "general" && (
            <section>
              <h2 className="text-[20px] font-semibold text-[var(--text-primary)] tracking-tight mb-1">
                General
              </h2>
              <p className="text-[14px] text-[var(--text-secondary)] mb-8">
                Workspace preferences for your Omnix desktop app.
              </p>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4">
                <SettingRow label="Workspace navigation" description="Use the sidebar or command palette to move between sections.">
                  <Badge variant="accent">Enabled</Badge>
                </SettingRow>
                <SettingRow label="Command palette" description="Open available commands and navigation with Ctrl+K.">
                  <Badge variant="default">Ctrl+K</Badge>
                </SettingRow>
                <SettingRow label="Desktop window" description="Omnix is optimized for a focused desktop workspace.">
                  <Badge variant="default">Desktop</Badge>
                </SettingRow>
              </div>
            </section>
          )}

          {activeCategory === "appearance" && (
            <section>
              <h2 className="text-[20px] font-semibold text-[var(--text-primary)] tracking-tight mb-1">
                Appearance
              </h2>
              <p className="text-[14px] text-[var(--text-secondary)] mb-8">
                Customize how Omnix looks and feels.
              </p>

              {/* Theme */}
              <div className="mb-8">
                <h3 className="text-[13px] font-semibold text-[var(--text-primary)] mb-1">
                  Theme
                </h3>
                <p className="text-[12px] text-[var(--text-secondary)] mb-4">
                  Choose between light, dark, or system-matched theme.
                </p>
                <div className="flex items-center gap-3">
                  <ThemeOption
                    value="light"
                    label="Light"
                    icon={Sun}
                    active={theme === "light"}
                    onClick={() => setTheme("light")}
                  />
                  <ThemeOption
                    value="dark"
                    label="Dark"
                    icon={Moon}
                    active={theme === "dark"}
                    onClick={() => setTheme("dark")}
                  />
                  <div className="relative">
                    <ThemeOption
                      value="light"
                      label="System"
                      icon={Monitor}
                      active={false}
                      onClick={() => {}}
                    />
                    <Badge
                      variant="default"
                      className="absolute -top-1 -right-1 text-[10px]"
                    >
                      Soon
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Other appearance settings */}
              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)]">
                <div className="px-4">
                  <SettingRow
                    label="Font size"
                    description="Adjust the text size across the application."
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="default">14px (Default)</Badge>
                      <Button variant="ghost" size="sm" disabled>
                        Change
                      </Button>
                    </div>
                  </SettingRow>
                  <SettingRow
                    label="Sidebar width"
                    description="Customize the width of the navigation sidebar."
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="default">220px</Badge>
                      <Button variant="ghost" size="sm" disabled>
                        Change
                      </Button>
                    </div>
                  </SettingRow>
                  <SettingRow
                    label="Reduced motion"
                    description="Disable animations for accessibility."
                  >
                    <Badge variant="default">System</Badge>
                  </SettingRow>
                </div>
              </div>
            </section>
          )}

          {/* ── Keyboard Shortcuts ── */}
          {activeCategory === "shortcuts" && (
            <section>
              <h2 className="text-[20px] font-semibold text-[var(--text-primary)] tracking-tight mb-1">
                Keyboard Shortcuts
              </h2>
              <p className="text-[14px] text-[var(--text-secondary)] mb-8">
                Global keyboard shortcuts available across the application.
              </p>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4">
                {[
                  { action: "Open command palette", shortcut: "Ctrl+K / ⌘K" },
                  { action: "Go to Home", shortcut: "Ctrl+1" },
                  { action: "Go to Search", shortcut: "Ctrl+2" },
                  { action: "Go to Chat", shortcut: "Ctrl+3" },
                  { action: "Toggle sidebar", shortcut: "Ctrl+B" },
                  { action: "Toggle theme", shortcut: "Ctrl+Shift+L" },
                  { action: "Open settings", shortcut: "Ctrl+," },
                  { action: "New conversation", shortcut: "Ctrl+N" },
                ].map((item) => (
                  <ShortcutRow
                    key={item.action}
                    action={item.action}
                    shortcut={item.shortcut}
                  />
                ))}
              </div>
              <p className="text-[12px] text-[var(--text-secondary)] mt-4">
                Customizable key bindings will be available in a future sprint.
              </p>
            </section>
          )}

          {/* ── Privacy ── */}
          {activeCategory === "privacy" && (
            <section>
              <h2 className="text-[20px] font-semibold text-[var(--text-primary)] tracking-tight mb-1">
                Privacy & Data
              </h2>
              <p className="text-[14px] text-[var(--text-secondary)] mb-8">
                Omnix processes all data locally. Nothing is sent to external servers without your consent.
              </p>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4">
                <SettingRow label="Local processing" description="All AI inference runs on your machine.">
                  <Badge variant="success">Always on</Badge>
                </SettingRow>
                <SettingRow label="Telemetry" description="Anonymous usage statistics to improve Omnix.">
                  <Badge variant="default">Off</Badge>
                </SettingRow>
                <SettingRow label="Crash reports" description="Send crash reports to help fix bugs.">
                  <Badge variant="default">Off</Badge>
                </SettingRow>
              </div>
              <div className={cn("mt-4 p-4 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)]")}>
                <div className="flex items-start gap-2">
                  <Shield size={15} className="text-[var(--text-secondary)] mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <p className="text-[12px] text-[var(--text-secondary)] leading-relaxed">
                    Your files are indexed and stored locally in an encrypted SQLite database.
                    Omnix never uploads your files or documents to any cloud service.
                    See <span className="text-accent font-medium">Privacy.md</span> for full details.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ── About ── */}
          {activeCategory === "about" && (
            <section>
              <h2 className="text-[20px] font-semibold text-[var(--text-primary)] tracking-tight mb-1">
                About Omnix
              </h2>
              <p className="text-[14px] text-[var(--text-secondary)] mb-8">
                Version information and acknowledgements.
              </p>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] px-4">
                <SettingRow label="Version">
                  <Badge variant="accent">v0.1.0-sprint-1</Badge>
                </SettingRow>
                <SettingRow label="Build">
                  <span className="text-[12px] font-mono text-[var(--text-secondary)]">Sprint 1.1</span>
                </SettingRow>
                <SettingRow label="License">
                  <span className="text-[12px] text-[var(--text-secondary)]">MIT</span>
                </SettingRow>
                <SettingRow label="Tech Stack">
                  <div className="flex gap-1 flex-wrap justify-end">
                    {["Tauri", "React", "TypeScript", "Tailwind"].map((t) => (
                      <Badge key={t} variant="default">{t}</Badge>
                    ))}
                  </div>
                </SettingRow>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" size="sm" rightIcon={<ChevronRight size={13} strokeWidth={2} />}>
                  View on GitHub
                </Button>
                <Button variant="secondary" size="sm" rightIcon={<ChevronRight size={13} strokeWidth={2} />}>
                  Read docs
                </Button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
