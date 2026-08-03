import React, { useState } from "react";
import { MessageSquare, Search, Clock, Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";

// ─── Tab ──────────────────────────────────────────────────────────────────────

type HistoryTab = "all" | "chats" | "searches";

interface TabProps {
  id: HistoryTab;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
}

function Tab({ id: _id, label, icon: Icon, active, onClick }: TabProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 h-8 rounded-md text-[13px] font-medium",
        "transition-colors duration-[100ms] ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
        active
          ? "bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
          : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
      )}
    >
      <Icon size={14} strokeWidth={2} />
      {label}
    </button>
  );
}

// ─── Timeline Section ─────────────────────────────────────────────────────────

function TimelineSection({ label }: { label: string }): React.ReactElement {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <Calendar size={12} className="text-[var(--text-disabled)]" strokeWidth={2} />
        <span className="text-[11px] font-medium text-[var(--text-disabled)] uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="flex-1 h-px bg-[var(--border)]" />
    </div>
  );
}

// ─── History Item ─────────────────────────────────────────────────────────────

interface HistoryItemProps {
  type: "chat" | "search";
  title: string;
  meta: string;
  time: string;
}

function HistoryItem({ type, title, meta, time }: HistoryItemProps): React.ReactElement {
  const Icon = type === "chat" ? MessageSquare : Search;

  return (
    <button
      className={cn(
        "flex items-center gap-3 w-full px-3 py-2.5 rounded-md text-left",
        "hover:bg-[var(--bg-secondary)]",
        "transition-colors duration-[100ms] ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
        "group"
      )}
    >
      <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[var(--bg-tertiary)] text-[var(--text-secondary)] flex-shrink-0">
        <Icon size={13} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-[var(--text-primary)] truncate">
          {title}
        </p>
        <p className="text-[12px] text-[var(--text-secondary)] truncate">{meta}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-[11px] text-[var(--text-disabled)]">{time}</span>
        <ChevronRight
          size={13}
          className="text-[var(--text-disabled)] opacity-0 group-hover:opacity-100 transition-opacity duration-[100ms]"
          strokeWidth={2}
        />
      </div>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function History(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<HistoryTab>("all");

  return (
    <div className="p-8 max-w-[860px] mx-auto">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-semibold text-[var(--text-primary)] tracking-tight">
            History
          </h1>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            Your past conversations, searches, and actions.
          </p>
        </div>
        <Badge variant="default">
          <Clock size={11} className="mr-1" strokeWidth={2} />
          Persistent in Sprint 7
        </Badge>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 mb-6 p-1 rounded-lg bg-[var(--bg-secondary)] w-fit">
        <Tab
          id="all"
          label="All"
          icon={Clock}
          active={activeTab === "all"}
          onClick={() => setActiveTab("all")}
        />
        <Tab
          id="chats"
          label="Chats"
          icon={MessageSquare}
          active={activeTab === "chats"}
          onClick={() => setActiveTab("chats")}
        />
        <Tab
          id="searches"
          label="Searches"
          icon={Search}
          active={activeTab === "searches"}
          onClick={() => setActiveTab("searches")}
        />
      </div>

      {/* ── Timeline ── */}
      <div
        className={cn(
          "rounded-lg border border-[var(--border)]",
          "bg-[var(--bg-primary)] overflow-hidden"
        )}
      >
        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] mb-3">
            <Clock
              size={18}
              className="text-[var(--text-disabled)]"
              strokeWidth={1.5}
            />
          </div>
          <p className="text-[13px] font-medium text-[var(--text-primary)] mb-1">
            No history yet
          </p>
          <p className="text-[12px] text-[var(--text-secondary)] max-w-[320px]">
            Your activity will be recorded here once conversations and searches are
            active in Sprint 7.
          </p>
          <Button variant="secondary" size="sm" className="mt-4">
            Learn about History
          </Button>
        </div>
      </div>

      {/* ── What This Will Show ── */}
      <div className="mt-6">
        <p className="text-[12px] font-medium text-[var(--text-disabled)] uppercase tracking-wider mb-3">
          Coming in Sprint 7
        </p>
        <div className="flex flex-col gap-1">
          <TimelineSection label="Today" />
          <div className="opacity-30 pointer-events-none">
            <HistoryItem
              type="chat"
              title="Explained the Q3 contract"
              meta="8 messages · 1.2k tokens"
              time="2h ago"
            />
            <HistoryItem
              type="search"
              title="invoices from last month"
              meta="14 results"
              time="3h ago"
            />
          </div>
          <TimelineSection label="Yesterday" />
          <div className="opacity-30 pointer-events-none">
            <HistoryItem
              type="chat"
              title="Summarized the project brief"
              meta="5 messages · 800 tokens"
              time="1d ago"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
