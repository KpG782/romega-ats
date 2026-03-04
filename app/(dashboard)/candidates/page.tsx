"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Badge, ScoreBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  Plus, Search, Upload, Sparkles, MoreHorizontal, Star, ChevronDown,
  SortAsc, Circle, X, Mail, Calendar, MapPin, Phone, Trash2, Edit2,
  ChevronRight, Copy, ArrowRight, Check, UserCheck, SlidersHorizontal,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type Stage = "Applied" | "Screening" | "Technical" | "Final Interview" | "Offer" | "Hired" | "Rejected";
type Source = "Referral" | "Email" | "Job Board" | "Manual" | "LinkedIn";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  appliedFor: string;
  score: number | null;
  stage: Stage;
  source: Source;
  tags: string[];
  rating: number;
  lastActivity: Date;
  summary: string | null;
  notes: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock data layer
// Replace these constants / functions with real API calls when adding a backend
// ─────────────────────────────────────────────────────────────────────────────
const STAGE_COLORS: Record<Stage, string> = {
  Applied:           "#6366f1",
  Screening:         "#8b5cf6",
  Technical:         "#0ea5e9",
  "Final Interview": "#f59e0b",
  Offer:             "#10b981",
  Hired:             "#22c55e",
  Rejected:          "#ef4444",
};

const STAGES: Stage[] = ["Applied", "Screening", "Technical", "Final Interview", "Offer", "Hired", "Rejected"];
const SOURCES: Source[] = ["Referral", "Email", "Job Board", "Manual", "LinkedIn"];

const INITIAL_CANDIDATES: Candidate[] = [
  { id: "1", name: "Maria Santos",   email: "maria.santos@email.com", phone: "+63 917 123 4567", location: "Makati, PH",       appliedFor: "Senior React Developer", score: 82,  stage: "Screening",       source: "Referral", tags: ["React", "TypeScript", "5 yrs"],               rating: 4, lastActivity: new Date(Date.now() - 1000*60*60*2),  summary: "Strong React developer with fintech background. Excellent TypeScript and system design skills. Recommended for technical round.", notes: "" },
  { id: "2", name: "James Lim",      email: "jameslim@gmail.com",     phone: "+63 918 234 5678", location: "BGC, Taguig",       appliedFor: "Senior React Developer", score: 88,  stage: "Technical",       source: "Referral", tags: ["React", "Next.js", "GraphQL", "6 yrs"],       rating: 5, lastActivity: new Date(Date.now() - 1000*60*30),    summary: "Top-tier candidate. Led frontend at two fintech startups. Strong system design. High recommendation.", notes: "" },
  { id: "3", name: "Carlo Hernandez",email: "carlo.h@outlook.com",    phone: "+63 919 345 6789", location: "Quezon City, PH",   appliedFor: "Backend Engineer",       score: 67,  stage: "Applied",         source: "Email",    tags: ["Node.js", "PostgreSQL", "3 yrs"],              rating: 3, lastActivity: new Date(Date.now() - 1000*60*60*8),  summary: "Mid-level backend developer. Some gaps in distributed systems but strong fundamentals.", notes: "" },
  { id: "4", name: "Anna Mendoza",   email: "anna.mendoza@email.com", phone: "+63 920 456 7890", location: "Ortigas, PH",        appliedFor: "Senior React Developer", score: 90,  stage: "Offer",           source: "Referral", tags: ["React", "TypeScript", "Node.js", "6 yrs"],    rating: 5, lastActivity: new Date(Date.now() - 1000*60*60*1),  summary: "Exceptional candidate. Strong both FE and BE. Offer extended pending negotiation.", notes: "" },
  { id: "5", name: "Ryan Torres",    email: "ryanT@proton.me",        phone: "+63 921 567 8901", location: "Pasig, PH",         appliedFor: "DevOps Engineer",        score: 91,  stage: "Final Interview", source: "Manual",    tags: ["AWS", "Kubernetes", "Terraform", "7 yrs"],    rating: 5, lastActivity: new Date(Date.now() - 1000*60*60*4),  summary: "Expert DevOps with deep AWS and Kubernetes experience. Excellent communication.", notes: "" },
  { id: "6", name: "Bianca Reyes",   email: "biancareyes@gmail.com",  phone: "+63 922 678 9012", location: "Mandaluyong, PH",    appliedFor: "Product Designer",       score: null,stage: "Applied",         source: "Manual",    tags: ["Figma", "UX Research", "4 yrs"],              rating: 0, lastActivity: new Date(Date.now() - 1000*60*60*24), summary: null, notes: "" },
  { id: "7", name: "Luis Bangayan",  email: "luisbangayan@gmail.com", phone: "+63 923 789 0123", location: "Alabang, PH",        appliedFor: "Senior React Developer", score: 94,  stage: "Final Interview", source: "Referral", tags: ["React", "Next.js", "System Design", "8 yrs"], rating: 5, lastActivity: new Date(Date.now() - 1000*60*60*36), summary: "Lead engineer profile. Designed and shipped multiple high-scale frontend systems.", notes: "" },
  { id: "8", name: "Sofia Cruz",     email: "sofiacruz@yahoo.com",    phone: "+63 924 890 1234", location: "Cebu City, PH",      appliedFor: "Backend Engineer",       score: 72,  stage: "Screening",       source: "Email",    tags: ["Python", "FastAPI", "PostgreSQL", "4 yrs"],   rating: 3, lastActivity: new Date(Date.now() - 1000*60*60*50), summary: "Solid backend developer. Python and FastAPI expertise. Worth a technical screen.", notes: "" },
];

