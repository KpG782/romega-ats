"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Badge, JobStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Plus, Search, Users, Clock, MoreHorizontal, ChevronRight,
  X, Edit2, Copy, PauseCircle, Trash2, SortAsc, CheckCircle2, Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type JobStatus = "open" | "draft" | "on_hold" | "filled" | "closed";

interface Job {
  id: string;
  title: string;
  department: string;
  status: JobStatus;
  headcount: number;
  candidates: number;
  newThisWeek: number;
  daysOpen: number;
  stages: { name: string; count: number; color: string }[];
  updatedAt: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INITIAL_JOBS: Job[] = [
  { id: "1", title: "Senior React Developer", department: "Engineering", status: "open", headcount: 2, candidates: 34, newThisWeek: 5, daysOpen: 14,
    stages: [{ name: "Applied", count: 12, color: "#6366f1" }, { name: "Screening", count: 8, color: "#8b5cf6" }, { name: "Technical", count: 6, color: "#0ea5e9" }, { name: "Final", count: 5, color: "#f59e0b" }, { name: "Offer", count: 3, color: "#10b981" }], updatedAt: "2h ago" },
  { id: "2", title: "Backend Engineer", department: "Engineering", status: "open", headcount: 1, candidates: 28, newThisWeek: 3, daysOpen: 21,
    stages: [{ name: "Applied", count: 10, color: "#6366f1" }, { name: "Screening", count: 7, color: "#8b5cf6" }, { name: "Technical", count: 5, color: "#0ea5e9" }, { name: "Final", count: 4, color: "#f59e0b" }, { name: "Offer", count: 2, color: "#10b981" }], updatedAt: "5h ago" },
  { id: "3", title: "Product Designer", department: "Design", status: "open", headcount: 1, candidates: 21, newThisWeek: 2, daysOpen: 10,
    stages: [{ name: "Applied", count: 8, color: "#6366f1" }, { name: "Screening", count: 5, color: "#8b5cf6" }, { name: "Portfolio", count: 4, color: "#0ea5e9" }, { name: "Final", count: 3, color: "#f59e0b" }, { name: "Offer", count: 1, color: "#10b981" }], updatedAt: "1d ago" },
  { id: "4", title: "DevOps Engineer", department: "Infrastructure", status: "open", headcount: 1, candidates: 15, newThisWeek: 1, daysOpen: 30,
    stages: [{ name: "Applied", count: 6, color: "#6366f1" }, { name: "Screening", count: 4, color: "#8b5cf6" }, { name: "Technical", count: 3, color: "#0ea5e9" }, { name: "Final", count: 2, color: "#f59e0b" }], updatedAt: "3d ago" },
  { id: "5", title: "QA Automation Engineer", department: "Engineering", status: "on_hold", headcount: 1, candidates: 9, newThisWeek: 0, daysOpen: 45,
    stages: [{ name: "Applied", count: 5, color: "#6366f1" }, { name: "Screening", count: 3, color: "#8b5cf6" }, { name: "Technical", count: 1, color: "#0ea5e9" }], updatedAt: "1w ago" },
  { id: "6", title: "Fullstack Developer", department: "Engineering", status: "draft", headcount: 2, candidates: 0, newThisWeek: 0, daysOpen: 2, stages: [], updatedAt: "2d ago" },
  { id: "7", title: "Operations Analyst", department: "Operations", status: "filled", headcount: 1, candidates: 42, newThisWeek: 0, daysOpen: 60,
    stages: [{ name: "Hired", count: 1, color: "#10b981" }], updatedAt: "2w ago" },
  { id: "8", title: "Growth Marketer", department: "Marketing", status: "open", headcount: 1, candidates: 19, newThisWeek: 4, daysOpen: 7,
    stages: [{ name: "Applied", count: 10, color: "#6366f1" }, { name: "Screening", count: 5, color: "#8b5cf6" }, { name: "Final", count: 4, color: "#f59e0b" }], updatedAt: "6h ago" },
];

const DEPARTMENTS = ["Engineering", "Design", "Infrastructure", "Marketing", "Operations", "Sales", "HR", "Finance"];
type StatusFilter = "All" | "Open" | "Draft" | "On Hold" | "Filled" | "Closed";
const STATUS_FILTERS: StatusFilter[] = ["All", "Open", "Draft", "On Hold", "Filled", "Closed"];
const FILTER_MAP: Record<StatusFilter, JobStatus | null> = {
  All: null, Open: "open", Draft: "draft", "On Hold": "on_hold", Filled: "filled", Closed: "closed",
};
type SortMode = "none" | "recent" | "candidates" | "days";

// ─── Job context menu ─────────────────────────────────────────────────────────

function JobMenu({
  job, onClose, onEdit, onDuplicate, onChangeStatus, onDelete, anchor,
}: {
  job: Job; onClose: () => void; onEdit: () => void; onDuplicate: () => void;
  onChangeStatus: (s: JobStatus) => void; onDelete: () => void;
  anchor: { top: number; right: number };
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  const row = "flex w-full items-center gap-2.5 px-3 py-2 text-xs transition-colors";
  const base = `${row} text-foreground-muted hover:bg-surface-elevated hover:text-foreground`;

  return (
    <div ref={ref} className="z-9999 min-w-42.5 rounded-xl border border-border bg-surface py-1 shadow-(--shadow-elevated)" style={{ position: 'fixed', top: anchor.top, right: anchor.right }}>
      <button onClick={onEdit} className={base}><Edit2 className="h-3.5 w-3.5" /> Edit job</button>
      <button onClick={onDuplicate} className={base}><Copy className="h-3.5 w-3.5" /> Duplicate</button>
      <div className="my-1 border-t border-border" />
      {job.status !== "on_hold" && (
        <button onClick={() => onChangeStatus("on_hold")} className={base}><PauseCircle className="h-3.5 w-3.5" /> Put on hold</button>
      )}
      {job.status !== "open" && (
        <button onClick={() => onChangeStatus("open")} className={`${row} text-emerald-500 hover:bg-surface-elevated`}><CheckCircle2 className="h-3.5 w-3.5" /> Reopen</button>
      )}
      {job.status !== "closed" && (
        <button onClick={() => onChangeStatus("closed")} className={base}><X className="h-3.5 w-3.5" /> Close job</button>
      )}
      <div className="my-1 border-t border-border" />
      <button onClick={onDelete} className={`${row} text-red-500 hover:bg-red-500/10`}><Trash2 className="h-3.5 w-3.5" /> Delete</button>
    </div>
  );
}

// ─── Create / Edit Job modal ──────────────────────────────────────────────────

function JobModal({
  initial, onSave, onClose,
}: {
  initial?: Partial<Job>;
  onSave: (data: Omit<Job, "id" | "candidates" | "newThisWeek" | "stages" | "updatedAt">) => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [dept, setDept] = useState(initial?.department ?? "");
  const [status, setStatus] = useState<JobStatus>(initial?.status ?? "draft");
  const [headcount, setHeadcount] = useState(initial?.headcount ?? 1);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dept.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    onSave({ title: title.trim(), department: dept.trim(), status, headcount, daysOpen: initial?.daysOpen ?? 0 });
    setSaving(false);
  };

  const sel = "flex h-9 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-[var(--color-primary)]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface shadow-(--shadow-overlay)">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">
            {initial?.id ? "Edit Job" : "Create New Job"}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-foreground-subtle hover:bg-surface-elevated transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground">
              Job title <span className="text-red-500">*</span>
            </label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior React Developer" required autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">Department <span className="text-red-500">*</span></label>
              <select value={dept} onChange={(e) => setDept(e.target.value)} required className={sel}>
                <option value="">Select…</option>
                {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as JobStatus)} className={sel}>
                <option value="draft">Draft</option>
                <option value="open">Open</option>
                <option value="on_hold">On Hold</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground">Headcount</label>
            <Input type="number" min={1} max={50} value={headcount} onChange={(e) => setHeadcount(Number(e.target.value))} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : initial?.id ? "Save changes" : "Create job"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<StatusFilter>("All");
  const [sort, setSort] = useState<SortMode>("none");
  const [showCreate, setShowCreate] = useState(false);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [menuPos, setMenuPos]        = useState<{top: number; right: number} | null>(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSortMenu(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filtered = jobs
    .filter((j) => {
      const q = search.toLowerCase();
      const matchQ = !q || j.title.toLowerCase().includes(q) || j.department.toLowerCase().includes(q);
      const wanted = FILTER_MAP[activeFilter];
      return matchQ && (wanted === null || j.status === wanted);
    })
    .sort((a, b) => {
      if (sort === "recent") return a.daysOpen - b.daysOpen;
      if (sort === "candidates") return b.candidates - a.candidates;
      if (sort === "days") return b.daysOpen - a.daysOpen;
      return 0;
    });

  const openCount = jobs.filter((j) => j.status === "open").length;
  const totalCand = jobs.reduce((s, j) => s + j.candidates, 0);

  const handleCreate = useCallback((data: Omit<Job, "id" | "candidates" | "newThisWeek" | "stages" | "updatedAt">) => {
    setJobs((prev) => [{ ...data, id: String(Date.now()), candidates: 0, newThisWeek: 0, stages: [], updatedAt: "just now" }, ...prev]);
    setShowCreate(false);
  }, []);

  const handleEdit = useCallback((data: Omit<Job, "id" | "candidates" | "newThisWeek" | "stages" | "updatedAt">) => {
    if (!editJob) return;
    setJobs((prev) => prev.map((j) => j.id === editJob.id ? { ...j, ...data, updatedAt: "just now" } : j));
    setEditJob(null);
  }, [editJob]);

  const SORT_LABEL: Record<SortMode, string> = {
    none: "Sort", recent: "Most recent", candidates: "Most candidates", days: "Longest open",
  };

  return (
    <>
      {(showCreate || editJob) && (
        <JobModal
          initial={editJob ?? undefined}
          onSave={editJob ? handleEdit : handleCreate}
          onClose={() => { setShowCreate(false); setEditJob(null); }}
        />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title="Jobs"
          subtitle={`${openCount} open positions · ${totalCand} total candidates`}
          actions={
            <>
              <div ref={sortRef} className="relative">
                <Button variant="secondary" size="sm" onClick={() => setShowSortMenu((v) => !v)}>
                  <SortAsc className="h-4 w-4" /> {SORT_LABEL[sort]}
                </Button>
                {showSortMenu && (
                  <div className="absolute right-0 top-10 z-50 min-w-42.5 rounded-xl border border-border bg-surface py-1 shadow-(--shadow-elevated)">
                    {(["none", "recent", "candidates", "days"] as SortMode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => { setSort(m); setShowSortMenu(false); }}
                        className={cn(
                          "flex w-full items-center px-3 py-2 text-xs transition-colors",
                          sort === m
                            ? "bg-primary-subtle text-primary font-medium"
                            : "text-foreground-muted hover:bg-surface-elevated hover:text-foreground"
                        )}
                      >
                        {SORT_LABEL[m]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button size="sm" onClick={() => setShowCreate(true)}>
                <Plus className="h-4 w-4" /> Create Job
              </Button>
            </>
          }
        />

        <div className="flex-1 overflow-y-auto p-6">
          {/* Toolbar */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
              <Input className="pl-9" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground transition-colors">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                    activeFilter === f
                      ? "bg-primary text-white shadow-sm"
                      : "text-foreground-muted hover:text-foreground hover:bg-surface-elevated"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3">
            <Badge variant="default">Hiring Sprint: Week 12</Badge>
            <Badge variant="success">{openCount} active requisitions</Badge>
            <span className="text-xs text-foreground-subtle">Last synced: 10:08 AM</span>
          </div>

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <Search className="h-10 w-10 text-foreground-subtle opacity-40" />
              <p className="text-sm font-medium text-foreground">No jobs found</p>
              <p className="text-xs text-foreground-subtle">Try a different search or status filter</p>
              <Button variant="secondary" size="sm" onClick={() => { setSearch(""); setActiveFilter("All"); }}>
                Clear filters
              </Button>
            </div>
          )}

          {/* Jobs grid */}
          {filtered.length > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((job) => {
                const total = job.stages.reduce((s, st) => s + st.count, 0);
                return (
                  <div key={job.id} className="relative">
                    <Link href={`/jobs/${job.id}`} className="block">
                      <Card hover padding="none" className="flex h-full flex-col overflow-hidden">
                        <div className="h-0.75 w-full bg-linear-to-r from-indigo-500 via-violet-500 to-blue-500" />
                        <div className="flex flex-1 flex-col gap-3 p-4">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                <JobStatusBadge status={job.status} />
                                {job.newThisWeek > 0 && <Badge variant="info">+{job.newThisWeek} new</Badge>}
                              </div>
                              <h3 className="text-sm font-semibold leading-snug text-foreground line-clamp-2">{job.title}</h3>
                              <p className="mt-0.5 text-xs text-foreground-subtle">{job.department} | {job.headcount} headcount</p>
                            </div>
                            <div className="relative shrink-0">
                              <button
                                onClick={(e) => { e.preventDefault(); const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right }); setOpenMenuId((p) => p === job.id ? null : job.id); }}
                                className="rounded-lg p-1 text-foreground-subtle hover:bg-surface-elevated hover:text-foreground transition-colors"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                              {openMenuId === job.id && (
                                <JobMenu
                                  job={job}
                                  onClose={() => setOpenMenuId(null)}
                                  onEdit={() => { setEditJob(job); setOpenMenuId(null); }}
                                  onDuplicate={() => {
                                    setJobs((p) => [{ ...job, id: String(Date.now()), title: job.title + " (copy)", status: "draft", candidates: 0, newThisWeek: 0, stages: [], updatedAt: "just now" }, ...p]);
                                    setOpenMenuId(null);
                                  }}
                                  onChangeStatus={(s) => { setJobs((p) => p.map((j) => j.id === job.id ? { ...j, status: s, updatedAt: "just now" } : j)); setOpenMenuId(null); }}
                                  onDelete={() => { setJobs((p) => p.filter((j) => j.id !== job.id)); setOpenMenuId(null); }}
                                  anchor={menuPos ?? { top: 0, right: 0 }}
                                />
                              )}
                            </div>
                          </div>

                          {/* Pipeline bar */}
                          {total > 0 && (
                            <div>
                              <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
                                {job.stages.map((st) => (
                                  <div key={st.name} className="rounded-full" style={{ width: `${(st.count / total) * 100}%`, backgroundColor: st.color }} title={`${st.name}: ${st.count}`} />
                                ))}
                              </div>
                              <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
                                {job.stages.map((st) => (
                                  <span key={st.name} className="flex items-center gap-1 text-[10px] text-foreground-subtle">
                                    <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: st.color }} />
                                    {st.name} {st.count}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {total === 0 && job.status === "draft" && (
                            <div className="rounded-lg bg-surface-elevated px-3 py-2">
                              <span className="text-xs text-foreground-subtle">Draft — not yet published</span>
                            </div>
                          )}

                          {/* Footer */}
                          <div className="mt-auto flex items-center justify-between border-t border-border-subtle pt-3">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1.5 text-xs text-foreground-subtle"><Users className="h-3.5 w-3.5" />{job.candidates}</span>
                              <span className="flex items-center gap-1.5 text-xs text-foreground-subtle"><Clock className="h-3.5 w-3.5" />{job.daysOpen}d</span>
                            </div>
                            <span className="flex items-center gap-0.5 text-xs text-primary">Pipeline <ChevronRight className="h-3.5 w-3.5" /></span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </div>
                );
              })}

              {/* Create new job card */}
              <button
                onClick={() => setShowCreate(true)}
                className="flex h-48 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border text-foreground-subtle transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
              >
                <Plus className="h-6 w-6" />
                <span className="text-sm font-medium">Create New Job</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
