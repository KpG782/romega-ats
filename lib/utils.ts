import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diff = now.getTime() - then.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return formatDate(date);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function scoreToColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

export function scoreToLabel(score: number): string {
  if (score >= 80) return "Strong Match";
  if (score >= 60) return "Good Match";
  if (score >= 40) return "Partial Match";
  return "Low Match";
}

export const JOB_STATUS_COLORS: Record<string, string> = {
  open: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  draft: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  on_hold: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  closed: "bg-red-500/15 text-red-400 border-red-500/20",
  filled: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
};

export const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-500/15 text-purple-400",
  hr: "bg-blue-500/15 text-blue-400",
  hiring_manager: "bg-indigo-500/15 text-indigo-400",
  interviewer: "bg-teal-500/15 text-teal-400",
};