let _nextId = 9;
function generateId() { return String(_nextId++); }

// ─────────────────────────────────────────────────────────────────────────────
// useClickOutside
// ─────────────────────────────────────────────────────────────────────────────
function useClickOutside(cb: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) cb();
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [cb]);
  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// Add / Edit Candidate Modal
// ─────────────────────────────────────────────────────────────────────────────
function CandidateModal({
  candidate,
  onSave,
  onClose,
}: {
  candidate?: Candidate;
  onSave: (c: Candidate) => void;
  onClose: () => void;
}) {
  const [name, setName]           = useState(candidate?.name ?? "");
  const [email, setEmail]         = useState(candidate?.email ?? "");
  const [phone, setPhone]         = useState(candidate?.phone ?? "");
  const [location, setLocation]   = useState(candidate?.location ?? "");
  const [appliedFor, setApplied]  = useState(candidate?.appliedFor ?? "");
  const [source, setSource]       = useState<Source>(candidate?.source ?? "Manual");
  const [stage, setStage]         = useState<Stage>(candidate?.stage ?? "Applied");
  const [tagsRaw, setTagsRaw]     = useState(candidate?.tags.join(", ") ?? "");
  const [notes, setNotes]         = useState(candidate?.notes ?? "");
  const isEdit = !!candidate;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
    onSave({
      id:           candidate?.id ?? generateId(),
      name:         name.trim(),
      email:        email.trim(),
      phone:        phone.trim(),
      location:     location.trim(),
      appliedFor:   appliedFor.trim(),
      score:        candidate?.score ?? null,
      stage,
      source,
      tags,
      rating:       candidate?.rating ?? 0,
      lastActivity: new Date(),
      summary:      candidate?.summary ?? null,
      notes,
    });
  }

  const lbl = "block text-xs font-medium text-foreground mb-1";
  const sel = "w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface shadow-(--shadow-overlay)"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">{isEdit ? "Edit Candidate" : "Add Candidate"}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-foreground-subtle hover:bg-surface-elevated transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5 max-h-[72vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Full Name <span className="text-red-500">*</span></label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Maria Santos" required />
            </div>
            <div>
              <label className={lbl}>Email <span className="text-red-500">*</span></label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63 917 123 4567" />
            </div>
            <div>
              <label className={lbl}>Location</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
            </div>
          </div>
          <div>
            <label className={lbl}>Applying For <span className="text-red-500">*</span></label>
            <Input value={appliedFor} onChange={(e) => setApplied(e.target.value)} placeholder="e.g. Senior React Developer" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Stage</label>
              <select value={stage} onChange={(e) => setStage(e.target.value as Stage)} className={sel}>
                {STAGES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Source</label>
              <select value={source} onChange={(e) => setSource(e.target.value as Source)} className={sel}>
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={lbl}>Skills / Tags <span className="text-foreground-subtle font-normal">(comma-separated)</span></label>
            <Input value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} placeholder="React, TypeScript, 5 yrs" />
          </div>
          <div>
            <label className={lbl}>Recruiter Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal notes visible only to recruiters..."
              rows={3}
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-foreground-subtle"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm">{isEdit ? "Save Changes" : "Add Candidate"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Candidate Profile Drawer
// ─────────────────────────────────────────────────────────────────────────────
function CandidateDrawer({
  candidate,
  onClose,
  onEdit,
  onDelete,
  onStageChange,
  onRatingChange,
}: {
  candidate: Candidate;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStageChange: (stage: Stage) => void;
  onRatingChange: (rating: number) => void;
}) {
  const [scheduleDate, setScheduleDate]   = useState("");
  const [scheduleTime, setScheduleTime]   = useState("");
  const [scheduleType, setScheduleType]   = useState("Video Call");
  const [schedulePane, setSchedulePane]   = useState(false);
  const [scheduledMsg, setScheduledMsg]   = useState(false);

  function confirmSchedule(e: React.FormEvent) {
    e.preventDefault();
    setScheduledMsg(true);
    setSchedulePane(false);
    setTimeout(() => setScheduledMsg(false), 3000);
  }

  const sel = "w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/30 backdrop-blur-[2px]" />
      <div
        className="relative z-10 flex h-full w-full max-w-sm flex-col border-l border-border bg-surface shadow-(--shadow-overlay) overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sticky top-0 bg-surface z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-foreground-subtle">Candidate Profile</span>
          <div className="flex items-center gap-1">
            <button onClick={onEdit} className="rounded-lg p-1.5 text-foreground-subtle hover:bg-surface-elevated transition-colors" title="Edit">
              <Edit2 className="h-4 w-4" />
            </button>
            <button onClick={onClose} className="rounded-lg p-1.5 text-foreground-subtle hover:bg-surface-elevated transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-5">
          {/* Identity */}
          <div className="flex items-start gap-3">
            <Avatar name={candidate.name} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{candidate.name}</p>
              <p className="text-xs text-foreground-subtle mt-0.5">{candidate.appliedFor}</p>
              <div className="mt-1.5 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => onRatingChange(i + 1)} title={`Rate ${i + 1}`}>
                    <Star className={`h-3.5 w-3.5 transition-colors ${i < candidate.rating ? "fill-yellow-400 text-yellow-400" : "text-border fill-transparent"}`} />
                  </button>
                ))}
              </div>
            </div>
            {candidate.score !== null && <ScoreBadge score={candidate.score} />}
          </div>

          {/* Stage selector */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-foreground-subtle">Pipeline Stage</p>
            <div className="flex flex-wrap gap-1.5">
              {STAGES.map((s) => (
                <button
                  key={s}
                  onClick={() => onStageChange(s)}
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all",
                    candidate.stage === s
                      ? "border-transparent text-white"
                      : "border-border text-foreground-muted hover:border-border-subtle hover:text-foreground"
                  )}
                  style={candidate.stage === s ? { backgroundColor: STAGE_COLORS[s] } : undefined}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground-subtle">Contact</p>
            <a href={`mailto:${candidate.email}`} className="flex items-center gap-2 text-xs text-foreground-muted hover:text-primary transition-colors">
              <Mail className="h-3.5 w-3.5 shrink-0" />{candidate.email}
            </a>
            {candidate.phone && (
              <div className="flex items-center gap-2 text-xs text-foreground-muted">
                <Phone className="h-3.5 w-3.5 shrink-0" />{candidate.phone}
              </div>
            )}
            {candidate.location && (
              <div className="flex items-center gap-2 text-xs text-foreground-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0" />{candidate.location}
              </div>
            )}
          </div>

          {/* Tags */}
          {candidate.tags.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-foreground-subtle">Skills & Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {candidate.tags.map((t) => (
                  <span key={t} className="rounded-full border border-border px-2 py-0.5 text-xs text-foreground-muted">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium text-foreground-subtle mb-0.5">Source</p>
              <p className={cn("text-xs font-medium", candidate.source === "Referral" ? "text-emerald-400" : "text-foreground-muted")}>{candidate.source}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-foreground-subtle mb-0.5">Last Activity</p>
              <p className="text-xs text-foreground-muted">{formatRelativeTime(candidate.lastActivity)}</p>
            </div>
          </div>

          {/* AI Summary */}
          {candidate.summary && (
            <div className="rounded-lg border border-violet-500/15 bg-violet-500/5 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-xs font-semibold text-violet-400">AI Summary</span>
              </div>
              <p className="text-xs text-foreground-muted leading-relaxed">{candidate.summary}</p>
            </div>
          )}

          {/* Notes */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-foreground-subtle">Recruiter Notes</p>
            {candidate.notes ? (
              <p className="text-xs text-foreground-muted leading-relaxed whitespace-pre-wrap">{candidate.notes}</p>
            ) : (
              <p className="text-xs text-foreground-subtle italic">No notes yet — edit candidate to add.</p>
            )}
          </div>

          {/* Schedule interview pane */}
          {schedulePane && (
            <form onSubmit={confirmSchedule} className="rounded-xl border border-border bg-surface-elevated p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground">Schedule Interview</p>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Date</label>
                <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Time</label>
                <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Type</label>
                <select value={scheduleType} onChange={(e) => setScheduleType(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  {["Video Call","Phone Screen","On-site","Technical Test"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <Button type="submit" size="sm" className="flex-1 justify-center">Confirm</Button>
                <Button type="button" size="sm" variant="secondary" onClick={() => setSchedulePane(false)}>Cancel</Button>
              </div>
            </form>
          )}

          {scheduledMsg && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
              <Check className="h-3.5 w-3.5" /> Interview scheduled!
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <Button size="sm" className="w-full justify-center" onClick={() => window.location.href = `mailto:${candidate.email}`}>
              <Mail className="h-4 w-4" /> Send Email
            </Button>
            <Button size="sm" variant="secondary" className="w-full justify-center" onClick={() => setSchedulePane((p) => !p)}>
              <Calendar className="h-4 w-4" /> Schedule Interview
            </Button>
            <button
              onClick={() => { if (confirm(`Delete ${candidate.name}?`)) { onDelete(); onClose(); } }}
              className="mt-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete Candidate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-row context menu
// ─────────────────────────────────────────────────────────────────────────────
function CandidateMenu({
  candidate,
  onView,
  onEdit,
  onDelete,
  onStageChange,
  onClose,
  anchor,
}: {
  candidate: Candidate;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStageChange: (s: Stage) => void;
  onClose: () => void;
  anchor: { top: number; right: number };
}) {
  const [stagesOpen, setStagesOpen] = useState(false);
  const ref = useClickOutside(onClose);
  const row = "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-foreground-muted hover:bg-surface-elevated hover:text-foreground transition-colors text-left";

  return (
    <div ref={ref} className="z-9999 min-w-48 rounded-xl border border-border bg-surface py-1 shadow-(--shadow-elevated)" style={{ position: 'fixed', top: anchor.top, right: anchor.right }}>
      <button onClick={() => { onView(); onClose(); }} className={row}><UserCheck className="h-3.5 w-3.5" /> View Profile</button>
      <button onClick={() => { onEdit(); onClose(); }} className={row}><Edit2 className="h-3.5 w-3.5" /> Edit Candidate</button>
      <button onClick={() => { window.location.href = `mailto:${candidate.email}`; onClose(); }} className={row}><Mail className="h-3.5 w-3.5" /> Send Email</button>
      <div className="relative">
        <button onClick={() => setStagesOpen((p) => !p)} className={cn(row, "justify-between")}>
          <span className="flex items-center gap-2"><ArrowRight className="h-3.5 w-3.5" /> Move to Stage</span>
          <ChevronRight className="h-3 w-3" />
        </button>
        {stagesOpen && (
          <div className="absolute left-full top-0 z-50 min-w-44 rounded-xl border border-border bg-surface py-1 shadow-(--shadow-elevated)">
            {STAGES.map((s) => (
              <button
                key={s}
                onClick={() => { onStageChange(s); onClose(); }}
                className={cn(row, candidate.stage === s && "text-primary font-medium")}
              >
                {candidate.stage === s
                  ? <Check className="h-3.5 w-3.5 text-primary" />
                  : <span className="w-3.5" />
                }
                <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: STAGE_COLORS[s] }} />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="my-1 border-t border-border" />
      <button
        onClick={() => { if (confirm(`Delete ${candidate.name}?`)) onDelete(); onClose(); }}
        className={cn(row, "text-red-400 hover:text-red-300")}
      >
        <Trash2 className="h-3.5 w-3.5" /> Delete
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bulk Action Bar
// ─────────────────────────────────────────────────────────────────────────────
function BulkBar({
  count,
  onMoveStage,
  onEmail,
  onDelete,
  onClear,
}: {
  count: number;
  onMoveStage: (s: Stage) => void;
  onEmail: () => void;
  onDelete: () => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => setOpen(false));

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-2.5 shadow-(--shadow-overlay)">
        <span className="text-xs font-semibold text-foreground mr-1">{count} selected</span>
        <div className="relative" ref={ref}>
          <Button size="sm" variant="secondary" onClick={() => setOpen((p) => !p)}>
            <ArrowRight className="h-3.5 w-3.5" /> Move Stage <ChevronDown className="h-3 w-3" />
          </Button>
          {open && (
            <div className="absolute bottom-full mb-2 left-0 min-w-44 rounded-xl border border-border bg-surface py-1 shadow-(--shadow-overlay)">
              {STAGES.map((s) => (
                <button
                  key={s}
                  onClick={() => { onMoveStage(s); setOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-foreground-muted hover:bg-surface-elevated hover:text-foreground transition-colors"
                >
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: STAGE_COLORS[s] }} />
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button size="sm" variant="secondary" onClick={onEmail}><Mail className="h-3.5 w-3.5" /> Email All</Button>
        <Button size="sm" variant="secondary" onClick={onDelete} className="text-red-400 hover:text-red-300">
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </Button>
        <button onClick={onClear} className="ml-1 rounded-lg p-1 text-foreground-subtle hover:text-foreground transition-colors">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
export default function CandidatesPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [candidates, setCandidates]     = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [search, setSearch]             = useState("");
  const [stageFilter, setStageFilter]   = useState<Stage | "All">("All");
  const [sourceFilter, setSourceFilter] = useState<Source | "All">("All");
  const [sortMode, setSortMode]         = useState<"none" | "score" | "activity" | "name">("none");
  const [showFilters, setShowFilters]   = useState(false);
  const [showAdd, setShowAdd]           = useState(false);
  const [editCandidate, setEditCandidate] = useState<Candidate | null>(null);
  const [viewCandidate, setViewCandidate] = useState<Candidate | null>(null);
  const [openMenuId, setOpenMenuId]     = useState<string | null>(null);
  const [menuPos, setMenuPos]           = useState<{top: number; right: number} | null>(null);
  const [selectedIds, setSelectedIds]   = useState<Set<string>>(new Set());
  const [sortOpen, setSortOpen]         = useState(false);
  const sortRef = useClickOutside(() => setSortOpen(false));

  // ── Derived list ───────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = candidates.filter((c) => {
      const q = search.toLowerCase();
      if (q && !c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q) && !c.appliedFor.toLowerCase().includes(q) && !c.tags.some((t) => t.toLowerCase().includes(q))) return false;
      if (stageFilter !== "All" && c.stage !== stageFilter) return false;
      if (sourceFilter !== "All" && c.source !== sourceFilter) return false;
      return true;
    });
    if (sortMode === "score")    list = [...list].sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
    if (sortMode === "activity") list = [...list].sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime());
    if (sortMode === "name")     list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [candidates, search, stageFilter, sourceFilter, sortMode]);

  const activeFilterCount = (stageFilter !== "All" ? 1 : 0) + (sourceFilter !== "All" ? 1 : 0);

  // ── CRUD helpers ───────────────────────────────────────────────────────────
  const saveCandidate = useCallback((c: Candidate) => {
    setCandidates((prev) =>
      prev.some((p) => p.id === c.id) ? prev.map((p) => p.id === c.id ? c : p) : [...prev, c]
    );
    setShowAdd(false);
    setEditCandidate(null);
    // keep drawer in sync if open
    setViewCandidate((prev) => prev?.id === c.id ? c : prev);
  }, []);

  const deleteCandidate = useCallback((id: string) => {
    setCandidates((prev) => prev.filter((c) => c.id !== id));
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    setViewCandidate((prev) => prev?.id === id ? null : prev);
  }, []);

  const moveToStage = useCallback((id: string, stage: Stage) => {
    setCandidates((prev) => prev.map((c) => c.id === id ? { ...c, stage, lastActivity: new Date() } : c));
    setViewCandidate((prev) => prev?.id === id ? { ...prev, stage, lastActivity: new Date() } : prev);
  }, []);

  const setRating = useCallback((id: string, rating: number) => {
    setCandidates((prev) => prev.map((c) => c.id === id ? { ...c, rating } : c));
    setViewCandidate((prev) => prev?.id === id ? { ...prev, rating } : prev);
  }, []);

  // ── Bulk actions ───────────────────────────────────────────────────────────
  const bulkMoveStage = useCallback((stage: Stage) => {
    setCandidates((prev) => prev.map((c) => selectedIds.has(c.id) ? { ...c, stage, lastActivity: new Date() } : c));
    setSelectedIds(new Set());
  }, [selectedIds]);

  const bulkDelete = useCallback(() => {
    if (!confirm(`Delete ${selectedIds.size} candidate(s)? This cannot be undone.`)) return;
    setCandidates((prev) => prev.filter((c) => !selectedIds.has(c.id)));
    setSelectedIds(new Set());
  }, [selectedIds]);

  const bulkEmail = useCallback(() => {
    const emails = candidates.filter((c) => selectedIds.has(c.id)).map((c) => c.email).join(",");
    window.location.href = `mailto:${emails}`;
  }, [candidates, selectedIds]);

  const toggleSelect = (id: string) => setSelectedIds((prev) => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });
  const allSelected = filtered.length > 0 && selectedIds.size === filtered.length;
  const selectAll   = () => setSelectedIds(new Set(filtered.map((c) => c.id)));
  const clearAll    = () => setSelectedIds(new Set());

  const SORT_LABELS = { none: "Default", score: "AI Score ↓", activity: "Last Active", name: "Name A–Z" } as const;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Candidates"
        subtitle={`${candidates.length} total · ${filtered.length} shown`}
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => alert("Import CSV — wire to POST /api/candidates/import")}>
              <Upload className="h-4 w-4" /> Import
            </Button>
            <Button size="sm" onClick={() => setShowAdd(true)}>
              <Plus className="h-4 w-4" /> Add Candidate
            </Button>
          </>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        {/* ── Toolbar ── */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-52">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-subtle" />
            <Input
              className="pl-9 pr-8"
              placeholder="Search name, email, role, skills…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters((p) => !p)}
            className={showFilters || activeFilterCount > 0 ? "border-primary/50 text-primary" : ""}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 py-px text-[10px] font-semibold text-white leading-none">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <div className="relative" ref={sortRef}>
            <Button variant="secondary" size="sm" onClick={() => setSortOpen((p) => !p)}>
              <SortAsc className="h-4 w-4" />
              {SORT_LABELS[sortMode]}
              <ChevronDown className="h-3 w-3" />
            </Button>
            {sortOpen && (
              <div className="absolute right-0 top-9 z-50 min-w-40 rounded-xl border border-border bg-surface py-1 shadow-(--shadow-elevated)">
                {(["none", "score", "activity", "name"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => { setSortMode(m); setSortOpen(false); }}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-surface-elevated",
                      sortMode === m ? "text-primary font-medium" : "text-foreground-muted hover:text-foreground"
                    )}
                  >
                    {SORT_LABELS[m]}
                    {sortMode === m && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Filter Panel ── */}
        {showFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3">
            <span className="text-xs font-medium text-foreground-subtle mr-1">Stage:</span>
            {(["All", ...STAGES] as (Stage | "All")[]).map((s) => (
              <button
                key={s}
                onClick={() => setStageFilter(s)}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium transition-all border",
                  stageFilter === s
                    ? "bg-primary text-white border-transparent"
                    : "border-border text-foreground-muted hover:border-border-subtle hover:text-foreground"
                )}
              >
                {s}
              </button>
            ))}
            <div className="w-px h-4 bg-border mx-1" />
            <span className="text-xs font-medium text-foreground-subtle mr-1">Source:</span>
            {(["All", ...SOURCES] as (Source | "All")[]).map((s) => (
              <button
                key={s}
                onClick={() => setSourceFilter(s)}
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium transition-all border",
                  sourceFilter === s
                    ? "bg-primary text-white border-transparent"
                    : "border-border text-foreground-muted hover:border-border-subtle hover:text-foreground"
                )}
              >
                {s}
              </button>
            ))}
            {activeFilterCount > 0 && (
              <button
                onClick={() => { setStageFilter("All"); setSourceFilter("All"); }}
                className="ml-auto flex items-center gap-1 text-xs text-foreground-subtle hover:text-foreground transition-colors"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
        )}

        {/* ── Stats bar ── */}
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3">
          <Badge variant="info">Review SLA: 24h</Badge>
          <Badge variant="default">Auto-Ranking Enabled</Badge>
          <span className="ml-auto text-xs text-foreground-subtle">
            Last sync: {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>

        {/* ── Table ── */}
        <div className="overflow-hidden rounded-xl border border-border shadow-card">
          {/* Header row */}
          <div className="grid grid-cols-[2rem_2.5fr_1.5fr_1fr_1fr_1fr_1fr_2.5rem] gap-4 border-b border-border bg-surface-elevated px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-foreground-subtle">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 accent-primary"
                checked={allSelected}
                onChange={(e) => e.target.checked ? selectAll() : clearAll()}
              />
            </div>
            <span>Candidate</span>
            <span>Applied For</span>
            <span>Stage</span>
            <span>AI Score</span>
            <span>Source</span>
            <span>Last Activity</span>
            <span />
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16">
              <UserCheck className="h-10 w-10 text-foreground-subtle opacity-40" />
              <p className="text-sm font-medium text-foreground">No candidates found</p>
              <p className="text-xs text-foreground-subtle">Try adjusting your filters or search term</p>
              <Button
                size="sm"
                variant="secondary"
                className="mt-2"
                onClick={() => { setSearch(""); setStageFilter("All"); setSourceFilter("All"); }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((c) => (
                <div
                  key={c.id}
                  className="group relative grid grid-cols-[2rem_2.5fr_1.5fr_1fr_1fr_1fr_1fr_2.5rem] cursor-pointer items-start gap-4 bg-surface px-5 py-3.5 transition-colors hover:bg-surface-elevated"
                  onClick={() => setViewCandidate(c)}
                >
                  {/* Checkbox */}
                  <div className="mt-1 flex items-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 accent-primary"
                      checked={selectedIds.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                    />
                  </div>

                  {/* Candidate info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <Avatar name={c.name} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-medium text-foreground group-hover:text-indigo-400 transition-colors">
                          {c.name}
                        </p>
                        {c.rating >= 4 && (
                          <div className="flex shrink-0">
                            {Array.from({ length: Math.min(c.rating, 5) }).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="truncate text-xs text-foreground-subtle">{c.email}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {c.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-full bg-surface-hover px-1.5 py-0.5 text-[10px] text-foreground-subtle">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Applied for */}
                  <p className="mt-1 truncate text-xs font-medium text-foreground-muted">{c.appliedFor}</p>

                  {/* Stage badge */}
                  <div className="mt-0.5">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{ backgroundColor: STAGE_COLORS[c.stage] + "25", color: STAGE_COLORS[c.stage] }}
                    >
                      <Circle className="h-1.5 w-1.5 fill-current shrink-0" />
                      {c.stage}
                    </span>
                  </div>

                  {/* AI Score */}
                  <div className="mt-1">
                    {c.score !== null ? (
                      <div className="flex items-center gap-1.5">
                        <ScoreBadge score={c.score} />
                        <Sparkles className="h-3 w-3 text-violet-400 shrink-0" />
                      </div>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-foreground-subtle">
                        <Sparkles className="h-3 w-3" />Pending
                      </span>
                    )}
                  </div>

                  {/* Source */}
                  <span className={cn("mt-1 text-xs", c.source === "Referral" ? "text-emerald-400 font-medium" : "text-foreground-subtle")}>
                    {c.source}
                  </span>

                  {/* Last activity */}
                  <span className="mt-1 text-xs text-foreground-subtle">{formatRelativeTime(c.lastActivity)}</span>

                  {/* Row menu */}
                  <div className="relative mt-0.5 opacity-0 transition-opacity group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right }); setOpenMenuId(openMenuId === c.id ? null : c.id); }}
                      className="rounded-md p-1 text-foreground-subtle hover:bg-surface-hover hover:text-foreground transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {openMenuId === c.id && (
                      <CandidateMenu
                        candidate={c}
                        onView={() => { setViewCandidate(c); setOpenMenuId(null); }}
                        onEdit={() => { setEditCandidate(c); setOpenMenuId(null); }}
                        onDelete={() => { deleteCandidate(c.id); setOpenMenuId(null); }}
                        onStageChange={(s) => { moveToStage(c.id, s); setOpenMenuId(null); }}
                        onClose={() => setOpenMenuId(null)}
                        anchor={menuPos ?? { top: 0, right: 0 }}
                      />
                    )}
                  </div>

                  {/* AI summary on hover */}
                  {c.summary && (
                    <div className="col-span-full mt-1 hidden pl-12 group-hover:block">
                      <div className="flex items-start gap-1.5 rounded-lg border border-violet-500/15 bg-violet-500/5 px-3 py-2">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
                        <p className="text-xs text-foreground-muted">{c.summary}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <BulkBar
          count={selectedIds.size}
          onMoveStage={bulkMoveStage}
          onEmail={bulkEmail}
          onDelete={bulkDelete}
          onClear={clearAll}
        />
      )}

      {/* Add modal */}
      {showAdd && <CandidateModal onSave={saveCandidate} onClose={() => setShowAdd(false)} />}

      {/* Edit modal */}
      {editCandidate && (
        <CandidateModal candidate={editCandidate} onSave={saveCandidate} onClose={() => setEditCandidate(null)} />
      )}

      {/* Profile drawer */}
      {viewCandidate && (
        <CandidateDrawer
          candidate={viewCandidate}
          onClose={() => setViewCandidate(null)}
          onEdit={() => { setEditCandidate(viewCandidate); setViewCandidate(null); }}
          onDelete={() => deleteCandidate(viewCandidate.id)}
          onStageChange={(s) => moveToStage(viewCandidate.id, s)}
          onRatingChange={(r) => setRating(viewCandidate.id, r)}
        />
      )}
    </div>
  );
}
