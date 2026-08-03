import React from "react";
import { cn } from "@/utils/cn";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string;
  width?: string;
}

export function Skeleton({ height = "1rem", width = "100%", className, ...props }: SkeletonProps): React.ReactElement {
  return <div className={cn("skeleton", className)} style={{ height, width }} aria-hidden="true" {...props} />;
}
