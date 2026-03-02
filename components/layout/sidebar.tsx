"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  BarChart3,
  Settings,
  Zap,
  Bell,
  Search,
  Building2,
  UserCheck,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Jobs", href: "/jobs", icon: Briefcase, badge: 8 },
  { label: "Candidates", href: "/candidates", icon: Users, badge: 142 },
  { label: "Talent Pool", href: "/talent-pool", icon: UserCheck },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

const secondaryNav = [
  { label: "Automations", href: "/automations", icon: Zap },
  { label: "Departments", href: "/departments", icon: Building2 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={cn(
        "relative flex h-screen shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-sidebar)] transition-all duration-200",
        collapsed ? "w-20" : "w-72"
      )}
    >
      <div className={cn("flex h-16 items-center border-b border-[var(--color-border)] px-4", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold leading-none text-[var(--color-foreground)]">Romega ATS</p>
            <p className="mt-0.5 text-xs text-[var(--color-foreground-subtle)]">Hiring Platform</p>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="rounded-md p-1.5 text-[var(--color-foreground-subtle)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <div className={cn("py-4", collapsed ? "px-2.5" : "px-4")}>
        <button
          className={cn(
            "flex w-full items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-xs text-[var(--color-foreground-subtle)] transition-all hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground-muted)]",
            collapsed ? "justify-center px-2 py-2.5" : "gap-2.5 px-3 py-2.5"
          )}
          title="Search"
        >
          <Search className="h-3.5 w-3.5 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-left">Search...</span>
              <kbd className="rounded-md bg-[var(--color-surface-elevated)] px-1.5 py-0.5 font-mono text-xs text-[var(--color-foreground-subtle)]">
                Ctrl+K
              </kbd>
            </>
          )}
        </button>
      </div>

      <nav className={cn("flex-1 overflow-y-auto py-2 no-scrollbar", collapsed ? "px-2" : "px-3")}>
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cn(
                  "relative flex items-center rounded-lg text-sm transition-all duration-150",
                  collapsed ? "justify-center px-2 py-2.5" : "gap-2.5 px-3 py-2.5",
                  active
                    ? "bg-[var(--color-primary-subtle)] text-[var(--color-foreground)] font-medium"
                    : "text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--color-primary)]" />
                )}

                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-[var(--color-primary)]" : "text-[var(--color-foreground-subtle)]"
                  )}
                />
                {!collapsed && <span className="flex-1">{item.label}</span>}

                {!collapsed && item.badge !== undefined && (
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums",
                      active
                        ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)]"
                        : "bg-[var(--color-surface-hover)] text-[var(--color-foreground-subtle)]"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="my-3 border-t border-[var(--color-border)]" />

        {!collapsed && (
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-[var(--color-foreground-subtle)]">
            Manage
          </p>
        )}

        <div className="space-y-1">
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                className={cn(
                  "relative flex items-center rounded-lg text-sm transition-all duration-150",
                  collapsed ? "justify-center px-2 py-2.5" : "gap-2.5 px-3 py-2.5",
                  active
                    ? "bg-[var(--color-primary-subtle)] text-[var(--color-foreground)] font-medium"
                    : "text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--color-primary)]" />
                )}
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-[var(--color-primary)]" : "text-[var(--color-foreground-subtle)]"
                  )}
                />
                {!collapsed && item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className={cn("space-y-2 border-t border-[var(--color-border)]", collapsed ? "p-2.5" : "p-4")}>
        <button
          className={cn(
            "flex w-full items-center rounded-lg px-2.5 py-2 text-xs text-[var(--color-foreground-muted)] transition-colors hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)]",
            collapsed ? "justify-center" : "gap-2.5"
          )}
          title="Notifications"
        >
          <Bell className="h-3.5 w-3.5 shrink-0" />
          {!collapsed && <span className="flex-1 text-left">Notifications</span>}
          {!collapsed && (
            <span className="flex h-4.5 min-w-[1.125rem] items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] font-bold text-white">
              3
            </span>
          )}
        </button>

        <button
          className={cn(
            "group flex w-full items-center rounded-lg p-2 transition-colors hover:bg-[var(--color-surface-elevated)]",
            collapsed ? "justify-center" : "gap-2.5"
          )}
          title="Account"
        >
          <Avatar name="Ken Garcia" size="sm" />
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate text-xs font-semibold text-[var(--color-foreground)]">Ken Garcia</p>
                <p className="truncate text-xs text-[var(--color-foreground-subtle)]">Admin</p>
              </div>
              <LogOut className="h-3.5 w-3.5 shrink-0 text-[var(--color-foreground-subtle)] opacity-0 transition-opacity group-hover:opacity-100" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
