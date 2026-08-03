import React, { useState } from "react";
import { MessageSquare, Search, Clock, Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
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
    <div className="page-content">
      {/* ── Page Header ── */}
      <div className="mb-6">
        <SectionHeader
          level="h1"
          title="History"
          description="Your past conversations, searches, and actions."
          action={
            <Badge variant="default">
              <Clock size={11} className="mr-1" strokeWidth={2} />
              Workspace activity
            </Badge>
          }
        />
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
      <Card padding="none">
        <EmptyState
          icon={<Clock size={18} strokeWidth={1.5} />}
          title="No history yet"
          description="Your workspace activity will appear here as you search and navigate Omnix."
          action={<Button variant="secondary" size="sm">Learn about History</Button>}
        />
      </Card>

      {/* ── What This Will Show ── */}
      <div className="mt-6">
        <p className="text-[12px] font-medium text-[var(--text-disabled)] uppercase tracking-wider mb-3">
          Future activity preview
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
