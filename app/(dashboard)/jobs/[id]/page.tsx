"use client";

import { useState, useRef, useEffect, useCallback, use } from "react";
import { Header } from "@/components/layout/header";
import { Badge, ScoreBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  DndContext, DragEndEvent, DragOverEvent, DragStartEvent,
  PointerSensor, useSensor, useSensors, DragOverlay, closestCorners,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus, MoreHorizontal, Sparkles, Mail, Calendar, MessageSquare,
  ChevronDown, GripVertical, Search, Star, Clock, User, X, Loader2,
  ArrowLeft, Phone, MapPin, Briefcase, FileText, Filter, SortAsc, List, Kanban,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

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
  email?: string;
  phone?: string;
  location?: string;
}

interface Stage {
  id: string;
  name: string;
  color: string;
  candidates: Candidate[];
  isTerminal?: boolean;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const JOB_DATA: Record<string, { title: string; department: string; status: string; headcount: number }> = {
  "1": { title: "Senior React Developer", department: "Engineering", status: "Open", headcount: 2 },
  "2": { title: "Backend Engineer", department: "Engineering", status: "Open", headcount: 1 },
  "3": { title: "Product Designer", department: "Design", status: "Open", headcount: 1 },
  "4": { title: "DevOps Engineer", department: "Infrastructure", status: "Open", headcount: 1 },
  "8": { title: "Growth Marketer", department: "Marketing", status: "Open", headcount: 1 },
};

const INITIAL_STAGES: Stage[] = [
  {
    id: "applied", name: "Applied", color: "#6366f1",
    candidates: [
      { id: "c1", name: "Maria Santos", role: "React Developer · 5 yrs", score: 82, source: "Referral", appliedAt: new Date(Date.now() - 7200000), tags: ["React", "TypeScript"], hasNotes: false, email: "maria.santos@email.com", phone: "+63 912 345 6789", location: "Quezon City" },
      { id: "c2", name: "Carlo Hernandez", role: "FE Engineer · 3 yrs", score: 67, source: "Email", appliedAt: new Date(Date.now() - 28800000), tags: ["Vue", "React"], hasNotes: true, email: "carlo.h@email.com", location: "Makati" },
      { id: "c3", name: "Bianca Reyes", role: "Web Developer · 4 yrs", score: null, source: "Manual", appliedAt: new Date(Date.now() - 86400000), tags: ["React"], hasNotes: false, email: "bianca.r@email.com" },
    ],
  },
  {
    id: "screening", name: "Screening", color: "#8b5cf6",
    candidates: [
      { id: "c4", name: "James Lim", role: "Senior FE · 6 yrs", score: 88, source: "Referral", appliedAt: new Date(Date.now() - 172800000), tags: ["React", "Next.js", "GraphQL"], hasNotes: true, rating: 4, email: "james.lim@email.com", phone: "+63 917 987 6543", location: "BGC, Taguig" },
      { id: "c5", name: "Sarah Dizon", role: "React Dev · 4 yrs", score: 74, source: "Email", appliedAt: new Date(Date.now() - 259200000), tags: ["React", "TypeScript"], hasNotes: false, email: "sarah.d@email.com" },
    ],
  },
  {
    id: "technical", name: "Technical", color: "#0ea5e9",
    candidates: [
      { id: "c6", name: "Ryan Torres", role: "Lead FE · 7 yrs", score: 91, source: "Referral", appliedAt: new Date(Date.now() - 345600000), tags: ["React", "Next.js", "AWS"], hasNotes: true, rating: 5, email: "ryan.t@email.com", phone: "+63 920 111 2233", location: "Ortigas" },
      { id: "c7", name: "Nina Castro", role: "FE Engineer · 5 yrs", score: 79, source: "Manual", appliedAt: new Date(Date.now() - 432000000), tags: ["React", "Redux"], hasNotes: true, rating: 4, email: "nina.c@email.com" },
    ],
  },
  {
    id: "final", name: "Final Interview", color: "#f59e0b",
    candidates: [
      { id: "c8", name: "Luis Bangayan", role: "Senior FE · 8 yrs", score: 94, source: "Referral", appliedAt: new Date(Date.now() - 720000000), tags: ["React", "Next.js", "System Design"], hasNotes: true, rating: 5, email: "luis.b@email.com", phone: "+63 918 444 5566", location: "Cebu City" },
    ],
  },
  {
    id: "offer", name: "Offer", color: "#10b981",
    candidates: [
      { id: "c9", name: "Anna Mendoza", role: "Senior FE · 6 yrs", score: 90, source: "Referral", appliedAt: new Date(Date.now() - 1080000000), tags: ["React", "TypeScript", "Node.js"], hasNotes: true, rating: 5, email: "anna.m@email.com", phone: "+63 916 777 8899", location: "Makati" },
    ],
  },
  { id: "hired", name: "Hired", color: "#059669", isTerminal: true, candidates: [] },
  { id: "rejected", name: "Rejected", color: "#ef4444", isTerminal: true, candidates: [] },
];

// ─── Candidate Profile Drawer ─────────────────────────────────────────────────

function ProfileDrawer({ candidate, stageName, stageColor, onClose, onEmail, onSchedule }: {
  candidate: Candidate; stageName: string; stageColor: string;
  onClose: () => void; onEmail: () => void; onSchedule: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-border bg-surface shadow-(--shadow-overlay) overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Candidate Profile</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-foreground-subtle hover:bg-surface-elevated transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Hero */}
        <div className="p-5 border-b border-border">
          <div className="flex items-start gap-4">
            <Avatar name={candidate.name} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{candidate.name}</h3>
                  <p className="text-xs text-foreground-subtle">{candidate.role}</p>
                </div>
                {candidate.score !== null && <ScoreBadge score={candidate.score} />}
              </div>
              {candidate.rating && (
                <div className="mt-1.5 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3 w-3 ${i < (candidate.rating ?? 0) ? "fill-yellow-400 text-yellow-400" : "text-border"}`} />
                  ))}
                </div>
              )}
              <div className="mt-2 flex items-center gap-1.5">
                <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: stageColor }}>{stageName}</span>
                {candidate.source === "Referral" && (
                  <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-400">Referral</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-2 p-5 border-b border-border">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Contact</h4>
          {candidate.email && (
            <div className="flex items-center gap-2.5 text-xs text-foreground-muted">
              <Mail className="h-3.5 w-3.5 shrink-0 text-foreground-subtle" />
              <span className="truncate">{candidate.email}</span>
            </div>
          )}
          {candidate.phone && (
            <div className="flex items-center gap-2.5 text-xs text-foreground-muted">
              <Phone className="h-3.5 w-3.5 shrink-0 text-foreground-subtle" />
              {candidate.phone}
            </div>
          )}
          {candidate.location && (
            <div className="flex items-center gap-2.5 text-xs text-foreground-muted">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-foreground-subtle" />
              {candidate.location}
            </div>
          )}
          <div className="flex items-center gap-2.5 text-xs text-foreground-muted">
            <Clock className="h-3.5 w-3.5 shrink-0 text-foreground-subtle" />
            Applied {formatRelativeTime(candidate.appliedAt)}
          </div>
        </div>

        {/* Skills */}
        <div className="p-5 border-b border-border">
          <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Skills</h4>
          <div className="flex flex-wrap gap-1.5">
            {candidate.tags.map((t) => (
              <span key={t} className="rounded-full border border-border bg-surface-elevated px-2.5 py-1 text-xs text-foreground-muted">{t}</span>
            ))}
          </div>
        </div>

        {/* Notes placeholder */}
        <div className="p-5 border-b border-border">
          <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-foreground-subtle">Notes</h4>
          {candidate.hasNotes ? (
            <p className="text-xs text-foreground-subtle">Candidate shows strong experience with React and Next.js. Communication skills are excellent. Recommend proceeding to next round.</p>
          ) : (
            <p className="text-xs text-foreground-subtle italic">No notes yet.</p>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto p-5 flex flex-col gap-2">
          <Button onClick={onEmail} variant="secondary" className="w-full justify-start gap-2">
            <Mail className="h-4 w-4" /> Send email
          </Button>
          <Button onClick={onSchedule} variant="secondary" className="w-full justify-start gap-2">
            <Calendar className="h-4 w-4" /> Schedule interview
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Add Candidate modal ──────────────────────────────────────────────────────

function AddCandidateModal({
  stages, defaultStageId, onAdd, onClose,
}: {
  stages: Stage[]; defaultStageId: string;
  onAdd: (stageId: string, candidate: Candidate) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("Manual");
  const [stageId, setStageId] = useState(defaultStageId);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    const candidate: Candidate = {
      id: "c" + Date.now(),
      name: name.trim(),
      role: role.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      location: location.trim() || undefined,
      score: null,
      source,
      appliedAt: new Date(),
      tags: [],
      hasNotes: false,
    };
    onAdd(stageId, candidate);
    setSaving(false);
  };

  const sel = "flex h-9 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-[var(--color-primary)]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface shadow-(--shadow-overlay)">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Add Candidate</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-foreground-subtle hover:bg-surface-elevated transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 space-y-1.5">
              <label className="block text-xs font-medium text-foreground">Full name <span className="text-red-500">*</span></label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Maria Santos" required autoFocus />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="block text-xs font-medium text-foreground">Role / Experience <span className="text-red-500">*</span></label>
              <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. React Developer · 5 yrs" required />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="candidate@email.com" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63 9XX XXX XXXX" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">Location</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City" />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">Source</label>
              <select value={source} onChange={(e) => setSource(e.target.value)} className={sel}>
                <option>Manual</option>
                <option>Referral</option>
                <option>Email</option>
                <option>LinkedIn</option>
                <option>Job Board</option>
              </select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="block text-xs font-medium text-foreground">Stage</label>
              <select value={stageId} onChange={(e) => setStageId(e.target.value)} className={sel}>
                {stages.filter((s) => !s.isTerminal).map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Adding…</> : "Add candidate"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Schedule modal ───────────────────────────────────────────────────────────

function ScheduleModal({ candidateName, onClose }: { candidateName: string; onClose: () => void }) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [type, setType] = useState("Video Call");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    onClose();
  };

  const sel = "flex h-9 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-[var(--color-primary)]";

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-border bg-surface shadow-(--shadow-overlay)">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">Schedule Interview</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-foreground-subtle hover:bg-surface-elevated transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <p className="text-xs text-foreground-muted">Scheduling interview with <strong className="text-foreground">{candidateName}</strong></p>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground">Date</label>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">Time</label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-foreground">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={sel}>
                <option>Video Call</option>
                <option>Phone Screen</option>
                <option>On-site</option>
                <option>Technical Test</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Scheduling…</> : "Schedule"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Sortable Candidate Card ──────────────────────────────────────────────────

function SortableCandidateCard({
  candidate, stageId, stageColor, onOpenProfile, onEmail, onSchedule,
}: {
  candidate: Candidate; stageId: string; stageColor: string;
  onOpenProfile: (c: Candidate, stageId: string) => void;
  onEmail: (c: Candidate) => void;
  onSchedule: (c: Candidate) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: candidate.id, data: { stageId } });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <CandidateCard
        candidate={candidate}
        stageColor={stageColor}
        dragHandleProps={listeners}
        onOpenProfile={() => onOpenProfile(candidate, stageId)}
        onEmail={() => onEmail(candidate)}
        onSchedule={() => onSchedule(candidate)}
      />
    </div>
  );
}

function CandidateCard({
  candidate, stageColor, dragHandleProps, onOpenProfile, onEmail, onSchedule,
}: {
  candidate: Candidate; stageColor: string;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  onOpenProfile: () => void; onEmail: () => void; onSchedule: () => void;
}) {
  return (
    <div
      className="group relative rounded-lg border border-border bg-surface p-3 transition-all duration-150 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
      onClick={onOpenProfile}
    >
      {/* Left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-lg" style={{ backgroundColor: stageColor }} />

      {/* Drag handle */}
      <div
        className="absolute right-2 top-2 z-10 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
        {...dragHandleProps}
      >
        <GripVertical className="h-3.5 w-3.5 text-foreground-subtle" />
      </div>

      <div className="flex items-start gap-2.5">
        <Avatar name={candidate.name} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-sm font-medium text-foreground truncate">{candidate.name}</p>
            {candidate.rating && (
              <div className="flex shrink-0">
                {Array.from({ length: candidate.rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            )}
          </div>
          <p className="text-[11px] text-foreground-subtle truncate">{candidate.role}</p>
        </div>
        {candidate.score !== null && <ScoreBadge score={candidate.score} />}
      </div>

      {candidate.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {candidate.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-surface-elevated border border-border px-2 py-0.5 text-[10px] text-foreground-muted">{tag}</span>
          ))}
        </div>
      )}

      <div className="mt-2.5 flex items-center justify-between border-t border-border-subtle pt-2">
        <div className="flex items-center gap-1 text-[11px] text-foreground-subtle">
          <Clock className="h-3 w-3" />{formatRelativeTime(candidate.appliedAt)}
        </div>
        <div className="flex items-center gap-1.5">
          {candidate.source === "Referral" && <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-400">Ref</span>}
          {candidate.hasNotes && <MessageSquare className="h-3 w-3 text-foreground-subtle" />}
          {candidate.score !== null && <Sparkles className="h-3 w-3 text-violet-400" />}
        </div>
      </div>

      {/* Hover actions */}
      <div
        className="absolute inset-x-0 bottom-0 flex translate-y-full gap-1 rounded-b-lg bg-surface-elevated px-2 py-1.5 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100 border-t border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onEmail} className="flex flex-1 items-center justify-center gap-1 rounded py-1 text-[10px] text-foreground-muted hover:text-primary transition-colors">
          <Mail className="h-3 w-3" /> Email
        </button>
        <button onClick={onSchedule} className="flex flex-1 items-center justify-center gap-1 rounded py-1 text-[10px] text-foreground-muted hover:text-primary transition-colors">
          <Calendar className="h-3 w-3" /> Schedule
        </button>
        <button onClick={onOpenProfile} className="flex flex-1 items-center justify-center gap-1 rounded py-1 text-[10px] text-foreground-muted hover:text-primary transition-colors">
          <User className="h-3 w-3" /> Profile
        </button>
      </div>
    </div>
  );
}

// ─── Stage Column ─────────────────────────────────────────────────────────────

function StageColumn({
  stage, searchQuery, onAddCandidate, onOpenProfile, onEmail, onSchedule,
}: {
  stage: Stage; searchQuery: string;
  onAddCandidate: (stageId: string) => void;
  onOpenProfile: (c: Candidate, stageId: string) => void;
  onEmail: (c: Candidate) => void;
  onSchedule: (c: Candidate) => void;
}) {
  const filtered = stage.candidates.filter((c) => {
    const q = searchQuery.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q));
  });

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-xl bg-surface border border-border">
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
          <span className="text-xs font-semibold text-foreground">{stage.name}</span>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white" style={{ backgroundColor: stage.color }}>
            {filtered.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {!stage.isTerminal && (
            <button
              onClick={() => onAddCandidate(stage.id)}
              className="rounded p-1 text-foreground-subtle hover:bg-surface-elevated hover:text-primary transition-colors"
              title="Add candidate to this stage"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      <SortableContext items={filtered.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2 overflow-y-auto p-2" style={{ maxHeight: "calc(100vh - 220px)" }}>
          {filtered.map((candidate) => (
            <SortableCandidateCard
              key={candidate.id}
              candidate={candidate}
              stageId={stage.id}
              stageColor={stage.color}
              onOpenProfile={onOpenProfile}
              onEmail={onEmail}
              onSchedule={onSchedule}
            />
          ))}

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border p-6 text-center">
              <p className="text-xs text-foreground-subtle">
                {searchQuery ? "No matches" : stage.isTerminal ? "No candidates yet" : "Drag candidates here"}
              </p>
            </div>
          )}

          {!stage.isTerminal && (
            <button
              onClick={() => onAddCandidate(stage.id)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-foreground-subtle hover:bg-surface-elevated hover:text-primary transition-colors w-full"
            >
              <Plus className="h-3.5 w-3.5" /> Add candidate
            </button>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

// ─── List View Row ────────────────────────────────────────────────────────────

function ListRow({
  candidate, stageName, stageColor, onOpenProfile, onEmail, onSchedule,
}: {
  candidate: Candidate; stageName: string; stageColor: string;
  onOpenProfile: () => void; onEmail: () => void; onSchedule: () => void;
}) {
  return (
    <div
      className="group flex items-center gap-4 border-b border-border-subtle px-4 py-3 hover:bg-surface-elevated cursor-pointer transition-colors"
      onClick={onOpenProfile}
    >
      <Avatar name={candidate.name} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-foreground truncate">{candidate.name}</p>
          {candidate.rating && (
            <div className="flex shrink-0">
              {Array.from({ length: candidate.rating }).map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
            </div>
          )}
        </div>
        <p className="text-[11px] text-foreground-subtle truncate">{candidate.role}</p>
      </div>
      <div className="hidden md:flex items-center gap-1.5">
        {candidate.tags.slice(0, 2).map((t) => (
          <span key={t} className="rounded-full bg-surface-elevated border border-border px-2 py-0.5 text-[10px] text-foreground-muted">{t}</span>
        ))}
      </div>
      <div className="shrink-0">
        <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: stageColor }}>{stageName}</span>
      </div>
      {candidate.score !== null ? <ScoreBadge score={candidate.score} /> : <div className="w-12" />}
      <p className="hidden sm:block shrink-0 text-[11px] text-foreground-subtle">{formatRelativeTime(candidate.appliedAt)}</p>
      <div className="flex opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
        <button onClick={onEmail} className="rounded p-1.5 text-foreground-subtle hover:text-primary hover:bg-surface-elevated transition-colors" title="Send email"><Mail className="h-3.5 w-3.5" /></button>
        <button onClick={onSchedule} className="rounded p-1.5 text-foreground-subtle hover:text-primary hover:bg-surface-elevated transition-colors" title="Schedule"><Calendar className="h-3.5 w-3.5" /></button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function JobPipelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const job = JOB_DATA[id] ?? { title: "Job Pipeline", department: "Engineering", status: "Open", headcount: 1 };

  const [stages, setStages] = useState<Stage[]>(INITIAL_STAGES);
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [search, setSearch] = useState("");
  const [sortByScore, setSortByScore] = useState(false);
  const [addCandidateStageId, setAddCandidateStageId] = useState<string | null>(null);
  const [profileCandidate, setProfileCandidate] = useState<{ candidate: Candidate; stageId: string } | null>(null);
  const [scheduleCandidate, setScheduleCandidate] = useState<Candidate | null>(null);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const totalCandidates = stages.reduce((s, st) => s + st.candidates.length, 0);

  // Sort stages by score if toggle is on
  const displayStages = sortByScore
    ? stages.map((st) => ({ ...st, candidates: [...st.candidates].sort((a, b) => (b.score ?? -1) - (a.score ?? -1)) }))
    : stages;

  // Find which stage a candidate belongs to
  function findStageByCandidate(candidateId: string) {
    return stages.find((st) => st.candidates.some((c) => c.id === candidateId));
  }

  function handleDragStart(event: DragStartEvent) {
    const stage = findStageByCandidate(event.active.id as string);
    const candidate = stage?.candidates.find((c) => c.id === event.active.id);
    if (candidate) setActiveCandidate(candidate);
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeStage = findStageByCandidate(active.id as string);
    let overStage = findStageByCandidate(over.id as string);
    if (!overStage) overStage = stages.find((s) => s.id === over.id);
    if (!activeStage || !overStage || activeStage.id === overStage.id) return;

    setStages((prev) => {
      const newStages = prev.map((s) => ({ ...s, candidates: [...s.candidates] }));
      const fromStage = newStages.find((s) => s.id === activeStage.id)!;
      const toStage = newStages.find((s) => s.id === overStage!.id)!;
      const candidateIdx = fromStage.candidates.findIndex((c) => c.id === active.id);
      if (candidateIdx === -1) return prev;
      const [moved] = fromStage.candidates.splice(candidateIdx, 1);
      toStage.candidates.push(moved);
      return newStages;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCandidate(null);
    if (!over || active.id === over.id) return;

    setStages((prev) => {
      const newStages = prev.map((s) => ({ ...s, candidates: [...s.candidates] }));
      const stage = newStages.find((s) => s.candidates.some((c) => c.id === active.id));
      if (!stage) return prev;
      const oldIdx = stage.candidates.findIndex((c) => c.id === active.id);
      const newIdx = stage.candidates.findIndex((c) => c.id === over.id);
      if (oldIdx !== -1 && newIdx !== -1) {
        stage.candidates = arrayMove(stage.candidates, oldIdx, newIdx);
      }
      return newStages;
    });
  }

  function handleAddCandidate(stageId: string, candidate: Candidate) {
    setStages((prev) => prev.map((s) => s.id === stageId ? { ...s, candidates: [...s.candidates, candidate] } : s));
    setAddCandidateStageId(null);
  }

  function handleEmail(candidate: Candidate) {
    if (candidate.email) {
      window.location.href = `mailto:${candidate.email}`;
    }
  }

  const profileStage = profileCandidate ? stages.find((s) => s.id === profileCandidate.stageId) : null;

  // All candidates flat list for list view
  const allCandidates = stages.flatMap((st) =>
    st.candidates
      .filter((c) => {
        const q = search.toLowerCase();
        return !q || c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q);
      })
      .map((c) => ({ ...c, stageId: st.id, stageName: st.name, stageColor: st.color }))
  ).sort((a, b) => sortByScore ? (b.score ?? -1) - (a.score ?? -1) : 0);

  return (
    <>
      {/* Modals */}
      {addCandidateStageId !== null && (
        <AddCandidateModal
          stages={stages}
          defaultStageId={addCandidateStageId}
          onAdd={handleAddCandidate}
          onClose={() => setAddCandidateStageId(null)}
        />
      )}
      {scheduleCandidate && (
        <ScheduleModal candidateName={scheduleCandidate.name} onClose={() => setScheduleCandidate(null)} />
      )}
      {profileCandidate && profileStage && (
        <ProfileDrawer
          candidate={profileCandidate.candidate}
          stageName={profileStage.name}
          stageColor={profileStage.color}
          onClose={() => setProfileCandidate(null)}
          onEmail={() => handleEmail(profileCandidate.candidate)}
          onSchedule={() => { setScheduleCandidate(profileCandidate.candidate); setProfileCandidate(null); }}
        />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          title={job.title}
          subtitle={`${job.department} | ${job.headcount} headcount | ${job.status} | Req #${id}`}
          breadcrumbs={[{ label: "Jobs", href: "/jobs" }, { label: job.title }]}
          actions={
            <>
              {/* View toggle */}
              <div className="flex rounded-md border border-border overflow-hidden">
                <button
                  onClick={() => setView("kanban")}
                  className={cn("flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors", view === "kanban" ? "bg-primary text-white" : "text-foreground-muted hover:text-foreground")}
                >
                  <Kanban className="h-3.5 w-3.5" /> Kanban
                </button>
                <button
                  onClick={() => setView("list")}
                  className={cn("flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors", view === "list" ? "bg-primary text-white" : "text-foreground-muted hover:text-foreground")}
                >
                  <List className="h-3.5 w-3.5" /> List
                </button>
              </div>
              <Button size="sm" onClick={() => setAddCandidateStageId("applied")}>
                <Plus className="h-4 w-4" /> Add Candidate
              </Button>
            </>
          }
        />

        {/* Stats bar */}
        <div className="flex items-center gap-6 border-b border-border bg-surface px-6 py-2 overflow-x-auto">
          {stages.map((stage) => (
            <div key={stage.id} className="flex shrink-0 items-center gap-1.5">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: stage.color }} />
              <span className="text-xs text-foreground-subtle">{stage.name}</span>
              <span className="text-xs font-semibold text-foreground">{stage.candidates.length}</span>
            </div>
          ))}
          <div className="ml-auto shrink-0 text-xs text-foreground-subtle">{totalCandidates} total</div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-6 py-3">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-subtle" />
            <Input className="h-8 pl-9 text-xs" placeholder="Search in pipeline..." value={search} onChange={(e) => setSearch(e.target.value)} />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <Button
            variant={sortByScore ? "primary" : "secondary"}
            size="sm"
            onClick={() => setSortByScore((v) => !v)}
          >
            <SortAsc className="h-4 w-4" /> {sortByScore ? "Sorted by score" : "Sort by score"}
          </Button>
          <Badge variant="info">Interview loop in progress</Badge>
          <span className="ml-auto text-xs text-foreground-subtle">Updated just now</span>
        </div>

        {/* Kanban board */}
        {view === "kanban" && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex flex-1 gap-3 overflow-x-auto p-6 pb-8">
              {displayStages.map((stage) => (
                <StageColumn
                  key={stage.id}
                  stage={stage}
                  searchQuery={search}
                  onAddCandidate={(stageId) => setAddCandidateStageId(stageId)}
                  onOpenProfile={(c, stageId) => setProfileCandidate({ candidate: c, stageId })}
                  onEmail={handleEmail}
                  onSchedule={(c) => setScheduleCandidate(c)}
                />
              ))}
            </div>
            <DragOverlay>
              {activeCandidate && (
                <div className="rotate-2 opacity-90">
                  <CandidateCard
                    candidate={activeCandidate}
                    stageColor="#6366f1"
                    onOpenProfile={() => {}}
                    onEmail={() => {}}
                    onSchedule={() => {}}
                  />
                </div>
              )}
            </DragOverlay>
          </DndContext>
        )}

        {/* List view */}
        {view === "list" && (
          <div className="flex-1 overflow-y-auto">
            <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-border bg-surface px-4 py-2">
              <span className="w-8" />
              <span className="flex-1 text-[10px] font-semibold uppercase tracking-wide text-foreground-subtle">Candidate</span>
              <span className="hidden md:block w-32 text-[10px] font-semibold uppercase tracking-wide text-foreground-subtle">Skills</span>
              <span className="w-28 text-[10px] font-semibold uppercase tracking-wide text-foreground-subtle">Stage</span>
              <span className="w-12 text-[10px] font-semibold uppercase tracking-wide text-foreground-subtle">Score</span>
              <span className="hidden sm:block w-20 text-[10px] font-semibold uppercase tracking-wide text-foreground-subtle">Applied</span>
              <span className="w-16" />
            </div>
            {allCandidates.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <Search className="h-10 w-10 text-foreground-subtle opacity-40" />
                <p className="text-sm text-foreground-subtle">No candidates match your search</p>
                <Button variant="secondary" size="sm" onClick={() => setSearch("")}>Clear search</Button>
              </div>
            )}
            {allCandidates.map((c) => (
              <ListRow
                key={c.id}
                candidate={c}
                stageName={c.stageName}
                stageColor={c.stageColor}
                onOpenProfile={() => setProfileCandidate({ candidate: c, stageId: c.stageId })}
                onEmail={() => handleEmail(c)}
                onSchedule={() => setScheduleCandidate(c)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
