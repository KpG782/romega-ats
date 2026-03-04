"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Badge, ScoreBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { cn, formatRelativeTime } from "@/lib/utils";
import {
  Plus, Search, Sparkles, Bookmark, BookmarkCheck, Filter, X,
  MoreHorizontal, Edit2, Trash2, Mail, Phone, MapPin, Calendar,
  SortAsc, ChevronDown, Check, ArrowRight, ChevronRight,
  UserPlus, SlidersHorizontal, Star, Zap, Flame, Snowflake,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
type TalentStatus = "Hot" | "Warm" | "Cold";
type AvailStatus  = "Actively Looking" | "Open to Offers" | "Not Looking";

interface TalentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  role: string;
  score: number | null;
  status: TalentStatus;
  availability: AvailStatus;
  tags: string[];
  rating: number;
  saved: boolean;
  lastContact: Date;
  notes: string;
  summary: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mock data layer
// Swap INITIAL_TALENT and CRUD helpers for real API calls when adding a backend:
//   GET    /api/talent-pool            → list
//   POST   /api/talent-pool            → create
//   PATCH  /api/talent-pool/:id        → update
//   DELETE /api/talent-pool/:id        → delete
//   POST   /api/talent-pool/:id/promote → convert to active candidate pipeline
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_META: Record<TalentStatus, { label: string; color: string; icon: string }> = {
  Hot:  { label: "Hot",  color: "#ef4444", icon: "flame"    },
  Warm: { label: "Warm", color: "#f59e0b", icon: "zap"      },
  Cold: { label: "Cold", color: "#94a3b8", icon: "snowflake" },
};

const AVAIL_META: Record<AvailStatus, { color: string }> = {
  "Actively Looking": { color: "#22c55e" },
  "Open to Offers":   { color: "#f59e0b" },
  "Not Looking":      { color: "#94a3b8" },
};

const ALL_STATUSES: TalentStatus[] = ["Hot", "Warm", "Cold"];
const ALL_AVAIL: AvailStatus[]     = ["Actively Looking", "Open to Offers", "Not Looking"];

const INITIAL_TALENT: TalentProfile[] = [
  { id: "1", name: "Pat Reyes",      email: "pat.reyes@email.com",      phone: "+63 917 111 2222", location: "Makati, PH",    role: "Senior Frontend Engineer", score: 92, status: "Hot",  availability: "Actively Looking", tags: ["React", "Next.js", "Design Systems"], rating: 5, saved: true,  lastContact: new Date(Date.now()-1000*60*60*3),  notes: "Had a great intro call. Interested in remote-first companies.", summary: "Top-tier frontend lead. Designed and shipped a full design system at a Series B. Strong culture fit." },
  { id: "2", name: "Mika Santos",    email: "mika.santos@gmail.com",     phone: "+63 918 222 3333", location: "BGC, Taguig",   role: "Product Designer",         score: 86, status: "Warm", availability: "Open to Offers",   tags: ["Figma", "UX Research", "Prototyping"], rating: 4, saved: true,  lastContact: new Date(Date.now()-1000*60*60*24), notes: "", summary: "Strong product sense combined with execution chops. Would excel on any product team." },
  { id: "3", name: "Leo Cruz",       email: "leo.cruz@outlook.com",      phone: "+63 919 333 4444", location: "Quezon City, PH",role: "DevOps Engineer",          score: 78, status: "Warm", availability: "Open to Offers",   tags: ["AWS", "Terraform", "Kubernetes"],       rating: 3, saved: false, lastContact: new Date(Date.now()-1000*60*60*48), notes: "", summary: null },
  { id: "4", name: "Ivy Gomez",      email: "ivy.gomez@proton.me",       phone: "+63 920 444 5555", location: "Cebu City, PH", role: "Backend Engineer",         score: 69, status: "Cold", availability: "Not Looking",      tags: ["Node.js", "Postgres", "Queues"],        rating: 2, saved: false, lastContact: new Date(Date.now()-1000*60*60*72), notes: "Not ready to move yet, check back in Q3.", summary: null },
  { id: "5", name: "Marco Dela Cruz",email: "marco.dc@email.com",        phone: "+63 921 555 6666", location: "Pasig, PH",     role: "Full-Stack Engineer",      score: 88, status: "Hot",  availability: "Actively Looking", tags: ["React", "Node.js", "PostgreSQL", "6 yrs"], rating: 5, saved: true,  lastContact: new Date(Date.now()-1000*60*60*5),  notes: "Referred by James Lim. High priority.", summary: "Excellent full-stack generalist. Delivered 3 production apps as a sole developer." },
  { id: "6", name: "Dana Aquino",    email: "dana.aquino@gmail.com",     phone: "+63 922 666 7777", location: "Mandaluyong, PH",role: "Data Engineer",            score: 81, status: "Warm", availability: "Open to Offers",   tags: ["Python", "Spark", "dbt", "BigQuery"],   rating: 4, saved: false, lastContact: new Date(Date.now()-1000*60*60*30), notes: "", summary: "Experienced in building data pipelines at scale. Strong SQL and Python skills." },
];

let _nextId = 7;
function generateId() { return String(_nextId++); }

// ─────────────────────────────────────────────────────────────────────────────
// useClickOutside
// ─────────────────────────────────────────────────────────────────────────────
function useClickOutside(cb: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) cb(); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [cb]);
  return ref;
}

