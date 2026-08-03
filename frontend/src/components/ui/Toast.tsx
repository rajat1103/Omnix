import React from "react";
import { CheckCircle2, Info, TriangleAlert, X } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/utils/cn";

type ToastTone = "info" | "success" | "warning";

interface ToastProps {
  title: string;
  description?: string;
  tone?: ToastTone;
  onDismiss?: () => void;
}

const toastIcons: Record<ToastTone, React.ReactNode> = {
  info: <Info size={16} aria-hidden="true" />,
  success: <CheckCircle2 size={16} aria-hidden="true" />,
  warning: <TriangleAlert size={16} aria-hidden="true" />,
};

const toneStyles: Record<ToastTone, string> = {
  info: "text-accent",
  success: "text-[var(--success)]",
  warning: "text-[var(--warning)]",
};

export function Toast({ title, description, tone = "info", onDismiss }: ToastProps): React.ReactElement {
  return (
    <div role="status" className="flex w-80 items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] p-3 shadow-[var(--shadow-md)] animate-[toast-enter_160ms_ease-out]">
      <span className={cn("mt-0.5 shrink-0", toneStyles[tone])}>{toastIcons[tone]}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-[var(--text-primary)]">{title}</p>
        {description && <p className="mt-0.5 text-[12px] leading-5 text-[var(--text-secondary)]">{description}</p>}
      </div>
      {onDismiss && (
        <IconButton size="sm" onClick={onDismiss} aria-label="Dismiss notification" className="-mr-1 -mt-1">
          <X size={14} aria-hidden="true" />
        </IconButton>
      )}
    </div>
  );
}
