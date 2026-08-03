import React, { useState } from "react";
import { Search as SearchIcon, FileText, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/utils/cn";

// ─── Filter Chip ──────────────────────────────────────────────────────────────

interface FilterChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterChip({ label, active, onClick }: FilterChipProps): React.ReactElement {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center px-3 h-7 rounded-full text-[12px] font-medium",
        "border transition-colors duration-[100ms] ease-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
        active
          ? "border-accent bg-[var(--accent-muted)] text-accent dark:bg-[var(--accent-muted-dark)] dark:text-blue-400"
          : "border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
      )}
    >
      {label}
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const FILTER_OPTIONS = ["All", "Documents", "Code", "PDFs", "Images", "Notes"];

export default function Search(): React.ReactElement {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const hasQuery = query.trim().length > 0;

  return (
    <div className="page-content">
      {/* ── Page Header ── */}
      <div className="mb-6">
        <SectionHeader
          level="h1"
          title="Search"
          description="Find anything across your indexed files and documents."
        />
      </div>

      {/* ── Search Input ── */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1">
          <Input
            placeholder="Type to search your files, documents, notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<SearchIcon size={15} strokeWidth={2} />}
            rightIcon={
              hasQuery ? (
                <button
                  onClick={() => setQuery("")}
                  className="hover:text-[var(--text-primary)] transition-colors"
                  aria-label="Clear search"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              ) : undefined
            }
            aria-label="Search files and documents"
          />
        </div>
        <Button
          variant="secondary"
          leftIcon={<SlidersHorizontal size={14} strokeWidth={2} />}
          aria-label="Search filters"
        >
          Filters
        </Button>
      </div>

      {/* ── Filter Chips ── */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {FILTER_OPTIONS.map((filter) => (
          <FilterChip
            key={filter}
            label={filter}
            active={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          />
        ))}
      </div>

      {/* ── Results / Empty State ── */}
      {hasQuery ? (
        <Card padding="none">
          <EmptyState
            icon={<SearchIcon size={18} className="text-accent" strokeWidth={1.5} />}
            title="Search results will appear here"
            description="Search is ready for an indexed workspace. Your selected query and filter are shown below."
            action={
              <div className="flex items-center gap-2">
                <Badge variant="default">Query: {query}</Badge>
                <Badge variant="default">Filter: {activeFilter}</Badge>
              </div>
            }
          />
        </Card>
      ) : (
        <Card padding="none" className="border-dashed shadow-none">
          <EmptyState
            icon={<FileText size={18} strokeWidth={1.5} />}
            title="Search your files"
            description="Type a query above to search across documents, notes, code, and more."
          />
        </Card>
      )}
    </div>
  );
}
