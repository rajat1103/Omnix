import React from "react";
import {
  Search,
  MessageSquare,
  FileText,
  Zap,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";

// ─── Quick Action Item ────────────────────────────────────────────────────────

interface QuickActionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  badge?: string;
  onClick: () => void;
}

function QuickAction({
  icon: Icon,
  title,
  description,
  badge,
  onClick,
}: QuickActionProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col gap-3 p-4 text-left w-full",
        "rounded-lg border border-[var(--border)]",
        "bg-[var(--bg-primary)]",
        "hover:border-[var(--border-strong)] hover:shadow-sm",
        "transition-all duration-[100ms] ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
        "group"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)] group-hover:text-accent transition-colors duration-[100ms]">
          <Icon size={16} strokeWidth={2} />
        </div>
        {badge && <Badge variant="accent">{badge}</Badge>}
      </div>
      <div>
        <p className="text-[14px] font-semibold text-[var(--text-primary)]">{title}</p>
        <p className="text-[13px] text-[var(--text-secondary)] mt-0.5">{description}</p>
      </div>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home(): React.ReactElement {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-[860px] mx-auto">
      {/* ── Page Header ── */}
      <div className="mb-8">
        <h1 className="text-[24px] font-semibold text-[var(--text-primary)] tracking-tight">
          Good morning
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-1">
          Omnix is ready. Your files and knowledge are at your fingertips.
        </p>
      </div>

      {/* ── Status Banner ── */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-3 mb-8",
          "rounded-lg border border-[var(--border)]",
          "bg-[var(--bg-secondary)]"
        )}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--accent-muted)] dark:bg-[var(--accent-muted-dark)]">
          <Zap size={15} className="text-accent dark:text-blue-400" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-medium text-[var(--text-primary)]">
            Sprint 1.1 — Desktop Foundation
          </p>
          <p className="text-[12px] text-[var(--text-secondary)]">
            Shell complete. Backend and AI capabilities coming in Sprint 2+.
          </p>
        </div>
        <Badge variant="accent">In Progress</Badge>
      </div>

      {/* ── Quick Actions ── */}
      <section className="mb-8" aria-labelledby="quick-actions-heading">
        <div className="flex items-center justify-between mb-4">
          <h2 id="quick-actions-heading" className="text-[14px] font-semibold text-[var(--text-primary)]">
            Quick Actions
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <QuickAction
            icon={Search}
            title="Search Files"
            description="Find anything across your indexed documents."
            badge="Coming soon"
            onClick={() => navigate("/search")}
          />
          <QuickAction
            icon={MessageSquare}
            title="Start Chat"
            description="Ask Omnix anything about your files."
            badge="Coming soon"
            onClick={() => navigate("/chat")}
          />
          <QuickAction
            icon={FileText}
            title="Browse History"
            description="Review past conversations and searches."
            badge="Coming soon"
            onClick={() => navigate("/history")}
          />
        </div>
      </section>

      {/* ── Recent Activity ── */}
      <section aria-labelledby="recent-activity-heading">
        <div className="flex items-center justify-between mb-3">
          <h2 id="recent-activity-heading" className="text-[14px] font-semibold text-[var(--text-primary)]">
            Recent Activity
          </h2>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ArrowRight size={13} strokeWidth={2} />}
            onClick={() => navigate("/history")}
          >
            View all
          </Button>
        </div>

        <div
          className={cn(
            "rounded-lg border border-[var(--border)]",
            "bg-[var(--bg-primary)] overflow-hidden"
          )}
        >
          {/* Empty state */}
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] mb-3">
              <Clock size={18} className="text-[var(--text-disabled)]" strokeWidth={1.5} />
            </div>
            <p className="text-[13px] font-medium text-[var(--text-primary)] mb-1">
              No recent activity
            </p>
            <p className="text-[12px] text-[var(--text-secondary)] max-w-[280px]">
              Your recent searches, chats, and actions will appear here once you start using Omnix.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
