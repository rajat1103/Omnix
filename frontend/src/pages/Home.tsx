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
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusBadge } from "@/components/ui/StatusBadge";
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
        "surface-card",
        "hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-md)]",
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
    <div className="page-content">
      {/* ── Page Header ── */}
      <div className="mb-8">
        <SectionHeader
          level="h1"
          title="Good morning"
          description="A focused place to navigate your workspace, conversations, and activity."
        />
      </div>

      {/* ── Status Banner ── */}
      <Card className="mb-8 flex items-center gap-3 bg-[var(--bg-secondary)]" padding="md">
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--accent-muted)] dark:bg-[var(--accent-muted-dark)]">
          <Zap size={15} className="text-accent dark:text-blue-400" strokeWidth={2.5} />
        </div>
        <div className="flex-1">
          <p className="text-[13px] font-medium text-[var(--text-primary)]">
            Your workspace is ready
          </p>
          <p className="text-[12px] text-[var(--text-secondary)]">
            Use navigation or the command palette to move quickly through Omnix.
          </p>
        </div>
        <StatusBadge status="success">Ready</StatusBadge>
      </Card>

      {/* ── Quick Actions ── */}
      <section className="mb-8" aria-label="Quick Actions">
        <div className="mb-4">
          <SectionHeader title="Quick Actions" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <QuickAction
            icon={Search}
            title="Search Files"
            description="Find anything across your indexed documents."
            onClick={() => navigate("/search")}
          />
          <QuickAction
            icon={MessageSquare}
            title="Start Chat"
            description="Ask Omnix anything about your files."
            onClick={() => navigate("/chat")}
          />
          <QuickAction
            icon={FileText}
            title="Browse History"
            description="Review past conversations and searches."
            onClick={() => navigate("/history")}
          />
        </div>
      </section>

      {/* ── Recent Activity ── */}
      <section aria-label="Recent Activity">
        <div className="mb-3">
          <SectionHeader
            title="Recent Activity"
            action={
              <Button
                variant="ghost"
                size="sm"
                rightIcon={<ArrowRight size={13} strokeWidth={2} />}
                onClick={() => navigate("/history")}
              >
                View all
              </Button>
            }
          />
        </div>

        <Card padding="none">
          <EmptyState
            icon={<Clock size={18} strokeWidth={1.5} />}
            title="No activity yet"
            description="Your searches, conversations, and workspace actions will appear here as you use Omnix."
          />
        </Card>
      </section>
    </div>
  );
}
