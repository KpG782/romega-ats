import { Header } from "@/components/layout/header";
import { Badge, ScoreBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  Plus,
  Search,
  Filter,
  Upload,
  Sparkles,
  MoreHorizontal,
  Star,
  ChevronDown,
  SortAsc,
  Circle,
} from "lucide-react";

const CANDIDATES = [
  {
    id:           "1",
    name:         "Maria Santos",
    email:        "maria.santos@email.com",
    location:     "Makati, PH",
    appliedFor:   "Senior React Developer",
    score:        82,
    stage:        "Screening",
    stageColor:   "#8b5cf6",
    source:       "Referral",
    tags:         ["React", "TypeScript", "5 yrs"],
    rating:       4,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
    summary:
      "Strong React developer with fintech background. Excellent TypeScript and system design skills. Recommended for technical round.",
  },
  {
    id:           "2",
    name:         "James Lim",
    email:        "jameslim@gmail.com",
    location:     "BGC, Taguig",
    appliedFor:   "Senior React Developer",
    score:        88,
    stage:        "Technical",
    stageColor:   "#0ea5e9",
    source:       "Referral",
    tags:         ["React", "Next.js", "GraphQL", "6 yrs"],
    rating:       5,
    lastActivity: new Date(Date.now() - 1000 * 60 * 30),
    summary:
      "Top-tier candidate. Led frontend at two fintech startups. Strong system design. High recommendation.",
  },
  {
    id:           "3",
    name:         "Carlo Hernandez",
    email:        "carlo.h@outlook.com",
    location:     "Quezon City, PH",
    appliedFor:   "Backend Engineer",
    score:        67,
    stage:        "Applied",
    stageColor:   "#6366f1",
    source:       "Email",
    tags:         ["Node.js", "PostgreSQL", "3 yrs"],
    rating:       3,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 8),
    summary:      "Mid-level backend developer. Some gaps in distributed systems but strong fundamentals.",
  },
  {
    id:           "4",
    name:         "Anna Mendoza",
    email:        "anna.mendoza@email.com",
    location:     "Ortigas, PH",
    appliedFor:   "Senior React Developer",
    score:        90,
    stage:        "Offer",
    stageColor:   "#10b981",
    source:       "Referral",
    tags:         ["React", "TypeScript", "Node.js", "6 yrs"],
    rating:       5,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 1),
    summary:      "Exceptional candidate. Strong both FE and BE. Offer extended pending negotiation.",
  },
  {
    id:           "5",
    name:         "Ryan Torres",
    email:        "ryanT@proton.me",
    location:     "Pasig, PH",
    appliedFor:   "DevOps Engineer",
    score:        91,
    stage:        "Final Interview",
    stageColor:   "#f59e0b",
    source:       "Manual",
    tags:         ["AWS", "Kubernetes", "Terraform", "7 yrs"],
    rating:       5,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 4),
    summary:      "Expert DevOps with deep AWS and Kubernetes experience. Excellent communication.",
  },
  {
    id:           "6",
    name:         "Bianca Reyes",
    email:        "biancareyes@gmail.com",
    location:     "Mandaluyong, PH",
    appliedFor:   "Product Designer",
    score:        null,
    stage:        "Applied",
    stageColor:   "#6366f1",
    source:       "Manual",
    tags:         ["Figma", "UX Research", "4 yrs"],
    rating:       0,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 24),
    summary:      null,
  },
  {
    id:           "7",
    name:         "Luis Bangayan",
    email:        "luisbangayan@gmail.com",
    location:     "Alabang, PH",
    appliedFor:   "Senior React Developer",
    score:        94,
    stage:        "Final Interview",
    stageColor:   "#f59e0b",
    source:       "Referral",
    tags:         ["React", "Next.js", "System Design", "8 yrs"],
    rating:       5,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 36),
    summary:      "Lead engineer profile. Designed and shipped multiple high-scale frontend systems.",
  },
  {
    id:           "8",
    name:         "Sofia Cruz",
    email:        "sofiacruz@yahoo.com",
    location:     "Cebu City, PH",
    appliedFor:   "Backend Engineer",
    score:        72,
    stage:        "Screening",
    stageColor:   "#8b5cf6",
    source:       "Email",
    tags:         ["Python", "FastAPI", "PostgreSQL", "4 yrs"],
    rating:       3,
    lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 50),
    summary:      "Solid backend developer. Python and FastAPI expertise. Worth a technical screen.",
  },
];

