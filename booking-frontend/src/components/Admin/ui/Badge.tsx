import React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const variants: Record<string, string> = {
    default:
      "bg-primary text-primary-foreground border-transparent",
    secondary:
      "bg-secondary text-secondary-foreground border-transparent",
    destructive:
      "bg-destructive text-white border-transparent",
    outline:
      "text-foreground border border-foreground/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 overflow-hidden transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
