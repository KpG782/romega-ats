"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Badge, ScoreBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  Plus,
  MoreHorizontal,
  Sparkles,
  Mail,
  Calendar,
  MessageSquare,
  ChevronDown,
  GripVertical,
  Filter,
  Search,
  Star,
  Clock,
  User,
} from "lucide-react";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface Candidate {
  id: string;
  name: string;
  role: string;
  score: number | null;
  source: string;
  appliedAt: Date;
  tags: string[];
  hasNotes: boolean;
  rating?: number;
}

interface Stage {
  id: string;
  name: string;
  color: string;
  candidates: Candidate[];
  isTerminal?: boolean;
}

// â”€â”€â”€ Mock data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const INITIAL_STAGES: Stage[] = [
  {
    id: "applied",
    name: "Applied",
    color: "#6366f1",
    candidates: [
      {
        id: "c1",
        name: "Maria Santos",
        role: "React Developer Â· 5 yrs",
        score: 82,
        source: "Referral",
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        tags: ["React", "TypeScript"],
        hasNotes: false,
      },
      {
        id: "c2",
        name: "Carlo Hernandez",
        role: "FE Engineer Â· 3 yrs",
        score: 67,
        source: "Email",
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
        tags: ["Vue", "React"],
        hasNotes: true,
      },
      {
        id: "c3",
        name: "Bianca Reyes",
        role: "Web Developer Â· 4 yrs",
        score: null,
        source: "Manual",
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        tags: ["React"],
        hasNotes: false,
      },
    ],
  },
  {
    id: "screening",
    name: "Screening",
    color: "#8b5cf6",
    candidates: [
      {
        id: "c4",
        name: "James Lim",
        role: "Senior FE Â· 6 yrs",
        score: 88,
        source: "Referral",
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
        tags: ["React", "Next.js", "GraphQL"],
        hasNotes: true,
        rating: 4,
      },
      {
        id: "c5",
        name: "Sarah Dizon",
        role: "React Dev Â· 4 yrs",
        score: 74,
        source: "Email",
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
        tags: ["React", "TypeScript"],
        hasNotes: false,
      },
    ],
  },
  {
    id: "technical",
    name: "Technical",
    color: "#0ea5e9",
    candidates: [
      {
        id: "c6",
        name: "Ryan Torres",
        role: "Lead FE Â· 7 yrs",
        score: 91,
        source: "Referral",
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
        tags: ["React", "Next.js", "AWS"],
        hasNotes: true,
        rating: 5,
      },
      {
        id: "c7",
        name: "Nina Castro",
        role: "FE Engineer Â· 5 yrs",
        score: 79,
        source: "Manual",
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 120),
        tags: ["React", "Redux"],
        hasNotes: true,
        rating: 4,
      },
    ],
  },
  {
    id: "final",
    name: "Final Interview",
    color: "#f59e0b",
    candidates: [
      {
        id: "c8",
        name: "Luis Bangayan",
        role: "Senior FE Â· 8 yrs",
        score: 94,
        source: "Referral",
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 200),
        tags: ["React", "Next.js", "System Design"],
        hasNotes: true,
        rating: 5,
      },
    ],
  },
  {
    id: "offer",
    name: "Offer",
    color: "#10b981",
    candidates: [
      {
        id: "c9",
        name: "Anna Mendoza",
        role: "Senior FE Â· 6 yrs",
        score: 90,
        source: "Referral",
        appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 300),
        tags: ["React", "TypeScript", "Node.js"],
        hasNotes: true,
        rating: 5,
      },
    ],
  },
  {
    id: "hired",
    name: "Hired",
    color: "#059669",
    isTerminal: true,
    candidates: [],
  },
  {
    id: "rejected",
    name: "Rejected",
    color: "#ef4444",
    isTerminal: true,
    candidates: [],
  },
];

