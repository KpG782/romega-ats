import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils";
import {
  Users,
  Briefcase,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Circle,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

// Data

const stats = [
  {
    label:  "Active Jobs",
    value:  "8",
    change: "+2 this week",
    trend:  "up",
    icon:   Briefcase,
    color:  "text-indigo-400",
    iconBg: "bg-indigo-500/15",
    accent: "#6366f1",
  },
  {
    label:  "Total Candidates",
    value:  "142",
    change: "+18 this week",
    trend:  "up",
    icon:   Users,
    color:  "text-violet-400",
    iconBg: "bg-violet-500/15",
    accent: "#8b5cf6",
  },
  {
    label:  "Avg. Time to Hire",
    value:  "18d",
    change: "-3d vs last month",
    trend:  "down",
    icon:   Clock,
    color:  "text-emerald-400",
    iconBg: "bg-emerald-500/15",
    accent: "#10b981",
  },
  {
    label:  "Pipeline Conversion",
    value:  "24%",
    change: "+4% vs last month",
    trend:  "up",
    icon:   TrendingUp,
    color:  "text-sky-400",
    iconBg: "bg-sky-500/15",
    accent: "#0ea5e9",
  },
];

const recentActivity = [
  {
    id:        "1",
    candidate: "Maria Santos",
    action:    "moved to Technical Interview",
    job:       "Senior React Developer",
    actor:     "Jess Reyes",
    time:      new Date(Date.now() - 1000 * 60 * 12),
    type:      "stage",
  },
  {
    id:        "2",
    candidate: "Carlo Mendoza",
    action:    "submitted scorecard",
    job:       "Backend Engineer",
    actor:     "Mark Cruz",
    time:      new Date(Date.now() - 1000 * 60 * 45),
    type:      "scorecard",
  },
  {
    id:        "3",
    candidate: "Lyn Bautista",
    action:    "AI resume parsed",
    job:       "Product Designer",
    actor:     "System",
    time:      new Date(Date.now() - 1000 * 60 * 90),
    type:      "ai",
  },
  {
    id:        "4",
    candidate: "Ryan Torres",
    action:    "moved to Offer",
    job:       "DevOps Engineer",
    actor:     "Ken Garcia",
    time:      new Date(Date.now() - 1000 * 60 * 60 * 3),
    type:      "stage",
  },
  {
    id:        "5",
    candidate: "Anna Reyes",
    action:    "application received",
    job:       "Senior React Developer",
    actor:     "System",
    time:      new Date(Date.now() - 1000 * 60 * 60 * 5),
    type:      "applied",
  },
];

const topJobs = [
  {
    id:         "1",
    title:      "Senior React Developer",
    dept:       "Engineering",
    candidates: 34,
    stages: [
      { name: "Applied",   count: 12, color: "#6366f1" },
      { name: "Screening", count: 8,  color: "#8b5cf6" },
      { name: "Technical", count: 6,  color: "#0ea5e9" },
      { name: "Final",     count: 5,  color: "#f59e0b" },
      { name: "Offer",     count: 3,  color: "#10b981" },
    ],
  },
  {
    id:         "2",
    title:      "Backend Engineer",
    dept:       "Engineering",
    candidates: 28,
    stages: [
      { name: "Applied",   count: 10, color: "#6366f1" },
      { name: "Screening", count: 7,  color: "#8b5cf6" },
      { name: "Technical", count: 5,  color: "#0ea5e9" },
      { name: "Final",     count: 4,  color: "#f59e0b" },
      { name: "Offer",     count: 2,  color: "#10b981" },
    ],
  },
  {
    id:         "3",
    title:      "Product Designer",
    dept:       "Design",
    candidates: 21,
    stages: [
      { name: "Applied",   count: 8,  color: "#6366f1" },
      { name: "Screening", count: 5,  color: "#8b5cf6" },
      { name: "Portfolio", count: 4,  color: "#0ea5e9" },
      { name: "Final",     count: 3,  color: "#f59e0b" },
      { name: "Offer",     count: 1,  color: "#10b981" },
    ],
  },
];

const aiQueue = [
  { id: "1", candidate: "James Lim",     job: "Senior React Developer", score: 87,   status: "done"       },
  { id: "2", candidate: "Sofia Cruz",    job: "Backend Engineer",        score: 72,   status: "done"       },
  { id: "3", candidate: "Paolo Tan",     job: "DevOps Engineer",         score: null, status: "processing" },
  { id: "4", candidate: "Mia Dela Cruz", job: "Product Designer",        score: null, status: "queued"     },
];

// Sub-components

function ActivityIcon({ type }: { type: string }) {
  const cls = "h-3 w-3";
  if (type === "stage")     return <Circle       className={`${cls} text-indigo-400`} />;
  if (type === "scorecard") return <CheckCircle2 className={`${cls} text-emerald-400`} />;
  if (type === "ai")        return <Sparkles     className={`${cls} text-violet-400`} />;
  if (type === "applied")   return <AlertCircle  className={`${cls} text-sky-400`} />;
  return                           <Circle       className={`${cls} text-foreground-subtle`} />;
}

// Page

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Dashboard"
        subtitle="Welcome back, Ken - here's what's happening"
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Job
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        <div className="p-10 space-y-10">
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3">
            <Badge variant="info">Pipeline health: Good</Badge>
            <Badge variant="default">Response SLA: 92%</Badge>
            <span className="text-xs text-foreground-subtle">
              Last analytics refresh: 9:55 AM
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 2xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const TrendIcon = stat.trend === "down" ? ArrowDownRight : ArrowUpRight;
              return (
                <div
                  key={stat.label}
                  className="relative overflow-hidden rounded-2xl border border-border p-6"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--card)) 0%, color-mix(in srgb, ${stat.accent} 9%, hsl(var(--card))) 100%)`,
                    boxShadow: "var(--shadow-card)",
                  }}
                >
                  {/* Accent top bar */}
                  <div
                    className="absolute inset-x-0 top-0 h-0.75 rounded-t-xl"
                    style={{ backgroundColor: stat.accent }}
                  />
                  {/* Radial glow blob */}
                  <div
                    className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-15 blur-2xl"
                    style={{ backgroundColor: stat.accent }}
                  />

                  <div className="flex items-start justify-between gap-4 pt-1">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold uppercase tracking-wider text-foreground-subtle">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-4xl xl:text-5xl font-bold tabular-nums leading-none tracking-tight text-foreground">
                        {stat.value}
                      </p>
                      <div
                        className="mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold"
                        style={{ backgroundColor: `${stat.accent}20`, color: stat.accent }}
                      >
                        <TrendIcon className="h-3 w-3 shrink-0" />
                        {stat.change}
                      </div>
                    </div>
                    <div className={`shrink-0 rounded-xl p-3 ${stat.iconBg}`}>
                      <Icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 gap-7 xl:grid-cols-12">

            {/* Left / center */}
            <div className="space-y-7 xl:col-span-8 2xl:col-span-9">

              {/* Active pipelines */}
              <Card padding="none">
                <div className="flex items-center justify-between border-b border-border-subtle px-7 py-5">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Active Pipelines</h2>
                    <p className="mt-0.5 text-sm text-foreground-subtle">Candidate distribution by stage</p>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-sm">
                    View all <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="divide-y divide-border-subtle">
                  {topJobs.map((job) => {
                    const total = job.stages.reduce((s, st) => s + st.count, 0);
                    return (
                      <div key={job.id} className="group cursor-pointer px-7 py-5 transition-colors hover:bg-surface-hover">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-base font-semibold text-foreground group-hover:text-indigo-400 transition-colors truncate">
                              {job.title}
                            </span>
                            <span className="shrink-0 rounded-full border border-border-subtle bg-surface-elevated px-2 py-px text-sm font-medium text-foreground-subtle">
                              {job.dept}
                            </span>
                          </div>
                          <span className="shrink-0 text-sm tabular-nums text-foreground-subtle">
                            {total} candidates
                          </span>
                        </div>

                        {/* Pipeline bar */}
                        <div className="flex h-2 gap-px overflow-hidden rounded-full bg-border-subtle">
                          {job.stages.map((stage) => (
                            <div
                              key={stage.name}
                              style={{ width: `${(stage.count / total) * 100}%`, backgroundColor: stage.color }}
                              title={`${stage.name}: ${stage.count}`}
                            />
                          ))}
                        </div>

                        {/* Legend */}
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                          {job.stages.map((stage) => (
                            <div key={stage.name} className="flex items-center gap-1.5">
                              <div className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: stage.color }} />
                              <span className="text-sm text-foreground-subtle">
                                {stage.name} <span className="font-semibold text-foreground-muted">{stage.count}</span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* AI Processing Queue */}
              <Card padding="none">
                <div className="flex items-center justify-between border-b border-border-subtle px-7 py-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/15 ring-1 ring-violet-500/20">
                      <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">AI Processing Queue</h2>
                  </div>
                  <Badge variant="default">
                    {aiQueue.filter((i) => i.status === "processing").length} active
                  </Badge>
                </div>

                <div className="divide-y divide-border-subtle">
                  {aiQueue.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 px-7 py-5 transition-colors hover:bg-surface-hover">
                      <Avatar name={item.candidate} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-foreground truncate">{item.candidate}</p>
                        <p className="text-sm text-foreground-subtle truncate">{item.job}</p>
                      </div>
                      <div className="shrink-0">
                        {item.status === "done" && item.score !== null ? (
                          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold tabular-nums ring-1 ${
                            item.score >= 80
                              ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                              : item.score >= 60
                              ? "bg-amber-500/10 text-amber-400 ring-amber-500/20"
                              : "bg-red-500/10 text-red-400 ring-red-500/20"
                          }`}>
                            <Sparkles className="h-3 w-3 shrink-0" />
                            {item.score}%
                          </div>
                        ) : item.status === "processing" ? (
                          <div className="flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1.5 text-sm font-medium text-violet-400 ring-1 ring-violet-500/20">
                            <span className="h-3 w-3 shrink-0 animate-spin rounded-full border border-violet-400/30 border-t-violet-400" />
                            Scoring...
                          </div>
                        ) : (
                          <span className="rounded-full border border-border-subtle bg-surface-elevated px-2.5 py-1 text-sm text-foreground-subtle">
                            Queued
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right rail */}
            <Card padding="none" className="h-fit xl:col-span-4 2xl:col-span-3 min-w-0">
              <div className="flex items-center justify-between border-b border-border-subtle px-7 py-5">
                <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
                <Button variant="ghost" size="sm" className="text-sm gap-1.5">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="px-7 py-7">
                <div className="relative">
                  {/* Vertical connector */}
                  <div className="absolute left-1.75 top-2 bottom-2 w-px bg-border-subtle" />

                  <div className="space-y-6">
                    {recentActivity.map((item) => (
                      <div key={item.id} className="flex gap-3.5">
                        <div className="relative mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-border-subtle bg-surface-elevated z-10">
                          <ActivityIcon type={item.type} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm leading-6 text-foreground">
                            <span className="font-semibold">{item.candidate}</span>{" "}
                            <span className="text-foreground-muted">{item.action}</span>
                          </p>
                          <p className="mt-0.5 text-sm font-medium text-foreground-subtle truncate">
                            {item.job}
                          </p>
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <Avatar name={item.actor} size="xs" />
                            <span className="text-sm text-foreground-subtle">
                              {item.actor} | {formatRelativeTime(item.time)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}


