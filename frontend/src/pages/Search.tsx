import React, { useState } from "react";
import { Search as SearchIcon, FileText, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
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
    <div className="p-8 max-w-[860px] mx-auto">
      {/* ── Page Header ── */}
      <div className="mb-6">
        <h1 className="text-[24px] font-semibold text-[var(--text-primary)] tracking-tight">
          Search
        </h1>
        <p className="text-[14px] text-[var(--text-secondary)] mt-1">
          Find anything across your indexed files and documents.
        </p>
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
        <div
          className={cn(
            "rounded-lg border border-[var(--border)]",
            "bg-[var(--bg-primary)] overflow-hidden"
          )}
        >
          {/* Search in progress placeholder */}
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--accent-muted)] dark:bg-[var(--accent-muted-dark)] mb-3">
              <SearchIcon size={18} className="text-accent dark:text-blue-400" strokeWidth={1.5} />
            </div>
            <p className="text-[13px] font-medium text-[var(--text-primary)] mb-1">
              Semantic search coming in Sprint 4
            </p>
            <p className="text-[12px] text-[var(--text-secondary)] max-w-[320px]">
              Results will appear here once the backend and FAISS index are set up.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Badge variant="default">Query: {query}</Badge>
              <Badge variant="default">Filter: {activeFilter}</Badge>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "rounded-lg border border-dashed border-[var(--border)]",
            "bg-[var(--bg-primary)] overflow-hidden"
          )}
        >
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] mb-3">
              <FileText size={18} className="text-[var(--text-disabled)]" strokeWidth={1.5} />
            </div>
            <p className="text-[13px] font-medium text-[var(--text-primary)] mb-1">
              Search your files
            </p>
            <p className="text-[12px] text-[var(--text-secondary)] max-w-[300px]">
              Type a query above to search across documents, notes, code, and more.
              Natural language search available in Sprint 4.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
