import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "accent" | "outline";

const variants: Record<Variant, string> = {
  default: "bg-primary/10 text-primary",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent/15 text-accent",
  outline: "border border-border text-muted-foreground",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
