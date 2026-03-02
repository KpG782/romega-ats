"use client";

import { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

interface HeaderProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  actions?: ReactNode;
}

export function Header({ title, subtitle, breadcrumbs, actions }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-7">
      <div className="min-w-0 flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-1 flex items-center gap-1 text-xs text-foreground-subtle">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3 shrink-0" />}
                <span className={i === breadcrumbs.length - 1 ? "text-foreground-muted" : ""}>
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-[15px] font-semibold leading-none text-foreground truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 hidden text-xs text-foreground-subtle truncate sm:block">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
        {actions}
      </div>
    </header>
  );
}
