"use client";

import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Badge, JobStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Users,
  Clock,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";

const JOBS = [
  {
    id:          "1",
    title:       "Senior React Developer",
    department:  "Engineering",
    status:      "open",
    headcount:   2,
    candidates:  34,
    newThisWeek: 5,
    daysOpen:    14,
    stages: [
      { name: "Applied",   count: 12, color: "#6366f1" },
      { name: "Screening", count: 8,  color: "#8b5cf6" },
      { name: "Technical", count: 6,  color: "#0ea5e9" },
      { name: "Final",     count: 5,  color: "#f59e0b" },
      { name: "Offer",     count: 3,  color: "#10b981" },
    ],
    updatedAt: "2h ago",
  },
  {
    id:          "2",
    title:       "Backend Engineer",
    department:  "Engineering",
    status:      "open",
    headcount:   1,
    candidates:  28,
    newThisWeek: 3,
    daysOpen:    21,
    stages: [
      { name: "Applied",   count: 10, color: "#6366f1" },
      { name: "Screening", count: 7,  color: "#8b5cf6" },
      { name: "Technical", count: 5,  color: "#0ea5e9" },
      { name: "Final",     count: 4,  color: "#f59e0b" },
      { name: "Offer",     count: 2,  color: "#10b981" },
    ],
    updatedAt: "5h ago",
  },
  {
    id:          "3",
    title:       "Product Designer",
    department:  "Design",
    status:      "open",
    headcount:   1,
    candidates:  21,
    newThisWeek: 2,
    daysOpen:    10,
    stages: [
      { name: "Applied",   count: 8, color: "#6366f1" },
      { name: "Screening", count: 5, color: "#8b5cf6" },
      { name: "Portfolio", count: 4, color: "#0ea5e9" },
      { name: "Final",     count: 3, color: "#f59e0b" },
      { name: "Offer",     count: 1, color: "#10b981" },
    ],
    updatedAt: "1d ago",
  },
  {
    id:          "4",
    title:       "DevOps Engineer",
    department:  "Infrastructure",
    status:      "open",
    headcount:   1,
    candidates:  15,
    newThisWeek: 1,
    daysOpen:    30,
    stages: [
      { name: "Applied",   count: 6, color: "#6366f1" },
      { name: "Screening", count: 4, color: "#8b5cf6" },
      { name: "Technical", count: 3, color: "#0ea5e9" },
      { name: "Final",     count: 2, color: "#f59e0b" },
    ],
    updatedAt: "3d ago",
  },
  {
    id:          "5",
    title:       "QA Automation Engineer",
    department:  "Engineering",
    status:      "on_hold",
    headcount:   1,
    candidates:  9,
    newThisWeek: 0,
    daysOpen:    45,
    stages: [
      { name: "Applied",   count: 5, color: "#6366f1" },
      { name: "Screening", count: 3, color: "#8b5cf6" },
      { name: "Technical", count: 1, color: "#0ea5e9" },
    ],
    updatedAt: "1w ago",
  },
  {
    id:          "6",
    title:       "Fullstack Developer",
    department:  "Engineering",
    status:      "draft",
    headcount:   2,
    candidates:  0,
    newThisWeek: 0,
    daysOpen:    2,
    stages:      [],
    updatedAt:   "2d ago",
  },
  {
    id:          "7",
    title:       "Operations Analyst",
    department:  "Operations",
    status:      "filled",
    headcount:   1,
    candidates:  42,
    newThisWeek: 0,
    daysOpen:    60,
    stages: [
      { name: "Hired", count: 1, color: "#10b981" },
    ],
    updatedAt: "2w ago",
  },
  {
    id:          "8",
    title:       "Growth Marketer",
    department:  "Marketing",
    status:      "open",
    headcount:   1,
    candidates:  19,
    newThisWeek: 4,
    daysOpen:    7,
    stages: [
      { name: "Applied",   count: 10, color: "#6366f1" },
      { name: "Screening", count: 5,  color: "#8b5cf6" },
      { name: "Final",     count: 4,  color: "#f59e0b" },
    ],
    updatedAt: "6h ago",
  },
];