// ─────────────────────────────────────────────────────────────────────────────
// Status icon helper
// ─────────────────────────────────────────────────────────────────────────────
function StatusIcon({ status, className }: { status: TalentStatus; className?: string }) {
  if (status === "Hot")  return <Flame     className={cn("h-3.5 w-3.5", className)} />;
  if (status === "Warm") return <Zap       className={cn("h-3.5 w-3.5", className)} />;
  return                        <Snowflake className={cn("h-3.5 w-3.5", className)} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// Add / Edit Modal
// ─────────────────────────────────────────────────────────────────────────────
function ProfileModal({
  profile,
  onSave,
  onClose,
}: {
  profile?: TalentProfile;
  onSave: (p: TalentProfile) => void;
  onClose: () => void;
}) {
  const [name, setName]             = useState(profile?.name ?? "");
  const [email, setEmail]           = useState(profile?.email ?? "");
  const [phone, setPhone]           = useState(profile?.phone ?? "");
  const [location, setLocation]     = useState(profile?.location ?? "");
  const [role, setRole]             = useState(profile?.role ?? "");
  const [status, setStatus]         = useState<TalentStatus>(profile?.status ?? "Warm");
  const [availability, setAvail]    = useState<AvailStatus>(profile?.availability ?? "Open to Offers");
  const [tagsRaw, setTagsRaw]       = useState(profile?.tags.join(", ") ?? "");
  const [notes, setNotes]           = useState(profile?.notes ?? "");
  const isEdit = !!profile;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      id:           profile?.id ?? generateId(),
      name:         name.trim(),
      email:        email.trim(),
      phone:        phone.trim(),
      location:     location.trim(),
      role:         role.trim(),
      score:        profile?.score ?? null,
      status,
      availability,
      tags:         tagsRaw.split(",").map((t) => t.trim()).filter(Boolean),
      rating:       profile?.rating ?? 0,
      saved:        profile?.saved ?? false,
      lastContact:  new Date(),
      notes,
      summary:      profile?.summary ?? null,
    });
  }

  const lbl = "block text-xs font-medium text-foreground mb-1";
  const sel = "w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface shadow-(--shadow-overlay)" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold text-foreground">{isEdit ? "Edit Profile" : "Add to Talent Pool"}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-foreground-subtle hover:bg-surface-elevated transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5 max-h-[72vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Full Name <span className="text-red-500">*</span></label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pat Reyes" required />
            </div>
            <div>
              <label className={lbl}>Email <span className="text-red-500">*</span></label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+63 917 ..." />
            </div>
            <div>
              <label className={lbl}>Location</label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
            </div>
          </div>
          <div>
            <label className={lbl}>Role / Title <span className="text-red-500">*</span></label>
            <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Senior Frontend Engineer" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl}>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as TalentStatus)} className={sel}>
                {ALL_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl}>Availability</label>
              <select value={availability} onChange={(e) => setAvail(e.target.value as AvailStatus)} className={sel}>
                {ALL_AVAIL.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={lbl}>Skills / Tags <span className="text-foreground-subtle font-normal">(comma-separated)</span></label>
            <Input value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} placeholder="React, TypeScript, 5 yrs" />
          </div>
          <div>
            <label className={lbl}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Recruiter notes, sourcing context…"
              rows={3}
              className="w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-foreground-subtle"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm">{isEdit ? "Save Changes" : "Add Profile"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Profile Drawer
