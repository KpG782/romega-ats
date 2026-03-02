import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-indigo-500/12 text-indigo-400 border-indigo-500/20",
    success: "bg-emerald-500/12 text-emerald-400 border-emerald-500/20",
    warning: "bg-yellow-500/12 text-yellow-400 border-yellow-500/20",
    danger:  "bg-red-500/12 text-red-400 border-red-500/20",
    info:    "bg-blue-500/12 text-blue-400 border-blue-500/20",
    outline: "bg-transparent text-[var(--color-foreground-muted)] border-[var(--color-border)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium leading-none",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export function JobStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; variant: BadgeProps["variant"] }> = {
    open:    { label: "Open",    variant: "success" },
    draft:   { label: "Draft",   variant: "outline" },
    on_hold: { label: "On Hold", variant: "warning" },
    closed:  { label: "Closed",  variant: "danger"  },
    filled:  { label: "Filled",  variant: "default" },
  };
  const config = map[status] ?? { label: status, variant: "outline" };
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function ScoreBadge({ score }: { score: number }) {
  const variant =
    score >= 80 ? "success" :
    score >= 60 ? "default" :
    score >= 40 ? "warning" : "danger";
  return <Badge variant={variant}>{score}%</Badge>;
}