const STATUS_FILTERS = ["All", "Open", "Draft", "On Hold", "Filled", "Closed"];

export default function JobsPage() {
  const openCount       = JOBS.filter((j) => j.status === "open").length;
  const totalCandidates = JOBS.reduce((s, j) => s + j.candidates, 0);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Jobs"
        subtitle={`${openCount} open positions | ${totalCandidates} total candidates`}
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Create Job
            </Button>
          </>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Toolbar */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-foreground-subtle)]" />
            <Input className="pl-9" placeholder="Search jobs..." />
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  f === "All"
                    ? "bg-[var(--color-primary)] text-white shadow-sm"
                    : "text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-surface-elevated)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
          <Badge variant="default">Hiring Sprint: Week 12</Badge>
          <Badge variant="success">{openCount} active requisitions</Badge>
          <span className="text-xs text-[var(--color-foreground-subtle)]">
            Last synced with Greenhouse: 10:08 AM
          </span>
        </div>

        {/* Jobs grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {JOBS.map((job) => {
            const totalInPipeline = job.stages.reduce((s, st) => s + st.count, 0);
            return (
              <Link key={job.id} href={`/jobs/${job.id}`} className="block">
                <Card hover padding="none" className="flex h-full flex-col overflow-hidden">
                  {/* Gradient top stripe */}
                  <div className="h-[3px] w-full bg-linear-to-r from-indigo-500 via-violet-500 to-blue-500" />

                  <div className="flex flex-1 flex-col gap-3 p-4">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                          <JobStatusBadge status={job.status} />
                          {job.newThisWeek > 0 && (
                            <Badge variant="info">+{job.newThisWeek} new</Badge>
                          )}
                        </div>
                        <h3 className="text-sm font-semibold leading-snug text-[var(--color-foreground)] line-clamp-2">
                          {job.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-[var(--color-foreground-subtle)]">
                          {job.department} | {job.headcount} headcount
                        </p>
                      </div>
                      <button
                        onClick={(e) => e.preventDefault()}
                        className="shrink-0 rounded-lg p-1 text-[var(--color-foreground-subtle)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)] transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Pipeline bar */}
                    {totalInPipeline > 0 && (
                      <div>
                        <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
                          {job.stages.map((stage) => (
                            <div
                              key={stage.name}
                              className="rounded-full transition-all"
                              style={{
                                width: `${(stage.count / totalInPipeline) * 100}%`,
                                backgroundColor: stage.color,
                              }}
                              title={`${stage.name}: ${stage.count}`}
                            />
                          ))}
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
                          {job.stages.map((stage) => (
                            <span
                              key={stage.name}
                              className="flex items-center gap-1 text-[10px] text-[var(--color-foreground-subtle)]"
                            >
                              <span
                                className="h-1.5 w-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: stage.color }}
                              />
                              {stage.name} {stage.count}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-[var(--color-foreground-subtle)]">
                          <Users className="h-3.5 w-3.5" />
                          {job.candidates}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[var(--color-foreground-subtle)]">
                          <Clock className="h-3.5 w-3.5" />
                          {job.daysOpen}d
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="flex items-center justify-end gap-0.5 text-xs text-[var(--color-primary)]">
                          Pipeline <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                        <p className="mt-0.5 text-[10px] text-[var(--color-foreground-subtle)]">
                          Updated {job.updatedAt}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}

          {/* Add new job CTA */}
          <button className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border)] text-[var(--color-foreground-subtle)] transition-all hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-primary)]/5 hover:text-[var(--color-primary)]">
            <Plus className="h-6 w-6" />
            <span className="text-sm font-medium">Create New Job</span>
          </button>
        </div>
      </div>
    </div>
  );
}

