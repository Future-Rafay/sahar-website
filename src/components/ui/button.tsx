import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-primary text-primary-foreground hover:brightness-95",
  secondary: "bg-secondary text-secondary-foreground hover:brightness-95",
  outline: "border bg-surface text-foreground hover:bg-background",
  ghost: "text-foreground hover:bg-background",
  destructive: "bg-destructive text-white hover:brightness-95",
} as const;

const sizes = {
  default: "min-h-11 px-5 py-2.5",
  compact: "min-h-11 px-3 py-2",
} as const;

type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function Button({
  className,
  type = "button",
  variant = "primary",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-control)] text-sm font-semibold transition-[background-color,filter,color] duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