// ─────────────────────────────────────────────────────────────────────────────
function ProfileDrawer({
  profile,
  onClose,
  onEdit,
  onDelete,
  onStatusChange,
  onRatingChange,
  onToggleSaved,
  onPromote,
}: {
  profile: TalentProfile;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onStatusChange: (s: TalentStatus) => void;
  onRatingChange: (r: number) => void;
  onToggleSaved: () => void;
  onPromote: () => void;
}) {
  const [schedPane, setSchedPane] = useState(false);
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");
  const [schedType, setSchedType] = useState("Video Call");
  const [scheduled, setScheduled] = useState(false);
  const [promoted, setPromoted]   = useState(false);

  function confirmSchedule(e: React.FormEvent) {
    e.preventDefault();
    setScheduled(true); setSchedPane(false);
    setTimeout(() => setScheduled(false), 3000);
  }

  function handlePromote() {
    onPromote();
    setPromoted(true);
    setTimeout(() => { setPromoted(false); onClose(); }, 1500);
  }

  return (
    <div className="fixed inset-0 z-50 flex" onClick={onClose}>
      <div className="flex-1 bg-black/30 backdrop-blur-[2px]" />
      <div
        className="relative z-10 flex h-full w-full max-w-sm flex-col border-l border-border bg-surface shadow-(--shadow-overlay) overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4 sticky top-0 bg-surface z-10">
          <span className="text-xs font-semibold uppercase tracking-widest text-foreground-subtle">Talent Profile</span>
          <div className="flex items-center gap-1">
            <button onClick={onToggleSaved} className={cn("rounded-lg p-1.5 transition-colors", profile.saved ? "text-amber-400 hover:text-amber-300" : "text-foreground-subtle hover:bg-surface-elevated")} title={profile.saved ? "Unsave" : "Save"}>
              {profile.saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>
            <button onClick={onEdit} className="rounded-lg p-1.5 text-foreground-subtle hover:bg-surface-elevated transition-colors" title="Edit"><Edit2 className="h-4 w-4" /></button>
            <button onClick={onClose} className="rounded-lg p-1.5 text-foreground-subtle hover:bg-surface-elevated transition-colors"><X className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-5">
          {/* Identity */}
          <div className="flex items-start gap-3">
            <Avatar name={profile.name} size="lg" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{profile.name}</p>
              <p className="text-xs text-foreground-subtle mt-0.5">{profile.role}</p>
              <div className="mt-1.5 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button key={i} onClick={() => onRatingChange(i + 1)}>
                    <Star className={`h-3.5 w-3.5 transition-colors ${i < profile.rating ? "fill-yellow-400 text-yellow-400" : "text-border fill-transparent"}`} />
                  </button>
                ))}
              </div>
            </div>
            {profile.score !== null && <ScoreBadge score={profile.score} />}
          </div>

          {/* Status + availability */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="mb-1.5 text-xs font-medium text-foreground-subtle">Talent Status</p>
              <div className="flex gap-1.5">
                {ALL_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => onStatusChange(s)}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium border transition-all",
                      profile.status === s ? "border-transparent text-white" : "border-border text-foreground-muted hover:text-foreground"
                    )}
                    style={profile.status === s ? { backgroundColor: STATUS_META[s].color } : undefined}
                  >
                    <StatusIcon status={s} /> {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium text-foreground-subtle">Availability</p>
              <span className="inline-block rounded-full px-2 py-0.5 text-xs font-medium border border-border text-foreground-muted" style={{ color: AVAIL_META[profile.availability].color }}>
                {profile.availability}
              </span>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground-subtle">Contact</p>
            <a href={`mailto:${profile.email}`} className="flex items-center gap-2 text-xs text-foreground-muted hover:text-primary transition-colors">
              <Mail className="h-3.5 w-3.5 shrink-0" />{profile.email}
            </a>
            {profile.phone && (
              <div className="flex items-center gap-2 text-xs text-foreground-muted">
                <Phone className="h-3.5 w-3.5 shrink-0" />{profile.phone}
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-2 text-xs text-foreground-muted">
                <MapPin className="h-3.5 w-3.5 shrink-0" />{profile.location}
              </div>
            )}
          </div>

          {/* Tags */}
          {profile.tags.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-medium text-foreground-subtle">Skills & Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {profile.tags.map((t) => (
                  <span key={t} className="rounded-full border border-border px-2 py-0.5 text-xs text-foreground-muted">{t}</span>
                ))}
              </div>
            </div>
          )}

          {/* Last contact */}
          <div>
            <p className="text-xs font-medium text-foreground-subtle mb-0.5">Last Contact</p>
            <p className="text-xs text-foreground-muted">{formatRelativeTime(profile.lastContact)}</p>
          </div>

          {/* AI summary */}
          {profile.summary && (
            <div className="rounded-lg border border-violet-500/15 bg-violet-500/5 p-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                <span className="text-xs font-semibold text-violet-400">AI Assessment</span>
              </div>
              <p className="text-xs text-foreground-muted leading-relaxed">{profile.summary}</p>
            </div>
          )}

          {/* Notes */}
          <div>
            <p className="mb-1.5 text-xs font-medium text-foreground-subtle">Notes</p>
            {profile.notes
              ? <p className="text-xs text-foreground-muted leading-relaxed whitespace-pre-wrap">{profile.notes}</p>
              : <p className="text-xs text-foreground-subtle italic">No notes yet — edit to add.</p>
            }
          </div>

          {/* Schedule pane */}
          {schedPane && (
            <form onSubmit={confirmSchedule} className="rounded-xl border border-border bg-surface-elevated p-4 space-y-3">
              <p className="text-xs font-semibold text-foreground">Schedule Outreach</p>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Date</label>
                <Input type="date" value={schedDate} onChange={(e) => setSchedDate(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Time</label>
                <Input type="time" value={schedTime} onChange={(e) => setSchedTime(e.target.value)} required />
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">Type</label>
                <select value={schedType} onChange={(e) => setSchedType(e.target.value)} className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary">
                  {["Video Call","Phone Screen","Coffee Chat","Technical Review"].map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <Button type="submit" size="sm" className="flex-1 justify-center">Confirm</Button>
                <Button type="button" size="sm" variant="secondary" onClick={() => setSchedPane(false)}>Cancel</Button>
              </div>
            </form>
          )}

          {scheduled && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
              <Check className="h-3.5 w-3.5" /> Outreach scheduled!
            </div>
          )}
          {promoted && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-400">
              <Check className="h-3.5 w-3.5" /> Promoted to active pipeline!
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2 border-t border-border pt-4">
            <Button size="sm" className="w-full justify-center" onClick={() => window.location.href = `mailto:${profile.email}`}>
              <Mail className="h-4 w-4" /> Send Email
            </Button>
            <Button size="sm" variant="secondary" className="w-full justify-center" onClick={() => setSchedPane((p) => !p)}>
              <Calendar className="h-4 w-4" /> Schedule Outreach
            </Button>
            <Button size="sm" variant="secondary" className="w-full justify-center" onClick={handlePromote}>
              <UserPlus className="h-4 w-4" /> Promote to Pipeline
            </Button>
            <button
              onClick={() => { if (confirm(`Remove ${profile.name} from talent pool?`)) { onDelete(); onClose(); } }}
              className="mt-1 flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Row context menu
// ─────────────────────────────────────────────────────────────────────────────
function ProfileMenu({
  profile, onView, onEdit, onDelete, onStatusChange, onToggleSaved, onPromote, onClose, anchor,
}: {
  profile: TalentProfile;
  onView: () => void; onEdit: () => void; onDelete: () => void;
  onStatusChange: (s: TalentStatus) => void;
  onToggleSaved: () => void; onPromote: () => void; onClose: () => void;
  anchor: { top: number; right: number };
}) {
  const [statusOpen, setStatusOpen] = useState(false);
  const ref = useClickOutside(onClose);
  const row = "flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-foreground-muted hover:bg-surface-elevated hover:text-foreground transition-colors text-left";

  return (
    <div ref={ref} className="z-9999 min-w-48 rounded-xl border border-border bg-surface py-1 shadow-(--shadow-elevated)" style={{ position: 'fixed', top: anchor.top, right: anchor.right }}>
      <button onClick={() => { onView(); onClose(); }} className={row}><Edit2 className="h-3.5 w-3.5" /> View Profile</button>
      <button onClick={() => { onEdit(); onClose(); }} className={row}><Edit2 className="h-3.5 w-3.5" /> Edit</button>
      <button onClick={() => { window.location.href = `mailto:${profile.email}`; onClose(); }} className={row}><Mail className="h-3.5 w-3.5" /> Send Email</button>
      <button onClick={() => { onToggleSaved(); onClose(); }} className={row}>
        {profile.saved ? <BookmarkCheck className="h-3.5 w-3.5 text-amber-400" /> : <Bookmark className="h-3.5 w-3.5" />}
        {profile.saved ? "Unsave" : "Save"}
      </button>
      <div className="relative">
        <button onClick={() => setStatusOpen((p) => !p)} className={cn(row, "justify-between")}>
          <span className="flex items-center gap-2"><Zap className="h-3.5 w-3.5" /> Set Status</span>
          <ChevronRight className="h-3 w-3" />
        </button>
        {statusOpen && (
          <div className="absolute left-full top-0 z-50 min-w-36 rounded-xl border border-border bg-surface py-1 shadow-(--shadow-elevated)">
            {ALL_STATUSES.map((s) => (
              <button key={s} onClick={() => { onStatusChange(s); onClose(); }} className={cn(row, profile.status === s && "text-primary font-medium")}>
                {profile.status === s ? <Check className="h-3.5 w-3.5 text-primary" /> : <span className="w-3.5" />}
                <StatusIcon status={s} style={{ color: STATUS_META[s].color }} />
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
      <button onClick={() => { onPromote(); onClose(); }} className={row}><UserPlus className="h-3.5 w-3.5" /> Promote to Pipeline</button>
      <div className="my-1 border-t border-border" />
      <button onClick={() => { if (confirm(`Remove ${profile.name}?`)) onDelete(); onClose(); }} className={cn(row, "text-red-400 hover:text-red-300")}>
        <Trash2 className="h-3.5 w-3.5" /> Remove
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Bulk action bar
// ─────────────────────────────────────────────────────────────────────────────
function BulkBar({ count, onStatus, onEmail, onDelete, onClear }: {
  count: number;
  onStatus: (s: TalentStatus) => void;
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
            <Zap className="h-3.5 w-3.5" /> Set Status <ChevronDown className="h-3 w-3" />
          </Button>
          {open && (
            <div className="absolute bottom-full mb-2 left-0 min-w-36 rounded-xl border border-border bg-surface py-1 shadow-(--shadow-overlay)">
              {ALL_STATUSES.map((s) => (
                <button key={s} onClick={() => { onStatus(s); setOpen(false); }} className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-foreground-muted hover:bg-surface-elevated hover:text-foreground transition-colors">
                  <StatusIcon status={s} style={{ color: STATUS_META[s].color }} /> {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <Button size="sm" variant="secondary" onClick={onEmail}><Mail className="h-3.5 w-3.5" /> Email All</Button>
        <Button size="sm" variant="secondary" onClick={onDelete} className="text-red-400 hover:text-red-300"><Trash2 className="h-3.5 w-3.5" /> Remove</Button>
        <button onClick={onClear} className="ml-1 rounded-lg p-1 text-foreground-subtle hover:text-foreground transition-colors"><X className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────
export default function TalentPoolPage() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [pool, setPool]                   = useState<TalentProfile[]>(INITIAL_TALENT);
  const [search, setSearch]               = useState("");
  const [statusFilter, setStatusFilter]   = useState<TalentStatus | "All">("All");
  const [availFilter, setAvailFilter]     = useState<AvailStatus | "All">("All");
  const [savedOnly, setSavedOnly]         = useState(false);
  const [sortMode, setSortMode]           = useState<"none" | "score" | "name" | "recent">("none");
  const [showFilters, setShowFilters]     = useState(false);
  const [showAdd, setShowAdd]             = useState(false);
  const [editProfile, setEditProfile]     = useState<TalentProfile | null>(null);
  const [viewProfile, setViewProfile]     = useState<TalentProfile | null>(null);
  const [openMenuId, setOpenMenuId]       = useState<string | null>(null);
  const [menuPos, setMenuPos]             = useState<{top: number; right: number} | null>(null);
  const [selectedIds, setSelectedIds]     = useState<Set<string>>(new Set());
  const [sortOpen, setSortOpen]           = useState(false);
  const [aiShortlist, setAiShortlist]     = useState(false);
  const sortRef = useClickOutside(() => setSortOpen(false));

  // ── Derived list ───────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = pool.filter((p) => {
      if (savedOnly && !p.saved) return false;
      const q = search.toLowerCase();
      if (q && !p.name.toLowerCase().includes(q) && !p.role.toLowerCase().includes(q) && !p.location.toLowerCase().includes(q) && !p.tags.some((t) => t.toLowerCase().includes(q))) return false;
      if (statusFilter !== "All" && p.status !== statusFilter) return false;
      if (availFilter !== "All" && p.availability !== availFilter) return false;
      return true;
    });
    if (aiShortlist) list = list.filter((p) => p.score !== null && p.score >= 80);
    if (sortMode === "score")  list = [...list].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
    if (sortMode === "name")   list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sortMode === "recent") list = [...list].sort((a, b) => b.lastContact.getTime() - a.lastContact.getTime());
    return list;
  }, [pool, search, statusFilter, availFilter, savedOnly, sortMode, aiShortlist]);

  const activeFilterCount = (statusFilter !== "All" ? 1 : 0) + (availFilter !== "All" ? 1 : 0) + (savedOnly ? 1 : 0);

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const saveProfile = useCallback((p: TalentProfile) => {
    setPool((prev) => prev.some((x) => x.id === p.id) ? prev.map((x) => x.id === p.id ? p : x) : [...prev, p]);
    setShowAdd(false); setEditProfile(null);
    setViewProfile((prev) => prev?.id === p.id ? p : prev);
  }, []);

  const deleteProfile = useCallback((id: string) => {
    setPool((prev) => prev.filter((p) => p.id !== id));
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    setViewProfile((prev) => prev?.id === id ? null : prev);
  }, []);

  const setStatus = useCallback((id: string, status: TalentStatus) => {
    setPool((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
    setViewProfile((prev) => prev?.id === id ? { ...prev, status } : prev);
  }, []);

  const setRating = useCallback((id: string, rating: number) => {
    setPool((prev) => prev.map((p) => p.id === id ? { ...p, rating } : p));
    setViewProfile((prev) => prev?.id === id ? { ...prev, rating } : prev);
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setPool((prev) => prev.map((p) => p.id === id ? { ...p, saved: !p.saved } : p));
    setViewProfile((prev) => prev?.id === id ? { ...prev, saved: !prev.saved } : prev);
  }, []);

  const promoteToPool = useCallback((id: string) => {
    // TODO: POST /api/talent-pool/:id/promote  →  creates a Candidate record
    console.log("[promote to pipeline]", id);
  }, []);

  // ── Bulk ───────────────────────────────────────────────────────────────────
  const bulkStatus = useCallback((s: TalentStatus) => {
    setPool((prev) => prev.map((p) => selectedIds.has(p.id) ? { ...p, status: s } : p));
    setSelectedIds(new Set());
  }, [selectedIds]);

  const bulkDelete = useCallback(() => {
    if (!confirm(`Remove ${selectedIds.size} profile(s)?`)) return;
    setPool((prev) => prev.filter((p) => !selectedIds.has(p.id)));
    setSelectedIds(new Set());
  }, [selectedIds]);

  const bulkEmail = useCallback(() => {
    const emails = pool.filter((p) => selectedIds.has(p.id)).map((p) => p.email).join(",");
    window.location.href = `mailto:${emails}`;
  }, [pool, selectedIds]);

  const toggleSelect  = (id: string) => setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const allSelected   = filtered.length > 0 && selectedIds.size === filtered.length;
  const selectAll     = () => setSelectedIds(new Set(filtered.map((p) => p.id)));
  const clearAll      = () => setSelectedIds(new Set());

  const SORT_LABELS = { none: "Default", score: "AI Score ↓", name: "Name A–Z", recent: "Last Contacted" } as const;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Talent Pool"
        subtitle={`${pool.length} profiles · ${pool.filter((p) => p.status === "Hot").length} Hot · ${filtered.length} shown`}
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={() => { setAiShortlist((p) => !p); }}>
              <Sparkles className={cn("h-4 w-4", aiShortlist ? "text-violet-400" : "")} />
              {aiShortlist ? "AI Shortlist On" : "AI Shortlist"}
            </Button>
            <Button size="sm" onClick={() => setShowAdd(true)}>
              <Plus className="h-4 w-4" /> Add Profile
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
              placeholder="Search name, role, skills, location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-subtle hover:text-foreground transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Button
            variant="secondary" size="sm"
            onClick={() => setShowFilters((p) => !p)}
            className={showFilters || activeFilterCount > 0 ? "border-primary/50 text-primary" : ""}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 py-px text-[10px] font-semibold text-white leading-none">{activeFilterCount}</span>
            )}
          </Button>

          <div className="relative" ref={sortRef}>
            <Button variant="secondary" size="sm" onClick={() => setSortOpen((p) => !p)}>
              <SortAsc className="h-4 w-4" /> {SORT_LABELS[sortMode]} <ChevronDown className="h-3 w-3" />
            </Button>
            {sortOpen && (
              <div className="absolute right-0 top-9 z-50 min-w-44 rounded-xl border border-border bg-surface py-1 shadow-(--shadow-elevated)">
                {(["none","score","name","recent"] as const).map((m) => (
                  <button key={m} onClick={() => { setSortMode(m); setSortOpen(false); }} className={cn("flex w-full items-center justify-between gap-2 px-3 py-1.5 text-xs transition-colors hover:bg-surface-elevated", sortMode === m ? "text-primary font-medium" : "text-foreground-muted hover:text-foreground")}>
                    {SORT_LABELS[m]} {sortMode === m && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Filter panel ── */}
        {showFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3">
            <span className="text-xs font-medium text-foreground-subtle mr-1">Status:</span>
            {(["All", ...ALL_STATUSES] as (TalentStatus | "All")[]).map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all", statusFilter === s ? "bg-primary text-white border-transparent" : "border-border text-foreground-muted hover:border-border-subtle hover:text-foreground")}>
                {s !== "All" && <StatusIcon status={s as TalentStatus} />}{s}
              </button>
            ))}
            <div className="w-px h-4 bg-border mx-1" />
            <span className="text-xs font-medium text-foreground-subtle mr-1">Availability:</span>
            {(["All", ...ALL_AVAIL] as (AvailStatus | "All")[]).map((a) => (
              <button key={a} onClick={() => setAvailFilter(a)} className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all", availFilter === a ? "bg-primary text-white border-transparent" : "border-border text-foreground-muted hover:border-border-subtle hover:text-foreground")}>
                {a}
              </button>
            ))}
            <div className="w-px h-4 bg-border mx-1" />
            <button onClick={() => setSavedOnly((p) => !p)} className={cn("flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium border transition-all", savedOnly ? "bg-amber-500 text-white border-transparent" : "border-border text-foreground-muted hover:border-border-subtle hover:text-foreground")}>
              <Bookmark className="h-3 w-3" /> Saved Only
            </button>
            {activeFilterCount > 0 && (
              <button onClick={() => { setStatusFilter("All"); setAvailFilter("All"); setSavedOnly(false); }} className="ml-auto flex items-center gap-1 text-xs text-foreground-subtle hover:text-foreground transition-colors">
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
        )}

        {/* ── Stats bar ── */}
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3">
          <Badge variant="info">Curated list</Badge>
          <Badge variant="default">Auto-match enabled</Badge>
          {aiShortlist && <Badge variant="info"><Sparkles className="h-3 w-3 mr-1" />AI Shortlist Active — score ≥ 80</Badge>}
          <span className="ml-auto text-xs text-foreground-subtle">Last enrichment: {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
        </div>

        {/* ── Table ── */}
        <div className="overflow-hidden rounded-xl border border-border shadow-card">
          {/* Header */}
          <div className="grid grid-cols-[2rem_2.5fr_1.5fr_auto_auto_1fr_2rem] gap-4 border-b border-border bg-surface-elevated px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-foreground-subtle">
            <div className="flex items-center">
              <input type="checkbox" className="h-3.5 w-3.5 accent-primary" checked={allSelected} onChange={(e) => e.target.checked ? selectAll() : clearAll()} />
            </div>
            <span>Profile</span>
            <span>Skills</span>
            <span>Status</span>
            <span>AI Score</span>
            <span>Last Contact</span>
            <span />
          </div>

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16">
              <Sparkles className="h-10 w-10 text-foreground-subtle opacity-40" />
              <p className="text-sm font-medium text-foreground">No profiles match</p>
              <p className="text-xs text-foreground-subtle">Adjust your search or filters</p>
              <Button size="sm" variant="secondary" className="mt-2" onClick={() => { setSearch(""); setStatusFilter("All"); setAvailFilter("All"); setSavedOnly(false); setAiShortlist(false); }}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="group relative grid grid-cols-[2rem_2.5fr_1.5fr_auto_auto_1fr_2rem] cursor-pointer items-center gap-4 bg-surface px-5 py-3.5 transition-colors hover:bg-surface-elevated"
                  onClick={() => setViewProfile(p)}
                >
                  {/* Checkbox */}
                  <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="h-3.5 w-3.5 accent-primary" checked={selectedIds.has(p.id)} onChange={() => toggleSelect(p.id)} />
                  </div>

                  {/* Identity */}
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={p.name} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-sm font-medium text-foreground group-hover:text-indigo-400 transition-colors">{p.name}</p>
                        {p.saved && <BookmarkCheck className="h-3 w-3 text-amber-400 shrink-0" />}
                        {p.rating >= 4 && (
                          <div className="flex shrink-0">
                            {Array.from({ length: Math.min(p.rating, 3) }).map((_, i) => <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                          </div>
                        )}
                      </div>
                      <p className="truncate text-xs text-foreground-subtle">{p.role}</p>
                      {p.location && <p className="text-[10px] text-foreground-subtle mt-0.5 flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{p.location}</p>}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="hidden flex-wrap gap-1 md:flex">
                    {p.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full border border-border bg-surface-elevated px-2 py-0.5 text-xs text-foreground-subtle">{tag}</span>
                    ))}
                  </div>

                  {/* Status */}
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{ backgroundColor: STATUS_META[p.status].color + "20", color: STATUS_META[p.status].color }}
                  >
                    <StatusIcon status={p.status} /> {p.status}
                  </span>

                  {/* Score */}
                  <div>
                    {p.score !== null
                      ? <div className="flex items-center gap-1.5"><ScoreBadge score={p.score} /><Sparkles className="h-3 w-3 text-violet-400 shrink-0" /></div>
                      : <span className="flex items-center gap-1 text-xs text-foreground-subtle"><Sparkles className="h-3 w-3" />—</span>
                    }
                  </div>

                  {/* Last contact */}
                  <span className="text-xs text-foreground-subtle">{formatRelativeTime(p.lastContact)}</span>

                  {/* Row menu */}
                  <div className="relative opacity-0 transition-opacity group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
                    <button onClick={(e) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); setMenuPos({ top: r.bottom + 4, right: window.innerWidth - r.right }); setOpenMenuId(openMenuId === p.id ? null : p.id); }} className="rounded-md p-1 text-foreground-subtle hover:bg-surface-hover hover:text-foreground transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {openMenuId === p.id && (
                      <ProfileMenu
                        profile={p}
                        onView={() => { setViewProfile(p); setOpenMenuId(null); }}
                        onEdit={() => { setEditProfile(p); setOpenMenuId(null); }}
                        onDelete={() => { deleteProfile(p.id); setOpenMenuId(null); }}
                        onStatusChange={(s) => { setStatus(p.id, s); setOpenMenuId(null); }}
                        onToggleSaved={() => { toggleSaved(p.id); setOpenMenuId(null); }}
                        onPromote={() => { promoteToPool(p.id); setOpenMenuId(null); }}
                        onClose={() => setOpenMenuId(null)}
                        anchor={menuPos ?? { top: 0, right: 0 }}
                      />
                    )}
                  </div>

                  {/* AI summary on hover */}
                  {p.summary && (
                    <div className="col-span-full mt-1 hidden pl-14 group-hover:block">
                      <div className="flex items-start gap-1.5 rounded-lg border border-violet-500/15 bg-violet-500/5 px-3 py-2">
                        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-400" />
                        <p className="text-xs text-foreground-muted">{p.summary}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bulk bar */}
      {selectedIds.size > 0 && (
        <BulkBar count={selectedIds.size} onStatus={bulkStatus} onEmail={bulkEmail} onDelete={bulkDelete} onClear={clearAll} />
      )}

      {showAdd && <ProfileModal onSave={saveProfile} onClose={() => setShowAdd(false)} />}
      {editProfile && <ProfileModal profile={editProfile} onSave={saveProfile} onClose={() => setEditProfile(null)} />}
      {viewProfile && (
        <ProfileDrawer
          profile={viewProfile}
          onClose={() => setViewProfile(null)}
          onEdit={() => { setEditProfile(viewProfile); setViewProfile(null); }}
          onDelete={() => deleteProfile(viewProfile.id)}
          onStatusChange={(s) => setStatus(viewProfile.id, s)}
          onRatingChange={(r) => setRating(viewProfile.id, r)}
          onToggleSaved={() => toggleSaved(viewProfile.id)}
          onPromote={() => promoteToPool(viewProfile.id)}
        />
      )}
    </div>
  );
}
