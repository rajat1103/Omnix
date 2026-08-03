import React from "react";
import { User } from "lucide-react";
import { cn } from "@/utils/cn";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  size?: AvatarSize;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-8 w-8 text-[12px]",
  lg: "h-10 w-10 text-[14px]",
};

export function Avatar({ name, size = "md", className, ...props }: AvatarProps): React.ReactElement {
  const initials = name
    ?.split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--bg-tertiary)] font-medium text-[var(--text-secondary)]",
        sizeStyles[size],
        className
      )}
      aria-label={name ? `${name} avatar` : "User avatar"}
      {...props}
    >
      {initials ?? <User size={size === "lg" ? 18 : 15} strokeWidth={2} aria-hidden="true" />}
    </div>
  );
}