// â”€â”€â”€ Candidate Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CandidateCard({
  candidate,
  stageColor,
}: {
  candidate: Candidate;
  stageColor: string;
}) {
  return (
    <div className="group relative rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-3 transition-all duration-150 hover:border-[var(--color-primary)]/30 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer">
      {/* Drag handle */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-3.5 w-3.5 text-[var(--color-foreground-subtle)]" />
      </div>

      {/* Score banner */}
      {candidate.score !== null ? (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-[var(--radius-lg)]"
          style={{ backgroundColor: stageColor }}
        />
      ) : null}

      <div className="flex items-start gap-2.5">
        <Avatar name={candidate.name} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-sm font-medium text-[var(--color-foreground)] truncate">
              {candidate.name}
            </p>
            {candidate.rating && (
              <div className="flex">
                {Array.from({ length: candidate.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3 w-3 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
            )}
          </div>
          <p className="text-[11px] text-[var(--color-foreground-subtle)] truncate">
            {candidate.role}
          </p>
        </div>
        {candidate.score !== null && (
          <ScoreBadge score={candidate.score} />
        )}
      </div>

      {/* Tags */}
      {candidate.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {candidate.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] px-2 py-0.5 text-[10px] text-[var(--color-foreground-muted)]"
            >
              {tag}
            </span>
          ))}
          {candidate.tags.length > 3 && (
            <span className="text-[10px] text-[var(--color-foreground-subtle)]">
              +{candidate.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-2.5 flex items-center justify-between border-t border-[var(--color-border-subtle)] pt-2">
        <div className="flex items-center gap-1 text-[11px] text-[var(--color-foreground-subtle)]">
          <Clock className="h-3 w-3" />
          {formatRelativeTime(candidate.appliedAt)}
        </div>
        <div className="flex items-center gap-1.5">
          {candidate.source === "Referral" && (
            <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400">
              Ref
            </span>
          )}
          {candidate.hasNotes && (
            <MessageSquare className="h-3 w-3 text-[var(--color-foreground-subtle)]" />
          )}
          {candidate.score !== null && (
            <Sparkles className="h-3 w-3 text-violet-400" aria-label="AI scored" />
          )}
        </div>
      </div>

      {/* Hover actions */}
      <div className="absolute inset-x-0 bottom-0 flex translate-y-full gap-1 rounded-b-[var(--radius-lg)] bg-[var(--color-surface-elevated)] px-2 py-1.5 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 border-t border-[var(--color-border)]">
        <button className="flex flex-1 items-center justify-center gap-1 rounded py-1 text-[10px] text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors">
          <Mail className="h-3 w-3" /> Email
        </button>
        <button className="flex flex-1 items-center justify-center gap-1 rounded py-1 text-[10px] text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors">
          <Calendar className="h-3 w-3" /> Schedule
        </button>
        <button className="flex flex-1 items-center justify-center gap-1 rounded py-1 text-[10px] text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors">
          <User className="h-3 w-3" /> Profile
        </button>
      </div>
    </div>
  );
}

// â”€â”€â”€ Stage Column â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function StageColumn({ stage }: { stage: Stage }) {
  return (
    <div className="flex w-72 shrink-0 flex-col rounded-[var(--radius-xl)] bg-[var(--color-surface)] border border-[var(--color-border)]">
      {/* Column header */}
      <div className="flex items-center justify-between p-3 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: stage.color }}
          />
          <span className="text-xs font-semibold text-[var(--color-foreground)]">
            {stage.name}
          </span>
          <span
            className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white"
            style={{ backgroundColor: stage.color }}
          >
            {stage.candidates.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded p-1 text-[var(--color-foreground-subtle)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)] transition-colors">
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button className="rounded p-1 text-[var(--color-foreground-subtle)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)] transition-colors">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 overflow-y-auto p-2" style={{ maxHeight: "calc(100vh - 200px)" }}>
        {stage.candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            stageColor={stage.color}
          />
        ))}

        {stage.candidates.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border-2 border-dashed border-[var(--color-border)] p-6 text-center">
            <p className="text-xs text-[var(--color-foreground-subtle)]">
              {stage.isTerminal
                ? "No candidates here yet"
                : "Drag candidates here"}
            </p>
          </div>
        )}

        {/* Add candidate button */}
        {!stage.isTerminal && (
          <button className="flex items-center gap-2 rounded-[var(--radius-md)] px-3 py-2 text-xs text-[var(--color-foreground-subtle)] hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-foreground)] transition-colors w-full">
            <Plus className="h-3.5 w-3.5" />
            Add candidate
          </button>
        )}
      </div>
    </div>
  );
}

// â”€â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function JobPipelinePage({
  params,
}: {
  params: { id: string };
}) {
  const [stages] = useState<Stage[]>(INITIAL_STAGES);
  const [view, setView] = useState<"kanban" | "list">("kanban");

  const totalCandidates = stages.reduce((s, st) => s + st.candidates.length, 0);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Senior React Developer"
        subtitle={`Engineering | 2 headcount | Open | Req #${params.id}`}
        breadcrumbs={[{ label: "Jobs" }, { label: "Senior React Developer" }]}
        actions={
          <>
            <div className="flex rounded-[var(--radius-md)] border border-[var(--color-border)] overflow-hidden">
              {(["kanban", "list"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                    view === v
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
            <Button variant="secondary" size="sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Add Candidate
            </Button>
          </>
        }
      />

      {/* Stats bar */}
      <div className="flex items-center gap-6 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-2">
        {stages.map((stage) => (
          <div key={stage.id} className="flex items-center gap-1.5">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: stage.color }}
            />
            <span className="text-xs text-[var(--color-foreground-subtle)]">
              {stage.name}
            </span>
            <span className="text-xs font-semibold text-[var(--color-foreground)]">
              {stage.candidates.length}
            </span>
          </div>
        ))}
        <div className="ml-auto text-xs text-[var(--color-foreground-subtle)]">
          {totalCandidates} total
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-3">
        <Button variant="secondary" size="sm">
          <Search className="h-4 w-4" />
          Search in pipeline
        </Button>
        <Button variant="secondary" size="sm">
          <ChevronDown className="h-4 w-4" />
          Sort by score
        </Button>
        <Badge variant="info">Interview loop in progress</Badge>
        <span className="ml-auto text-xs text-[var(--color-foreground-subtle)]">
          Updated 11 minutes ago
        </span>
      </div>
      {/* Kanban board */}
      <div className="flex flex-1 gap-3 overflow-x-auto p-6 pb-8">
        {stages.map((stage) => (
          <StageColumn key={stage.id} stage={stage} />
        ))}
      </div>
    </div>
  );
}

