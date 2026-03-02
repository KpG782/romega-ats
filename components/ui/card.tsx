import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md";
}

export function Card({ className, hover, padding = "md", ...props }: CardProps) {
  const paddings = {
    none: "",
    sm:   "p-5",
    md:   "p-6",
  };
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface shadow-card",
        paddings[padding],
        hover &&
          "cursor-pointer transition-all duration-150 hover:border-primary/25 hover:bg-surface-elevated hover:-translate-y-px",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-border-subtle px-6 py-4.5",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-base font-semibold text-foreground", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-5", className)} {...props} />;
}
