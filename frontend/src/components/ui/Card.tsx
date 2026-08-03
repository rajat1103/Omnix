import React from "react";
import { cn } from "@/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles: Record<NonNullable<CardProps["padding"]>, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({ padding = "md", className, children, ...props }: CardProps): React.ReactElement {
  return (
    <div className={cn("surface-card", paddingStyles[padding], className)} {...props}>
      {children}
    </div>
  );
}
