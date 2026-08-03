import React from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  level?: "h1" | "h2" | "h3";
}

export function SectionHeader({
  title,
  description,
  action,
  level = "h2",
}: SectionHeaderProps): React.ReactElement {
  const Heading = level;

  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Heading className={level === "h1" ? "text-heading-xl tracking-tight text-[var(--text-primary)]" : "text-heading-sm text-[var(--text-primary)]"}>
          {title}
        </Heading>
        {description && <p className="mt-1 text-body text-[var(--text-secondary)]">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