export default function CandidatesPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Candidates"
        subtitle={`${CANDIDATES.length} candidates | 5 AI-scored today`}
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Upload className="h-4 w-4" />
              Import
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Add Candidate
            </Button>
          </>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Toolbar */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-foreground-subtle)]" />
            <Input
              className="pl-9"
              placeholder='Search or try "React dev with fintech experience"...'
            />
          </div>
          <Button variant="secondary" size="sm">
            <Sparkles className="h-4 w-4 text-violet-400" />
            AI Search
          </Button>
          <Button variant="secondary" size="sm">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="secondary" size="sm">
            <SortAsc className="h-4 w-4" />
            Sort
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
          <Badge variant="info">Review SLA: 24h</Badge>
          <Badge variant="default">Auto-Ranking Enabled</Badge>
          <span className="text-xs text-[var(--color-foreground-subtle)]">
            Last sync: 9:42 AM
          </span>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] shadow-card">
          {/* Header row */}
          <div className="grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1fr_1fr_2rem] gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-foreground-subtle)]">
            <span>Candidate</span>
            <span>Applied For</span>
            <span>Stage</span>
            <span>AI Score</span>
            <span>Source</span>
            <span>Last Activity</span>
            <span />
          </div>

          {/* Data rows */}
          <div className="divide-y divide-[var(--color-border)]">
            {CANDIDATES.map((c) => (
              <div
                key={c.id}
                className="group grid grid-cols-[2.5fr_1.5fr_1fr_1fr_1fr_1fr_2rem] cursor-pointer items-center gap-4 bg-[var(--color-surface)] px-5 py-3.5 transition-colors hover:bg-[var(--color-surface-elevated)]"
              >
                {/* Candidate */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={c.name} size="md" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="truncate text-sm font-medium text-[var(--color-foreground)] group-hover:text-indigo-400 transition-colors">
                        {c.name}
                      </p>
                      {c.rating >= 4 && (
                        <div className="flex shrink-0">
                          {Array.from({ length: Math.min(c.rating, 3) }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="truncate text-xs text-[var(--color-foreground-subtle)]">{c.email}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {c.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[var(--color-surface-hover)] px-1.5 py-0.5 text-[10px] text-[var(--color-foreground-subtle)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Applied for */}
                <p className="truncate text-xs font-medium text-[var(--color-foreground-muted)]">
                  {c.appliedFor}
                </p>

                {/* Stage */}
                <div>
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: c.stageColor + "25",
                      color:           c.stageColor,
                    }}
                  >
                    <Circle className="h-1.5 w-1.5 fill-current shrink-0" />
                    {c.stage}
                  </span>
                </div>

                {/* Score */}
                <div>
                  {c.score !== null ? (
                    <div className="flex items-center gap-1.5">
                      <ScoreBadge score={c.score} />
                      <Sparkles className="h-3 w-3 text-violet-400 shrink-0" />
                    </div>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-[var(--color-foreground-subtle)]">
                      <Sparkles className="h-3 w-3" />
                      Pending
                    </span>
                  )}
                </div>

                {/* Source */}
                <span
                  className={cn(
                    "text-xs",
                    c.source === "Referral"
                      ? "text-emerald-400 font-medium"
                      : "text-[var(--color-foreground-subtle)]"
                  )}
                >
                  {c.source}
                </span>

                {/* Last activity */}
                <span className="text-xs text-[var(--color-foreground-subtle)]">
                  {formatRelativeTime(c.lastActivity)}
                </span>

                {/* Actions */}
                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded-md p-1 text-[var(--color-foreground-subtle)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-foreground)] transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                {/* AI summary on hover */}
                {c.summary && (
                  <div className="col-span-full mt-1 hidden pl-12 group-hover:block animate-slide-up">
                    <div className="flex items-start gap-1.5 rounded-lg border border-violet-500/15 bg-violet-500/5 px-3 py-2">
                      <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
                      <p className="text-xs text-[var(--color-foreground-muted)]">{c.summary}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

