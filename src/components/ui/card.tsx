import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

export function Card({ className, ...props }: ComponentProps<"section">) {
  return (
    <section
      className={cn("rounded-[var(--radius-card)] border bg-surface p-5 shadow-sm", className)}
      {...props}
    />
  );
}
