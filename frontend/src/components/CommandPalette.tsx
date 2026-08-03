import React, { useEffect, useMemo, useRef, useState } from "react";
import { Command, Search } from "lucide-react";
import { Kbd } from "@/components/ui/Kbd";
import { cn } from "@/utils/cn";

export interface CommandPaletteItem {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ElementType;
  onSelect: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: CommandPaletteItem[];
}

export function CommandPalette({ open, onClose, commands }: CommandPaletteProps): React.ReactElement | null {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return commands;
    return commands.filter((command) => command.label.toLowerCase().includes(normalizedQuery));
  }, [commands, query]);

  useEffect(() => {
    if (!open) return;

    setQuery("");
    setActiveIndex(0);
    requestAnimationFrame(() => inputRef.current?.focus());

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (activeIndex >= matches.length) setActiveIndex(0);
  }, [activeIndex, matches.length]);

  if (!open) return null;

  const execute = (command: CommandPaletteItem | undefined) => {
    if (!command) return;
    command.onSelect();
    onClose();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!matches.length) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % matches.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + matches.length) % matches.length);
    }
    if (event.key === "Enter") {
      event.preventDefault();
      execute(matches[activeIndex]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-[var(--bg-overlay)] px-4 pt-[12vh]" role="presentation">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Close command palette" />
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] shadow-[var(--shadow-lg)] animate-[dialog-enter_160ms_ease-out]"
      >
        <div className="flex h-12 items-center gap-3 border-b border-[var(--border)] px-4">
          <Search size={17} className="shrink-0 text-[var(--text-secondary)]" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls="command-list"
            aria-activedescendant={matches[activeIndex] ? `command-${matches[activeIndex].id}` : undefined}
            placeholder="Type a command or search..."
            className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-disabled)] focus:outline-none"
          />
          <Kbd>Esc</Kbd>
        </div>

        <div id="command-list" role="listbox" aria-label="Available commands" className="p-2">
          <p className="px-2 pb-1 pt-1 text-[11px] font-medium uppercase tracking-wider text-[var(--text-disabled)]">
            Navigation
          </p>
          {matches.length ? (
            matches.map((command, index) => {
              const Icon = command.icon;
              const active = index === activeIndex;
              return (
                <button
                  key={command.id}
                  id={`command-${command.id}`}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onMouseMove={() => setActiveIndex(index)}
                  onClick={() => execute(command)}
                  className={cn(
                    "flex h-10 w-full items-center gap-3 rounded-md px-2 text-left transition-colors duration-[100ms] focus:outline-none",
                    active ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                  )}
                >
                  <Icon size={16} strokeWidth={2} aria-hidden="true" />
                  <span className="flex-1 text-[13px] font-medium">{command.label}</span>
                  {command.shortcut && <Kbd>{command.shortcut}</Kbd>}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-8 text-center text-[13px] text-[var(--text-secondary)]">
              No matching commands.
            </div>
          )}
        </div>

        <footer className="flex items-center gap-3 border-t border-[var(--border)] px-4 py-2 text-[11px] text-[var(--text-disabled)]">
          <span className="inline-flex items-center gap-1"><Kbd>↑</Kbd><Kbd>↓</Kbd> to navigate</span>
          <span className="inline-flex items-center gap-1"><Kbd>↵</Kbd> to select</span>
          <span className="ml-auto inline-flex items-center gap-1"><Command size={11} aria-hidden="true" /> Omnix</span>
        </footer>
      </section>
    </div>
  );
}
