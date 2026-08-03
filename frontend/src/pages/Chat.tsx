import React, { useState } from "react";
import {
  MessageSquare,
  Plus,
  Send,
  Bot,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/utils/cn";


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Chat(): React.ReactElement {
  const [inputValue, setInputValue] = useState("");
  const [activeConversation] = useState<string | null>(null);

  return (
    <div className="flex h-full">
      {/* ── Conversation List (Left Panel) ── */}
      <div
        className={cn(
          "flex flex-col w-64 flex-shrink-0 h-full",
          "border-r border-[var(--border)]",
          "bg-[var(--bg-secondary)]"
        )}
      >
        <div className="flex items-center justify-between px-3 py-3 border-b border-[var(--border)]">
          <h2 className="text-[13px] font-semibold text-[var(--text-primary)]">
            Conversations
          </h2>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Plus size={14} strokeWidth={2} />}
            aria-label="New conversation"
          >
            New
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {/* Empty state */}
          <div className="flex flex-col items-center justify-center h-full py-8 px-4 text-center">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--bg-tertiary)] mb-3">
              <MessageSquare
                size={16}
                className="text-[var(--text-disabled)]"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-[12px] font-medium text-[var(--text-secondary)] mb-1">
              No conversations yet
            </p>
            <p className="text-[11px] text-[var(--text-disabled)]">
              Start a new chat to begin.
            </p>
          </div>
        </div>
      </div>

      {/* ── Chat Area (Right Panel) ── */}
      <div className="flex flex-col flex-1 h-full">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] flex-shrink-0">
          <div className="flex items-center gap-2">
            <h1 className="text-[15px] font-semibold text-[var(--text-primary)]">
              {activeConversation ?? "New Chat"}
            </h1>
          </div>
          <Badge variant="default">
            <Sparkles size={11} className="mr-1" strokeWidth={2} />
            Conversation workspace
          </Badge>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Welcome / Empty State */}
          <div className="flex flex-col items-center justify-center h-full text-center max-w-[400px] mx-auto">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--accent-muted)] dark:bg-[var(--accent-muted-dark)] mb-4">
              <Bot
                size={22}
                className="text-accent dark:text-blue-400"
                strokeWidth={1.5}
              />
            </div>
            <h2 className="text-[16px] font-semibold text-[var(--text-primary)] mb-2">
              Ask Omnix anything
            </h2>
            <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
              Start with a prompt below. Connected workspace responses will appear
              here when they are available.
            </p>

            {/* Suggestion Pills */}
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {[
                "Summarize my recent documents",
                "Find files about Q3 planning",
                "What did I work on last week?",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInputValue(suggestion)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-[12px] font-medium",
                    "border border-[var(--border)]",
                    "text-[var(--text-secondary)]",
                    "hover:border-[var(--border-strong)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]",
                    "transition-colors duration-[100ms] ease-out",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1"
                  )}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Message Input */}
        <div className="px-6 py-4 border-t border-[var(--border)] flex-shrink-0">
          <div
            className={cn(
              "flex items-end gap-2",
              "rounded-lg border border-[var(--border)]",
              "bg-[var(--bg-primary)]",
              "px-3 py-2",
              "focus-within:border-accent focus-within:ring-1 focus-within:ring-accent/20",
              "transition-colors duration-[100ms] ease-out"
            )}
          >
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Omnix anything..."
              rows={1}
              aria-label="Chat message input"
              className={cn(
                "flex-1 bg-transparent resize-none",
                "text-[14px] text-[var(--text-primary)]",
                "placeholder:text-[var(--text-disabled)]",
                "focus:outline-none",
                "min-h-[24px] max-h-[120px]",
                "leading-6 pt-0.5"
              )}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  // Message delivery is not connected in this desktop shell.
                }
              }}
            />
            <Button
              variant="primary"
              size="sm"
              aria-label="Send message"
              disabled={!inputValue.trim()}
              leftIcon={<Send size={14} strokeWidth={2} />}
            />
          </div>
          <p className="text-[11px] text-[var(--text-disabled)] mt-2 text-center">
            Enter submits a message when connected. Shift+Enter adds a new line.
          </p>
        </div>
      </div>
    </div>
  );
}
