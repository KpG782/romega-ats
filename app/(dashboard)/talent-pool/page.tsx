import { Header } from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Badge, ScoreBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Search, Plus, Sparkles, Bookmark, Filter } from "lucide-react";

const TALENT = [
  { id: "1", name: "Pat Reyes", role: "Senior Frontend Engineer", score: 92, tags: ["React", "Next.js", "Design Systems"], status: "Hot" },
  { id: "2", name: "Mika Santos", role: "Product Designer", score: 86, tags: ["Figma", "UX Research", "Prototyping"], status: "Warm" },
  { id: "3", name: "Leo Cruz", role: "DevOps Engineer", score: 78, tags: ["AWS", "Terraform", "Kubernetes"], status: "Warm" },
  { id: "4", name: "Ivy Gomez", role: "Backend Engineer", score: 69, tags: ["Node.js", "Postgres", "Queues"], status: "Cold" },
];

export default function TalentPoolPage() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header
        title="Talent Pool"
        subtitle="Pre-qualified candidates for upcoming roles"
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4" />
              Add Profile
            </Button>
          </>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
          <Badge variant="info">Curated list</Badge>
          <Badge variant="default">Auto-match enabled</Badge>
          <span className="text-xs text-[var(--color-foreground-subtle)]">Last enrichment: 8:14 AM</span>
        </div>

        <Card padding="none">
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-[var(--color-foreground-subtle)]">
              <Search className="h-4 w-4" />
              Search by role, skills, or location
            </div>
            <Button variant="secondary" size="sm">
              <Sparkles className="h-4 w-4 text-violet-400" />
              AI shortlist
            </Button>
          </div>

          <div className="divide-y divide-[var(--color-border)]">
            {TALENT.map((candidate) => (
              <div key={candidate.id} className="flex items-center gap-4 px-6 py-4">
                <Avatar name={candidate.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base font-semibold text-[var(--color-foreground)]">{candidate.name}</p>
                  <p className="truncate text-sm text-[var(--color-foreground-subtle)]">{candidate.role}</p>
                </div>
                <div className="hidden flex-wrap gap-1 md:flex">
                  {candidate.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-2 py-0.5 text-xs text-[var(--color-foreground-subtle)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Badge variant={candidate.status === "Hot" ? "danger" : candidate.status === "Warm" ? "warning" : "outline"}>
                  {candidate.status}
                </Badge>
                <ScoreBadge score={candidate.score} />
                <Button variant="ghost" size="sm">
                  <Bookmark className="h-4 w-4" />
                  Save
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

